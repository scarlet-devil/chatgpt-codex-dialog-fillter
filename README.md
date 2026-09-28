# chatgpt-codex-dialog-fillter

Apply a maintainer-specified project visibility list to the ChatGPT interface.

**Status: default-off prototype core and synthetic demo prepared; desktop integration
and runtime acceptance are pending. No application filter is installed.**

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

- [Run the prototype and read the adapter contract](prototype/README.md)
- [Traceable core and synthetic-browser acceptance](docs/PROTOTYPE_ACCEPTANCE.md)
- [Current design and acceptance](docs/DESIGN.md)
- [Project membership validation](docs/PROJECT_VISIBILITY_VALIDATION.md)
- [Current-project integration verification](docs/MEMBERSHIP_INTEGRATION.md)
- [Local handoff / 本地交接](docs/HANDOFF.md)
- [Earlier general ownership investigation](docs/OWNERSHIP_VALIDATION.md)
- [Original report review](docs/INSPECTION_SUMMARY_20260927.md)
- [Upstream references](docs/RESEARCH.md)
- [Project decisions](PROJECT_MEMORY.md), [work log](WORK_LOG.md), [instructions](AGENTS.md)

The original prototype core passes 27 synthetic Node tests. Earlier local native
probes and scoped metadata reads support the adapter design. Recent, pinned, expanded
lists and search still require real desktop integration and live freshness verification.
Local acceptance passed the 27 core tests and 20 synthetic-browser checkpoints
(73 assertions). Native desktop acceptance is still pending; no installer is provided.
A preserved ID in search is a lookup key, not proof of complete coverage.

This independent community experiment provides no account/storage/security isolation.
Private evidence stays in the maintainer's managed Drive channel. Public files contain
sanitized conclusions only, with no private links, IDs or raw application code.
