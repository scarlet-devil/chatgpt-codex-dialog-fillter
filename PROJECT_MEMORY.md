# Project memory

## Stable objective

In the unified desktop app, Codex projects and conversations must not appear in the ChatGPT interface. The Codex interface already behaves as desired for the reported use case.

The earlier idea of fully separating both histories has been narrowed to one-way interface visibility. The initial target is Windows. A local static inspection of app package `26.924.2738.0` was reported on 2026-09-27. Alice has read the two original reports privately. Subsequent anchor/probe reproduction is complete; runtime verification remains pending.

## Historical decisions — 2026-09-27

The provenance and mixed-project requirements below describe the earlier scope; the
2026-09-28 decision supersedes them for v1.

- Repository: [`scarlet-devil/chatgpt-codex-dialog-fillter`](https://github.com/scarlet-devil/chatgpt-codex-dialog-fillter), created and named by the maintainer.
- The maintainer authorized a public repository, commits, and a Draft PR.
- This initial contribution contains a design, research, and local handoff. It does not claim that a usable patch exists.
- Product view and content ownership must be established from actual app evidence. Local folders and ChatGPT Work are not automatically Codex content.
- Prefer a reversible, narrowly scoped interface change. Choose the implementation mechanism only after local feasibility review.
- The reported native `All / Chat / Work` classification maps `tpp` Work conversations into an internal `codex` category. Selecting `Chat`, or hiding every record with that category, is therefore not an acceptable ownership rule for the reported case.
- Revise the ownership criterion before a prototype. Preserve the reported legitimate `tpp` Work case, but do not generalize this into an unverified rule that all `tpp` records must always be retained.
- Preserve all content confirmed to belong to ChatGPT Work regardless of native grouping. Mixed projects require child-level decisions; conversation filtering does not establish project or search coverage.
- Absence of a ChatGPT association is not positive Codex provenance. An incomplete page cannot prove that an entire project is Codex-only.
- Keep machine-specific reports and evidence in the maintainer's private Drive channel. Public documentation contains necessary sanitized conclusions and progress only, with no private report links or raw local evidence.

## Current decision — 2026-09-28

The maintainer narrowed v1 to an explicit project-ID visibility list. Alice/show
projects preserve eligible entries; Kelan/hide projects and current members are
omitted in ChatGPT only. New/unclassified projects and projectless or unresolved
conversations retain native visibility and are explicitly uncovered. Moves follow
current membership. Mixed projects are unsupported, not a prerequisite. Creation
provenance and missing local Work examples no longer block this scope.

Private initialization proposes one hide and two uniquely identified show projects.
Two same-label candidates remain unclassified. No app settings were installed.
Ten new isolated native membership cases passed; scoped metadata reads demonstrate
usable associations for selected examples, not universal lookup completeness.

## Integration evidence — 2026-09-28

After Alice's report-level review, Kelan traced the current membership integration
paths and passed twenty offline native cases plus fifteen scoped metadata lookups.
Pinned layout keys can be null despite membership; search dedup can preserve old
row fields; separately keyed search caches need explicit recomputation. Membership
save failure rolls back, while later sidebar persistence failure does not undo a
successful membership save. These are static/offline findings, not UI acceptance.
See [integration boundaries](docs/MEMBERSHIP_INTEGRATION.md).

## Current open work

1. Resolve current membership by scoped conversation ID on recent, pinned, expanded
   lists and every search entry point, including unloaded hits.
2. Verify broadcast/overlay updates invalidate derived decisions on cached pages;
   measure moves, failures, hydration, first paint and mode transitions in the UI.
3. Select and validate a reversible mechanism without weakening security controls.

See [current design](docs/DESIGN.md), [new evidence](docs/PROJECT_VISIBILITY_VALIDATION.md)
and [shared log](WORK_LOG.md). This records project decisions, not personal transcripts.

## Deferred follow-up — 2026-09-28

The maintainer asked to revisit local Work instructions and cloud-project context continuity after Kelan completes the dialogue filter. This is a deferred research direction, not part of the current filter implementation or an additional acceptance prerequisite.

Questions to investigate later:

- Which user custom instructions, project instructions, and local `AGENTS.md` guidance actually load in a local Work session, and how are overlapping instructions resolved?
- Can that session access the intended ChatGPT project's files, memories, and shared work log, and how should it read the current authoritative materials?
- How should cloud/local collaboration roles and instruction entry points remain consistent with the actual execution environment?

Instruction inheritance and context availability in the maintainer's local Work sessions remain unverified. Do not assume that changing the work environment transfers all cloud instructions or memories. Resume this investigation after the filter is complete, following the maintainer's stated sequence.
