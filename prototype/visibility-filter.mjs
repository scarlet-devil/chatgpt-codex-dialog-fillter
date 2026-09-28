/**
 * Original, dependency-free display prototype. It does not connect to the app.
 * Adapters supply already eligible rows and authoritative membership snapshots.
 */
const text = value => typeof value === 'string' && value.length > 0;
const scopeFields = ['source', 'accountId', 'hostId'];
const unknown = Object.freeze({ status: 'unresolved' });
const projectless = Object.freeze({ status: 'projectless' });

function key(value, fields) {
  return value && fields.every(field => text(value[field]))
    ? JSON.stringify(fields.map(field => value[field]))
    : null;
}

export const threadKey = identity => key(identity, [...scopeFields, 'threadId']);
export const projectKey = identity => key(identity, [...scopeFields, 'projectKind', 'projectId']);

function membership(value, accountId) {
  if (value?.status === 'projectless') return projectless;
  if (value?.status !== 'assigned' || !projectKey(value.project)
      || value.project.accountId !== accountId) return unknown;
  const project = Object.fromEntries(
    [...scopeFields, 'projectKind', 'projectId'].map(field => [field, value.project[field]]),
  );
  return Object.freeze({ status: 'assigned', project: Object.freeze(project) });
}

const visible = reason => ({ hide: false, covered: false, reason });

export class VisibilityFilter {
  #enabled = false;
  #disposed = false;
  #context = { accountId: null, mode: 'unknown', compatible: false };
  #rules = new Map();
  #memberships = new Map();
  #pending = new Map();
  #listeners = new Set();
  #epoch = 0;
  #onListenerError;

  constructor({ onListenerError = () => {} } = {}) {
    this.#onListenerError = onListenerError;
  }

  get active() {
    return !this.#disposed && this.#enabled && this.#context.compatible === true
      && this.#context.mode === 'chatgpt' && text(this.#context.accountId);
  }

