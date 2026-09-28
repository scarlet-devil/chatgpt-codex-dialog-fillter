# Reversible visibility prototype

This is an original, dependency-free filtering core and a synthetic demonstration.
It does not connect to, patch or install anything in the desktop app. Filtering is
off by default. There are no built-in endpoints, persistence writes or real IDs.

## Run locally

Use Node.js 18 or later, from the repository root. No dependency installation is
needed:

```sh
node --test prototype/visibility-filter.test.mjs
```

`npm test` runs the same suite. To view the synthetic demo with Python installed:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/prototype/demo.html`. Stop the server with Ctrl+C.
The page uses fictional records only; its controls do not operate on real projects.
Enable filtering, move the example conversation, keep a search query unchanged,
switch to Codex, disable filtering, or remove and reset the prototype.

## Core contract

Import `VisibilityFilter` from `visibility-filter.mjs`. Each thread identity has
`source`, `accountId`, `hostId` and `threadId`; each project identity substitutes
`projectKind` and `projectId` for `threadId`. All fields must be nonempty strings.
`projectKind` separates local and ChatGPT project IDs. A verified cloud namespace
may supply a stable host scope; never substitute one shared placeholder for
distinct remote hosts. Names and paths are not identity fields.

```js
import { VisibilityFilter } from './prototype/visibility-filter.mjs';

