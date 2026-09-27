# Ownership validation follow-up

Kelan, local evidence verification, 2026-09-28. Input design:
`9db9e40c5fb2c8338f02685dacf194bc2f60a9e2`. State: `review_pending`.

**Static reproduction and limited metadata checks are complete; the general ownership
contract remains unvalidated. This is not a filtering prototype or UI acceptance.**

## Verified progress

- Reproduced all 21 original anchors and four native grouping cases against the
  previously inspected assets. Expanded to 25 passing offline cases using exact
  extracted functions, with helper and transport stubs explicitly recorded privately.
- Traced assignment precedence, mutable project association, native path fallback,
  native visibility exclusions and lossy metadata projections.
- Used maintainer-identified existing projects as an independent expectation source
  for limited metadata checks. Read no conversation bodies. Project-level expectations
  were not promoted into labels for every child's creation workflow.
- Compared the same selected record across metadata stores and its separate project
  assignment. The available fields differed. Missing metadata must not become a
  negative ownership test.

The original manifest, raw probe results, environment details and new evidence belong
in the private handoff channel. This document contains no private links, IDs, paths,
asset fingerprints, real titles or copied application code. Transfer status is
reported separately; preparing a packet does not establish its delivery or review.
The combined evidence packet has now been delivered through the managed private
channel with a successful receipt. Alice's review of this new packet is pending.

## Implications for the field contract

| Evidence | Established meaning | Remaining boundary |
| --- | --- | --- |
| Native category / origin grouping | Existing grouping behavior | Not product ownership; preserve confirmed Work |
| Project assignment and linked backing | Current association, including association changed by move operations | Not immutable creation provenance; conflicts need explicit handling |
| Path fallback | Existing heuristic | Not sufficient ownership evidence |
| Catalog and history projections | Some provenance fields are omitted or normalized | Missing fields do not establish Codex ownership |
| Search result projection | Separate path with less provenance than source records | Requires its own metadata-resolution and coverage validation |
| Native helper exclusions | Existing eligibility constraints | A keep rule must not reintroduce excluded records |

An independently known Codex example is evidence for that example, not proof that
its field combination distinguishes all Codex from local Work. Likewise, a known
wanted cloud project can contain different native origin categories. No individual
native label, backend family, originator spelling, local path or absent association
has been established as a general positive Codex predicate.

## Coverage and prototype gate

The maintainer identified existing Codex and cloud Work projects. No local Work or
mixed-project sample was available. An ordinary ChatGPT conversation with an
individually known creation entry was not supplied. Synthetic cases cover native
function behavior only; they do not fill these real-case gaps. An empty cached
project is not evidence of empty remote membership.

Before selecting a prototype, validate the missing cases with independently known
creation provenance and establish how equivalent evidence reaches recent, pinned,
project-child and search surfaces. Mode transitions, hydration, first paint, complete
pagination, UI behavior and rollback remain untested.

The [existing design](DESIGN.md) remains in force: retain confirmed ChatGPT Work,
decide mixed membership per child, and preserve the original UI with filtering
inactive when evidence is insufficient. Do not generalize the observed examples
into a hide rule or weaken the gate to make a prototype appear ready.