  subscribe(listener) {
    if (this.#disposed) return () => {};
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  #emit() {
    for (const listener of [...this.#listeners]) {
      try { listener(); } catch (error) {
        // One broken surface must not stop other surfaces from restoring.
        try { this.#onListenerError(error); } catch { /* Keep notifying consumers. */ }
      }
    }
  }

  #cancel(id) {
    const pending = this.#pending.get(id);
    this.#pending.delete(id);
    pending?.controller.abort();
  }

  #cancelAll() {
    this.#epoch += 1;
    for (const id of [...this.#pending.keys()]) this.#cancel(id);
  }

  setContext({ accountId, mode, compatible }) {
    if (this.#disposed) return;
    const next = { accountId, mode, compatible: compatible === true };
    if (Object.keys(next).every(k => next[k] === this.#context[k])) return;
    this.#cancelAll();
    // A view/context transition may have suspended native subscriptions.
    // Rehydrate current snapshots rather than reusing an old hide decision.
    this.#memberships.clear();
    if (accountId !== this.#context.accountId) {
      this.#rules.clear();
    }
    this.#context = next;
    this.#emit();
  }

  setEnabled(enabled) {
    if (this.#disposed || this.#enabled === (enabled === true)) return;
    this.#enabled = enabled === true;
    this.#cancelAll();
    this.#emit();
  }

  /** Conflicting rules for one canonical identity preserve native visibility. */
  setRules(rules) {
    if (this.#disposed) return;
    const next = new Map();
    for (const { project, visibility } of rules) {
      const id = projectKey(project);
      if (!id || !['show', 'hide'].includes(visibility)) {
        throw new TypeError('Rules require a fully scoped project and show/hide visibility');
      }
      next.set(id, next.has(id) && next.get(id) !== visibility ? 'conflict' : visibility);
    }
    this.#rules = next;
    this.#emit();
  }

  /** Pass reconciled native state, never an unchecked arrival-order event. */
  updateMembership(identity, value) {
    if (this.#disposed) return;
    const id = threadKey(identity);
    if (!id || identity.accountId !== this.#context.accountId) return;
    this.#cancel(id);
    this.#memberships.set(id, membership(value, identity.accountId));
    this.#emit();
  }

  invalidateMembership(identity) {
    if (this.#disposed) return;
    const id = threadKey(identity);
    this.#cancel(id);
    this.#memberships.delete(id);
    this.#emit();
  }

  /** Use on reconnect or whenever the adapter cannot establish current ordering. */
  invalidateAll() {
    if (this.#disposed) return;
    this.#cancelAll();
    this.#memberships.clear();
    this.#emit();
  }

  getMembership(identity) {
    if (identity?.accountId !== this.#context.accountId) return unknown;
    return this.#memberships.get(threadKey(identity)) ?? unknown;
  }

  /**
   * Optional metadata-only lookup. No endpoint or network client is built in.
   * Failed/missing answers remain unresolved until an explicit invalidation.
   */
  resolveMembership(identity, lookup) {
    const id = threadKey(identity);
    if (!this.active || !id || identity.accountId !== this.#context.accountId
        || typeof lookup !== 'function') return Promise.resolve(unknown);
    if (this.#memberships.has(id)) return Promise.resolve(this.#memberships.get(id));
    if (this.#pending.has(id)) return this.#pending.get(id).promise;
    const query = Object.freeze(Object.fromEntries(
      [...scopeFields, 'threadId'].map(field => [field, identity[field]]),
    ));
    const ticket = { epoch: this.#epoch, controller: new AbortController() };
    const current = () => this.active && this.#epoch === ticket.epoch
      && this.#pending.get(id) === ticket;
    const accept = value => {
      if (!current()) return this.#memberships.get(id) ?? unknown;
      const resolved = membership(value, query.accountId);
      this.#memberships.set(id, resolved);
      this.#emit();
      return resolved;
    };
    ticket.promise = Promise.resolve()
      .then(() => current() ? lookup(query, { signal: ticket.controller.signal }) : unknown)
      .then(accept, () => accept(unknown))
      .finally(() => {
        if (this.#pending.get(id) === ticket) this.#pending.delete(id);
      });
    this.#pending.set(id, ticket);
    return ticket.promise;
  }

  projectDecision(identity) {
    if (!this.active) return visible('inactive');
    const id = projectKey(identity);
    if (!id || identity.accountId !== this.#context.accountId) return visible('unresolved');
    const rule = this.#rules.get(id);
    if (rule !== 'show' && rule !== 'hide') return visible(rule === 'conflict' ? 'conflict' : 'unclassified');
    return { hide: rule === 'hide', covered: true, reason: rule };
  }

  threadDecision(identity) {
    if (!this.active) return visible('inactive');
    if (!threadKey(identity) || identity.accountId !== this.#context.accountId) return visible('unresolved');
    const state = this.getMembership(identity);
    if (state.status !== 'assigned') return visible(state.status);
    return this.projectDecision(state.project);
  }

  /** Filter only an already eligible, source-merged list; never mutate its rows. */
  projectItems(items, kind, identityOf = row => row.identity) {
    if (!['project', 'thread'].includes(kind)) throw new TypeError('Unknown row kind');
    if (!this.active) return { items, active: false, hidden: 0, uncovered: 0 };
    let hidden = 0, uncovered = 0;
    const retained = items.filter(item => {
      const identity = identityOf(item);
      const decision = kind === 'project' ? this.projectDecision(identity) : this.threadDecision(identity);
      if (!decision.covered) uncovered += 1;
      if (decision.hide) hidden += 1;
      return !decision.hide;
    });
    return { items: hidden ? retained : items, active: true, hidden, uncovered };
  }

  /** Preserve native cursor/total metadata; native total is not a visible count. */
  projectPage(page, kind, identityOf) {
    const result = this.projectItems(page.items, kind, identityOf);
    return { ...result, page: result.items === page.items ? page : { ...page, items: result.items } };
  }

  /** Notify mounted consumers once in bypass mode, then detach all listeners. */
  dispose() {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#enabled = false;
    this.#cancelAll();
    this.#memberships.clear();
    this.#rules.clear();
    try { this.#emit(); } finally { this.#listeners.clear(); }
  }
}