const scope = { source: 'fixture', accountId: 'demo-account', hostId: 'demo-host' };
const project = { ...scope, projectKind: 'local', projectId: 'hidden-example' };
const identity = { ...scope, threadId: 'example-thread' };
const rows = [{ identity, title: 'Synthetic example' }];
const filter = new VisibilityFilter();
filter.setContext({ accountId: scope.accountId, mode: 'chatgpt', compatible: true });
filter.setRules([{ project, visibility: 'hide' }]);
filter.updateMembership(identity, { status: 'assigned', project });
filter.setEnabled(true); // A user-controlled opt-in, after adapter checks.
const result = filter.projectItems(rows, 'thread'); // result.items is empty.
filter.setEnabled(false);
filter.projectItems(rows, 'thread').items === rows; // true: original array restored.
filter.dispose();
```

The synthetic `compatible: true` above is not a desktop compatibility check.
A real adapter must establish the supported build and view before enabling.

| API | Adapter obligation / result |
| --- | --- |
| `setContext({ accountId, mode, compatible })` | Only verified `chatgpt` mode and compatible build can filter; any context change cancels lookups and clears memberships; account change also clears rules |
| `setRules([{ project, visibility }])` | Supply complete canonical project identities and `show`/`hide`; conflicting rules remain visible and uncovered; malformed rules throw before replacement |
| `updateMembership(identity, state)` | Pass the current reconciled native snapshot, not an unchecked broadcast payload |
| `invalidateMembership(identity)` / `invalidateAll()` | Clear stale decisions and cancel pending enrichment when freshness/order is uncertain |
| `resolveMembership(identity, lookup)` | Optional injected metadata-only lookup; coalesces requests, rejects stale completions, never fetches by itself |
| `projectItems(rows, kind, identityOf?)` | Supply original, already eligible and source-merged rows; returns `items`, `active`, `hidden`, `uncovered` |
| `projectPage(page, kind, identityOf?)` | Transforms `page.items` only; keeps cursors, native totals and other metadata |
| `subscribe(recompute)` | Subscribe each mounted derived list, including cached search results; returns an unsubscribe function |
| `setEnabled(false)` / `dispose()` | Notify consumers in bypass mode; `dispose()` then removes listeners and permanently disables this instance |

`kind` is `project` or `thread`. The default identity selector reads `row.identity`;
use a thin selector for native records. Membership is one of
`{ status: 'assigned', project }`, `{ status: 'projectless' }`, or
`{ status: 'unresolved' }`. Cache absence, malformed or missing lookup results and
unknown order must remain unresolved. Never infer projectlessness from them.

Unclassified, projectless, conflicting and unresolved items retain native visibility
and count as uncovered while active. An explicit show rule preserves only items
already eligible under the native view. It cannot restore an excluded record.

## Desktop adapter handoff

1. Resolve stable scoped IDs and only verified, unambiguous project aliases. Keep
   real rules and machine evidence private. Changes to aliases require invalidating
   old decisions and rebuilding rules/memberships against the new canonical mapping.
2. Keep original source rows after native eligibility, merging and deduplication.
   Read current membership separately; null pinned keys and stale search fields
   must not decide visibility. Do not write filtered arrays into shared caches.
3. Observe native membership/overlay and rollback changes, then read reconciled
   state. Membership-save rollback and later sidebar-save failure have different
   semantics. If ordering is uncertain, invalidate rather than accepting the last
   callback as authoritative. This core has no native global revision arbiter.
4. Subscribe every claimed surface, including expanded lists, existing search pages,
   archive and composer results, and recompute without requiring a new query.
   Changes to source rows also need their normal native refresh path.
5. Rehydrate current snapshots after context changes. Disabling preserves known
   memberships, so keep native subscriptions active while disabled, or invalidate
   and rehydrate before re-enabling after a subscription gap. Do the same on reconnect.
6. Use optional enrichment only through an independently verified metadata-only
   route. Do not call a full-conversation endpoint for filtering. Missing remote
   schema/coverage remains uncovered. A failed lookup is cached as unresolved to
   prevent render/retry loops; an explicit invalidation allows retry. Abort is
   advisory: ticket checks reject a late answer even if the lookup ignores abort.
7. Keep native pagination controls/cursors. An empty displayed page can still have
   more native pages. Native totals are not visible-result counts. Counts, shortcuts
   and alternative result branches exposing entries need their own derived binding.
8. Guard adapter/render errors with restoration of that surface's original rows.
   `onListenerError` isolates a failed consumer so others can restore; it cannot
   repair the failed renderer. On removal, stop native subscriptions, call `dispose()`
   while render bindings remain mounted to restore originals, then remove bindings
   and the injection. Verify removal in the actual app before claiming reversibility.

These requirements follow the [design](../docs/DESIGN.md) and
[local integration evidence](../docs/MEMBERSHIP_INTEGRATION.md). This core does not
replace native membership logic or validate undocumented remote schemas.

## Validation and next deliverable

Alice ran **27 passing Node tests** on synthetic data, including six simulated
mounted consumers, current-project changes, conflicting IDs/rules, both failure
snapshots, pagination metadata, stale asynchronous responses, context changes and
disable/disposal restoration. `node --check prototype/demo.mjs` also passed.
These are original-core tests, separate from Kelan's twenty offline native cases
and fifteen selected metadata lookups. They do not exercise native IPC or rendering.

The demo has not been rendered or interacted with in a browser in the cloud review
environment, which has no browser executable. Actual first paint, refresh timing,
pagination controls, mode switching and removal in the desktop app remain untested.
Unknown membership can remain visible, including while loading: this is a display
convenience, not a complete hiding guarantee or a storage/security boundary.

Next, Kelan can prepare thin native adapters and a reviewable, default-off reversible
injection or copied-app candidate against the privately recorded build, using the
located project/recent/pinned/expanded/search boundaries. Keep preparation isolated;
record which surfaces are wired and which remain uncovered. The current instruction
authorizes prototype preparation and the existing Draft update, not installation or
activation in the user's desktop app. Actual runtime acceptance follows that concrete
candidate. No real conversations need to be moved to prepare this deliverable.

## Local acceptance update — 2026-09-28

Kelan replayed all 27 tests and exercised the unchanged synthetic demo in a real
browser: 20 sequential checkpoints, 73 assertions, all passed. See the
[ordered acceptance record](../docs/PROTOTYPE_ACCEPTANCE.md) for reproduction and
precise coverage. This supersedes the earlier browser-unavailable limitation for
the demo only; native desktop integration and UI acceptance remain pending.
