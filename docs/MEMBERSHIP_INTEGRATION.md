# Current-project integration verification

Kelan, local engineering verification, 2026-09-28. Input reviewed head:
`9800145eee314530dc5c8fc9e7061ef488cc204f`. Project state: `review_pending`.

**The static integration investigation and offline replay are complete for the paths
below. This is not an installed filter or runtime UI acceptance.** The current
project-list design remains unchanged. No mixed-project or creation-provenance gate
is reintroduced, and deferred local Work instruction research remains deferred.

## Entry points and required joins

| Surface | Observed native data path | Integration requirement |
| --- | --- | --- |
| Recent conversations | Current task/source records and derived project associations feed layout entries | Resolve membership before the final display list; preserve original records |
| Pinned conversations | Layout entries deliberately use a null project key even when original conversation metadata has an association | Join back through the original conversation map; null layout key is not projectless |
| Expanded project children | Current assignments, linked-project relations and pending drop state feed groups; cloud moves also update project caches | Prefer current membership over an old parent container; unloaded target caches remain unresolved |
| Cloud project search | Search IDs are deduplicated, batch-enriched and projected with project IDs | Useful enrichment pattern, but this project-only pipeline drops projectless and missing responses; it cannot replace a general fail-open search filter |
| General cloud search and cloud composer mentions | Separately keyed search queries; a mention projection keeps only ID/title | Enrich by cloud-scoped ID without relying on a title or displayed container |
| Local/remote composer search | Host/thread IDs survive projection; dedup merges snippets into an earlier row without replacing all old fields | Join membership after dedup and use host-scoped identity |
| Archived search | Separate queries/projections and native archive eligibility | Preserve that surface's eligibility and enrich independently; sidebar support does not establish archive-search support |

These are inspected code paths, not an observed inventory of every screen instance.
Fifteen previously authorized cached examples were looked up by scoped ID: fourteen
show-project members and one explicit hide-project assignment. The latter also has
a matching membership-host binding despite a null catalog project ID. No conversation
body or live search request was read. This proves joins for those records, not full
account coverage, unloaded-result availability or freshness.

## Changes, old results and failures

The native membership handler updates assignment/projectless query state, cancels
pending reads and waits for state agreement. List consumers can overlay current move
state onto saved assignments. Offline replay confirmed those transformations using
synthetic query/atom dependencies; it did not exercise actual IPC or rendering.

Cloud move helpers update existing conversation pages and project child caches.
Their collection predicate includes project collections and project search, plus
explicitly tagged collections. It does **not** include independently keyed untagged
general/composer/archive searches by default. No full application-wide invalidation
claim is made. A filter must explicitly recompute membership on cached results for
each source, including after a query's text stops changing.

| Event/failure | Verified native behavior | Filter implication |
| --- | --- | --- |
| Membership save fails | Restore pending sidebar/workspace state, surface failure, skip later sidebar persistence | Follow restored membership |
| Membership succeeds but secondary sidebar persistence fails | Log warning and return success; no membership rollback | Retain the new membership; do not interpret every side-effect failure as a failed move |
| Older workspace rollback arrives | Revision check prevents replacement of newer workspace membership | Use the native revision boundary where available |
| Two membership updates arrive out of order at the plain reducer | Last arrival wins; that reducer has no general revision arbitration | Do not promote the workspace rollback guard into a guarantee for every broadcast |
| Destination project cache is unloaded | Native move helper does not materialize a missing cache | Resolve from membership; do not infer from the absent child list |
| Batch search enrichment fails or omits a result | Project-search pipeline rejects or drops unresolved entries | The proposed general adapter must preserve original unresolved entries and disclose incomplete coverage |

## Proposed adapter boundary

This is a concrete integration contract for the subsequent prototype, not an already
implemented application adapter:

1. Keep each source's original eligible result set and pagination cursor. Normalize
   identity to the source/account scope and host where applicable, plus conversation ID.
2. Resolve against the current native membership/overlay, including explicit
   projectless state. Use cached project fields only with verified precedence. Missing
   data or conflicting identities return unresolved; no path/title fallback.
3. Apply the configured project-ID rule after source merging/dedup. Reuse this
   decision for list rows and their derived display metadata. An old projection or
   container must not override a newer current association.
4. Recompute existing results on membership, alias, rule and mode changes. Associate
   pending enrichment with its initiating scope/current-state snapshot; a response
   from an obsolete scope or membership state cannot restore an old hide decision.
   If ordering cannot be established, invalidate the decision and leave it uncovered.
5. Lookup failures preserve native visibility for unresolved entries. Disabling or
   leaving ChatGPT bypasses the derived rule and restores original lists. The adapter
   writes neither membership nor shared history and creates no background service.

The inspected native cloud reconciliation path can request full conversation data.
It was not called, and it is not approved as a metadata-only lookup for this feature.
The batch route's full live response schema also remains unverified. Prefer already
available metadata; unresolved remote-only hits remain uncovered until an appropriate
lookup is verified. This limitation does not require rendering tests before a
reversible prototype can be built.

## Verification and next phase

Twenty named offline cases passed over twenty-one extracted native helpers. Evidence
includes all fixture inputs, assertions, expected/actual values, dependency stubs and
an executable harness. A separate extraction/replay directory reproduced the results
after checking two asset hashes and all function slice hashes. Native source bodies
remain local; the private packet includes the extraction specification and scripts,
not those bodies. Independent replay requires the matching local application package.

The scoped metadata lookup resolved fifteen examples. A nonexistent synthetic ID
remained missing, not projectless. Snapshots across stores are not atomic.

No application patch, real move, test conversation creation, security change or
history write occurred. Review is same-context S0. Native helper replay is distinct
from actual transport, cache scheduling, refresh latency, first paint, pagination,
mode switching and disable/restore acceptance. Those checks belong to the later
authorized reversible-prototype phase. The evidence supports preparing that prototype
around the boundaries above, with uncovered remote lookup cases explicitly retained.
