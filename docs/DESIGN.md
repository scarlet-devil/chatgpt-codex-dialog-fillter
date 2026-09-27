# One-way project visibility — v1

## Maintainer decision, 2026-09-28

V1 uses a maintainer-specified project list, keyed by unique project identity.
Conversations inherit the rule of their **current** project. Creation mode, native
category, model and original project do not decide visibility.

This supersedes the earlier general product-provenance classifier. The maintainer
reports no mixed projects in the present use case. Mixed projects are unsupported
in v1; missing mixed-project or local Work examples no longer block this scope.
No application filter or installer exists yet.

| Condition in the verified ChatGPT view | Required display behavior |
| --- | --- |
| Project explicitly marked show (Alice) | Preserve the project and its eligible conversations |
| Project explicitly marked hide (Kelan) | Omit the project and its conversations from derived lists |
| New/unclassified project | Native visibility; explicitly uncovered |
| Confirmed projectless conversation | Native visibility; explicitly uncovered |
| Missing, conflicting, stale or unresolved membership | Native visibility; explicitly unresolved/uncovered |
| Codex view, disabled filter, unknown mode or incompatible build | Native interface; unknown/unsupported states report filtering inactive |

Show/hide are display preferences, not changes to collaborator identity or claims
of immutable product ownership. Show does not reintroduce archived, hidden, helper
or otherwise natively excluded entries.

## Project identity and initial list

Bind each rule to the app's unique project ID within its existing source/account/host
scope. Equal labels or paths never merge projects. Respect remote host identity and
the distinction between local and ChatGPT project IDs. Use an existing verified
linked-project relation only when unambiguous; conflicting alias rules are unresolved.

The private proposed list contains one hide project and two uniquely identified show
projects from the maintainer's selection. Two candidates sharing a supplied label
remain unclassified until uniquely selected; this does not block other entries.
Actual IDs stay private. No settings have been installed.

A new project needs one classification. Rename preserves its ID rule; recreating a
same-name project does not inherit it. A later discovered mixed project is removed
from the classified list and treated as uncovered pending a separate supported rule.

## Current membership contract

Use native current membership, including explicit projectless state and live move
overlays. A null catalog project ID is insufficient: the inspected conversation has
an explicit assignment in separate native state. Cloud list records may carry
`gizmo_id` or projected `projectId`.

Recent, pinned, project-child and search adapters must resolve the same logical
conversation to the same current project. Use source/host plus conversation ID where
required, never titles, snippets or `cwd`. Search can retain `(hostId, threadId)` while
omitting membership. Join those IDs to current membership, or a verified metadata-only
lookup if missing. Cache absence is unresolved, not proof of projectlessness. Do not
fetch conversation bodies just to decide visibility.

Follow verified native membership precedence. A stale search page cannot override a
newer association. Conflicting sources with no verified precedence remain uncovered.
The filter must not write membership or source records; operate on derived lists.

## Moves and refresh

Show ↔ hide moves change visibility to the destination rule. Moving to an unclassified
project or out of all projects returns to uncovered native visibility. Failed moves
follow native rollback. No creation-history reconstruction is needed.

Recompute on membership/rule/alias changes, mode transitions and refresh/reconnect.
Existing search pages must recompute even when query text is unchanged. Respect native
revision checks so late rollback cannot replace a newer move. Static inspection found
membership broadcasts, cache updates and overlay/rollback helpers; isolated probes
passed. That is not proof of live freshness or rendering order.

## Surfaces and pagination

| Surface | Required integration |
| --- | --- |
| Project rows, including pinned projects | Explicit project rule; no full child enumeration needed |
| Expanded project lists | Current membership; stale parent container cannot win after a move |
| Recent and pinned conversations | Stable identity joined to current membership/overlay |
| Global, archived and composer search where conversations appear | Inventory each entry point; ID enrichment and re-evaluation of cached results |

Every surface claimed as supported needs observed tests. Unresolved items make
coverage incomplete. Keep native eligibility, shared caches and pagination cursors
intact. A fully hidden fetched page does not prove exhausted history. Counts, shortcuts
and alternate list branches need the same derived rule if they expose hidden entries.

Unknown membership intentionally preserves native visibility. Therefore this feature
does not guarantee hiding every conversation during loading or resolution failure.
Measure first-paint flashes and stale decisions as coverage failures.

## Candidate mechanism

Prefer a common derived-list predicate and thin source adapters. Preserve original
items for Codex mode and disabling. Native Chat selection, blanket internal `codex`
exclusion, name matching and path-based classification are unsuitable. Wanted `tpp`
entries inherit show exactly as ordinary chats do.

Runtime UI injection and a separate copied-app patch remain [research options](RESEARCH.md).
Choose only after confirming data access and reversibility. This design authorizes no
security-control changes, installed-bundle replacement or public debug endpoint.

## Acceptance

| Case | Expected result |
| --- | --- |
| Show project with ordinary and `tpp` children | All natively eligible entries preserved |
| Hide project and children | Omitted on each supported ChatGPT surface |
| Unclassified/new project and projectless chat | Native visibility; explicitly uncovered |
| Null catalog ID with valid assignment | Use verified assignment, not projectless inference |
| Equal labels/different IDs or equal thread IDs/different hosts | No cross-association |
| Rename or new project reusing label | Rule survives rename; new ID unclassified |
| Show ↔ hide move, move out, failed move, stale rollback | All surfaces follow current native membership and revision ordering |
| Search without project fields or unloaded hit | Resolve by scoped ID, otherwise uncovered |
| Pagination, rerender, reconnect, restart | No false exhaustion; current rule reapplied |
| ChatGPT → Codex → ChatGPT; disable | Native Codex rendering preserved; one-way rule restored appropriately |
| Existing hidden/helper/archive exclusions | No reintroduction of excluded entries |
| Mixed project | Unsupported/unclassified; not a v1 prerequisite |

Static probes do not replace UI acceptance. Record actual build, surfaces, refresh
latency, flashes, failure behavior and verified removal before claiming a working
filter. No histories, archive state, membership or shared records may be modified by
the filter. It provides display convenience, not storage/account/security isolation.
