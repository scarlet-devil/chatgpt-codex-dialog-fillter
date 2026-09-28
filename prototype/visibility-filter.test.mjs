import test from 'node:test';
import assert from 'node:assert/strict';
import { VisibilityFilter, threadKey, projectKey } from './visibility-filter.mjs';

const scope = { source: 'desktop', accountId: 'fixture-account', hostId: 'host-a' };
const project = (id, extra = {}) => ({ ...scope, projectKind: 'local', projectId: id, ...extra });
const thread = (id, extra = {}) => ({ ...scope, threadId: id, ...extra });
const assigned = p => ({ status: 'assigned', project: p });
const show = project('show'), hide = project('hide');
const row = (id, extra = {}) => ({ identity: thread(id), title: id, ...extra });
const context = { accountId: scope.accountId, mode: 'chatgpt', compatible: true };
const rules = [{ project: show, visibility: 'show' }, { project: hide, visibility: 'hide' }];
function setup() {
  const filter = new VisibilityFilter();
  filter.setContext(context);
  filter.setRules(rules);
  filter.setEnabled(true);
  return filter;
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function freeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
const ids = result => result.items.map(r => r.identity.threadId);

test('default off, unknown view and unsupported build preserve the exact original page', () => {
  const filter = new VisibilityFilter(), page = freeze({ items: [row('t')], cursor: 'next' });
  filter.setContext(context);
  filter.setRules(rules);
  filter.updateMembership(thread('t'), assigned(hide));
  assert.equal(filter.projectPage(page, 'thread').page, page);
  filter.setEnabled(true);
  assert.equal(filter.projectPage(page, 'thread').hidden, 1);
  for (const ctx of [{ ...context, mode: 'unknown' }, { ...context, compatible: false }]) {
    filter.setContext(ctx);
    assert.equal(filter.active, false);
    assert.equal(filter.projectPage(page, 'thread').page, page);
  }
});

test('project IDs, kinds and scopes decide visibility; names and paths do not', () => {
  const filter = setup();
  const rows = [show, hide, project('new'), project('hide', { projectKind: 'chatgpt' })]
    .map(identity => ({ identity, title: 'same name', cwd: 'same path' }));
  const result = filter.projectItems(rows, 'project');
  assert.deepEqual(result.items, [rows[0], rows[2], rows[3]]);
  assert.equal(result.uncovered, 2);
  rows[1].title = 'renamed';
  assert.equal(filter.projectItems(rows, 'project').hidden, 1);
});

test('wanted Work stays visible, known hide members disappear, unknown/projectless remain', () => {
  const filter = setup();
  filter.updateMembership(thread('chat'), assigned(show));
  filter.updateMembership(thread('work'), assigned(show));
  filter.updateMembership(thread('hidden'), assigned(hide));
  filter.updateMembership(thread('free'), { status: 'projectless' });
  const rows = freeze([row('chat'), row('work', { origin: 'tpp', category: 'codex' }),
    row('hidden'), row('free'), row('unknown')]);
  const result = filter.projectItems(rows, 'thread');
  assert.deepEqual(ids(result), ['chat', 'work', 'free', 'unknown']);
  assert.equal(result.hidden, 1);
  assert.equal(result.uncovered, 2);
  assert.equal(rows.length, 5);
});

test('empty pinned project key and stale search parent do not defeat current membership', () => {
  const filter = setup();
  filter.updateMembership(thread('t'), assigned(hide));
  const pinned = freeze([row('t', { projectKey: null })]);
  const search = freeze([row('t', { projectId: 'show', snippet: 'cached result' })]);
  assert.equal(filter.projectItems(pinned, 'thread').items.length, 0);
  assert.equal(filter.projectItems(search, 'thread').items.length, 0);
  filter.updateMembership(thread('t'), assigned(show));
  assert.equal(filter.projectItems(search, 'thread').items, search);
});

test('same thread/project IDs on different hosts, accounts and sources never join', () => {
  const filter = setup(), id = thread('same');
  filter.updateMembership(id, assigned(hide));
  for (const changed of [{ hostId: 'host-b' }, { accountId: 'another' }, { source: 'cloud' }]) {
    assert.notEqual(threadKey(id), threadKey(thread('same', changed)));
    assert.notEqual(projectKey(hide), projectKey(project('hide', changed)));
    assert.equal(filter.threadDecision(thread('same', changed)).hide, false);
    assert.equal(filter.projectDecision(project('hide', changed)).hide, false);
  }
});

test('missing identity, foreign project and conflicting project rules remain uncovered', () => {
  const filter = setup();
  filter.updateMembership(thread('t'), assigned(project('hide', { accountId: 'another' })));
  assert.equal(filter.threadDecision(thread('t')).reason, 'unresolved');
  assert.equal(filter.threadDecision({ threadId: 't' }).hide, false);
  filter.setRules([...rules, { project: hide, visibility: 'show' }, { project: hide, visibility: 'hide' }]);
  filter.updateMembership(thread('t'), assigned(hide));
  assert.equal(filter.threadDecision(thread('t')).reason, 'conflict');
});

test('frozen eligible source rows are not expanded or modified', () => {
  const filter = setup();
  filter.updateMembership(thread('already-excluded'), assigned(show));
  const input = freeze([row('present')]);
  assert.equal(filter.projectItems(input, 'thread').items, input);
  assert.equal(input.some(r => r.identity.threadId === 'already-excluded'), false);
});

test('an entirely hidden page retains its native next cursor and total', () => {
  const filter = setup();
  filter.updateMembership(thread('t'), assigned(hide));
  const original = freeze({ items: [row('t')], cursor: 'more', total: 50, source: { page: 1 } });
  const result = filter.projectPage(original, 'thread');
  assert.deepEqual(result.page.items, []);
  assert.equal(result.page.cursor, 'more');
  assert.equal(result.page.total, 50);
  assert.equal(result.page.source, original.source);
  assert.equal(original.items.length, 1);
  const next = { items: [row('other')], cursor: null };
  assert.equal(filter.projectPage(next, 'thread').page, next);
});

test('cached recent, pinned and search consumers recompute without a new query', () => {
  const filter = setup(), original = freeze([row('t')]);
  const views = new Map();
  const subscriptions = ['recent', 'pinned', 'expanded', 'search', 'archive', 'mentions']
    .map(name => filter.subscribe(() => views.set(name, filter.projectItems(original, 'thread'))));
  filter.updateMembership(thread('t'), assigned(hide));
  assert.equal(views.size, 6);
  for (const value of views.values()) assert.deepEqual(value.items, []);
  filter.updateMembership(thread('t'), assigned(show));
  for (const value of views.values()) assert.equal(value.items, original);
  filter.updateMembership(thread('t'), { status: 'projectless' });
  for (const value of views.values()) assert.equal(value.uncovered, 1);
  subscriptions.forEach(unsubscribe => unsubscribe());
});

test('rule edits and removal update already mounted results', () => {
  const filter = setup(), original = [row('t')];
  filter.updateMembership(thread('t'), assigned(show));
  let current;
  filter.subscribe(() => { current = filter.projectItems(original, 'thread'); });
  filter.setRules([{ project: show, visibility: 'hide' }]);
  assert.equal(current.hidden, 1);
  filter.setRules([]);
  assert.equal(current.items, original);
  assert.equal(current.uncovered, 1);
});

test('membership persistence rollback and later sidebar error use different snapshots', () => {
  const filter = setup(), id = thread('t');
  filter.updateMembership(id, assigned(show));
  filter.updateMembership(id, assigned(hide)); // Current optimistic native snapshot.
  assert.equal(filter.threadDecision(id).hide, true);
  filter.updateMembership(id, assigned(show)); // Native membership-save rollback.
  assert.equal(filter.threadDecision(id).hide, false);
  filter.updateMembership(id, assigned(hide)); // Membership saved successfully.
  // A secondary layout-save error has no membership update and cannot undo it.
  assert.equal(filter.threadDecision(id).hide, true);
});

test('an uncertain event order invalidates a hide decision until a reconciled snapshot', () => {
  const filter = setup(), id = thread('t');
  filter.updateMembership(id, assigned(hide));
  filter.invalidateMembership(id);
  assert.equal(filter.threadDecision(id).reason, 'unresolved');
  filter.updateMembership(id, assigned(show));
  assert.equal(filter.threadDecision(id).reason, 'show');
});

test('changing account clears rules and snapshots before reusing an ID', () => {
  const filter = setup();
  filter.updateMembership(thread('t'), assigned(hide));
  filter.setContext({ ...context, accountId: 'second-account' });
  assert.equal(filter.threadDecision(thread('t')).hide, false);
  filter.setContext(context);
  assert.equal(filter.getMembership(thread('t')).status, 'unresolved');
  filter.updateMembership(thread('t'), assigned(hide));
  assert.equal(filter.threadDecision(thread('t')).reason, 'unclassified');
});

test('Codex, disabling and disposal restore original references', () => {
  const filter = setup(), original = freeze([row('t')]);
  filter.updateMembership(thread('t'), assigned(hide));
  let mounted;
  filter.subscribe(() => { mounted = filter.projectItems(original, 'thread').items; });
  filter.setContext({ ...context, mode: 'codex' });
  assert.equal(mounted, original);
  filter.setContext(context);
  assert.equal(mounted, original); // Re-entry waits for a current native snapshot.
  filter.updateMembership(thread('t'), assigned(hide));
  assert.deepEqual(mounted, []);
  filter.setEnabled(false);
  assert.equal(mounted, original);
  filter.setEnabled(true);
  filter.dispose();
  assert.equal(mounted, original);
  filter.setEnabled(true);
  filter.setContext(context);
  assert.equal(filter.active, false);
});

test('one broken consumer cannot stop other consumers from restoring', () => {
  const errors = [], filter = new VisibilityFilter({ onListenerError: e => errors.push(e.message) });
  filter.setContext(context); filter.setRules(rules); filter.setEnabled(true);
  filter.updateMembership(thread('t'), assigned(hide));
  const original = [row('t')]; let mounted;
  filter.subscribe(() => { throw new Error('synthetic renderer failure'); });
  filter.subscribe(() => { mounted = filter.projectItems(original, 'thread').items; });
  filter.dispose();
  assert.equal(mounted, original);
  assert.deepEqual(errors, ['synthetic renderer failure']);
});

test('coalesced metadata lookup updates every cached consumer once', async () => {
  const filter = setup(), id = thread('t'), response = deferred();
  let calls = 0, mounted;
  filter.subscribe(() => { mounted = filter.projectItems([row('t')], 'thread'); });
  const lookup = async (query, { signal }) => {
    calls += 1; assert.equal(threadKey(query), threadKey(id)); assert.equal(signal.aborted, false);
    return response.promise;
  };
  const first = filter.resolveMembership(id, lookup), second = filter.resolveMembership(id, lookup);
  assert.equal(first, second);
  await Promise.resolve();
  response.resolve(assigned(hide));
  await first;
  assert.equal(calls, 1);
  assert.equal(mounted.hidden, 1);
});

test('lookup failure, missing result and malformed assignment remain visible', async () => {
  for (const answer of [() => { throw Error('unavailable'); }, () => null,
    () => assigned({ projectId: 'hide' }), () => ({ status: 'projectless' })]) {
    const filter = setup(), id = thread('t');
    await filter.resolveMembership(id, answer);
    assert.equal(filter.threadDecision(id).hide, false);
    assert.equal(filter.threadDecision(id).covered, false);
  }
});

test('failed lookups do not create render/retry loops; invalidation permits retry', async () => {
  const filter = setup(), id = thread('t'); let calls = 0;
  const lookup = () => { calls += 1; throw Error('unavailable'); };
  await filter.resolveMembership(id, lookup);
  await filter.resolveMembership(id, lookup);
  assert.equal(calls, 1);
  filter.invalidateMembership(id);
  await filter.resolveMembership(id, () => assigned(hide));
  assert.equal(filter.threadDecision(id).hide, true);
});

test('a late hide response cannot undo a newer show membership', async () => {
  const filter = setup(), id = thread('t'), response = deferred(); let signal;
  const pending = filter.resolveMembership(id, (_, options) => { signal = options.signal; return response.promise; });
  await Promise.resolve();
  filter.updateMembership(id, assigned(show));
  assert.equal(signal.aborted, true);
  response.resolve(assigned(hide)); await pending;
  assert.equal(filter.threadDecision(id).reason, 'show');
});

test('out-of-order enrichment responses cannot replace the newer lookup', async () => {
  const filter = setup(), id = thread('t'), old = deferred(), fresh = deferred();
  const before = filter.resolveMembership(id, () => old.promise);
  await Promise.resolve();
  filter.invalidateMembership(id);
  const after = filter.resolveMembership(id, () => fresh.promise);
  await Promise.resolve();
  fresh.resolve(assigned(show)); await after;
  old.resolve(assigned(hide)); await before;
  assert.equal(filter.threadDecision(id).reason, 'show');
});

for (const transition of ['disable', 'mode', 'account', 'invalidate', 'dispose']) {
  test(`pending lookup is ignored after ${transition}`, async () => {
    const filter = setup(), id = thread('t'), response = deferred(); let signal;
    const pending = filter.resolveMembership(id, (_, options) => { signal = options.signal; return response.promise; });
    await Promise.resolve();
    if (transition === 'disable') filter.setEnabled(false);
    if (transition === 'mode') filter.setContext({ ...context, mode: 'codex' });
    if (transition === 'account') filter.setContext({ ...context, accountId: 'other' });
    if (transition === 'invalidate') filter.invalidateAll();
    if (transition === 'dispose') filter.dispose();
    assert.equal(signal.aborted, true);
    response.resolve(assigned(hide)); await pending;
    assert.equal(filter.getMembership(id).status, 'unresolved');
    assert.equal(filter.threadDecision(id).hide, false);
  });
}

test('disabled or malformed lookups perform no I/O', async () => {
  const filter = new VisibilityFilter(); let calls = 0;
  const lookup = () => { calls += 1; return assigned(hide); };
  await filter.resolveMembership(thread('t'), lookup);
  filter.setContext(context); filter.setEnabled(true);
  await filter.resolveMembership({ threadId: 't' }, lookup);
  assert.equal(calls, 0);
});

test('caller mutation of a membership object cannot change a saved decision', () => {
  const filter = setup(), id = thread('t'), value = assigned({ ...hide });
  filter.updateMembership(id, value);
  value.project.projectId = 'show';
  assert.equal(filter.threadDecision(id).hide, true);
  assert.equal(Object.isFrozen(filter.getMembership(id).project), true);
});
