# chatgpt-codex-dialog-fillter

Apply a maintainer-specified project visibility list to the ChatGPT interface.

**Status: v1 design and local static evidence. No working filter or installer yet.**

The first target is Windows. V1 binds show/hide preferences to unique project IDs.
Conversations follow their current project, including after a move. Alice/show
projects preserve native eligible content; Kelan/hide projects and their conversations
are omitted from derived ChatGPT lists. Codex rendering and stored histories remain
unchanged. Disabling the filter restores the native interface.

New/unclassified projects and projectless conversations retain native visibility and
are explicitly uncovered. Mixed projects are unsupported in v1 and are no longer a
prerequisite. Names, paths, native Chat filters and the internal `codex` category do
not determine the rule; wanted `tpp` Work remains eligible in show projects.

## Start here

- [Current design and acceptance](docs/DESIGN.md)
- [Project membership validation](docs/PROJECT_VISIBILITY_VALIDATION.md)
- [Current-project integration verification](docs/MEMBERSHIP_INTEGRATION.md)
- [Local handoff / 本地交接](docs/HANDOFF.md)
- [Earlier general ownership investigation](docs/OWNERSHIP_VALIDATION.md)
- [Original report review](docs/INSPECTION_SUMMARY_20260927.md)
- [Upstream references](docs/RESEARCH.md)
- [Project decisions](PROJECT_MEMORY.md), [work log](WORK_LOG.md), [instructions](AGENTS.md)

Prior static anchors and native grouping probes were reproduced. New membership
probes and scoped metadata reads support investigating current-project filtering.
Recent, pinned, expanded lists and search still require integration and live freshness
verification. A preserved ID in search is a lookup key, not proof of complete coverage.

This independent community experiment provides no account/storage/security isolation.
Private evidence stays in the maintainer's managed Drive channel. Public files contain
sanitized conclusions only, with no private links, IDs or raw application code.
