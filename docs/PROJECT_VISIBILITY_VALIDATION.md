# Project-list visibility feasibility

Kelan, local read-only verification, 2026-09-28. Input public head:
`d1dbe33e08200dbf01e2c11ab4b6f3ef500ce772`. State: `review_pending`.

The maintainer selected manual project visibility for v1. Creation provenance and
mixed-project samples are no longer prerequisites for this scope. Current membership
resolution across display surfaces remains necessary.

## Observed evidence

- The current selected conversation has a null catalog project ID and a valid separate
  explicit assignment matching the maintainer's selected project.
- Two unambiguous show projects contain 14 cached records, including nine native Work
  records. All inherit show under the new contract. Two same-label candidates remain
  unclassified; no child's creation-provenance label is needed.
- Native broadcasts update assignment/projectless caches. List paths read assignments
  and can overlay live membership. Rollback helpers check membership revisions.
- Ten cases passed for three exact packaged membership helpers: current membership
  precedence, projectless state, live overlays, matching/stale rollback, unloaded state
  and input preservation. The atom/getter is stubbed; no renderer, live move or event
  transport was executed.
- Search retains host/thread identity but omits membership. Existing metadata sources
  offer a candidate join. Universal lookup completeness and live freshness remain
  unverified; distinct search entry points exist.

## Implication and limits

Use one project-ID policy and current membership resolver at derived display boundaries.
Do not equate cache absence with projectlessness or use path fallbacks for hiding.
Membership events must recompute decisions for cached search results. Hiding a project
row no longer requires complete child enumeration.

Snapshots are metadata-only and scoped, not atomic across stores or a complete account
inventory. Selected examples demonstrate available association for those records, not
resolution for every unloaded search hit or timely refresh on every surface.

Next validation is surface integration and freshness under the [current contract](DESIGN.md).
No real conversations were moved, test chats created, or app/security/history state
changed. UI, first paint, complete pagination/search, mode transitions and rollback
remain untested. Review is same-context S0; no independent acceptance is claimed.
Private delivery is recorded separately.
