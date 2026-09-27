# Project memory

## Stable objective

In the unified desktop app, Codex projects and conversations must not appear in the ChatGPT interface. The Codex interface already behaves as desired for the reported use case.

The earlier idea of fully separating both histories has been narrowed to one-way interface visibility. The initial target is Windows. A local static inspection of app package `26.924.2738.0` was reported on 2026-09-27; the original evidence is not yet available for cloud review.

## Decisions — 2026-09-27

- Repository: [`scarlet-devil/chatgpt-codex-dialog-fillter`](https://github.com/scarlet-devil/chatgpt-codex-dialog-fillter), created and named by the maintainer.
- The maintainer authorized a public repository, commits, and a Draft PR.
- This initial contribution contains a design, research, and local handoff. It does not claim that a usable patch exists.
- Product view and content ownership must be established from actual app evidence. Local folders and ChatGPT Work are not automatically Codex content.
- Prefer a reversible, narrowly scoped interface change. Choose the implementation mechanism only after local feasibility review.
- The reported native `All / Chat / Work` classification maps `tpp` Work conversations into an internal `codex` category. Selecting `Chat`, or hiding every record with that category, is therefore not an acceptable ownership rule for the reported case.
- Revise the ownership criterion before a prototype. Preserve the reported legitimate `tpp` Work case, but do not generalize this into an unverified rule that all `tpp` records must always be retained.

## Open questions

1. How do the reported top-level `work/codex` values map to the visible views on the inspected build? Review the original anchors before making them a feature gate.
2. Which combination of provenance and project associations distinguishes unwanted Codex content from wanted ChatGPT Work content, including the reported `tpp` case and mixed project containers?
3. Can every relevant list and search surface be filtered before it becomes visible?
4. Does the installed build support a reversible injection or copied-app workflow without weakening security controls?

See `docs/INSPECTION_SUMMARY_20260927.md` for the source and limits of the transferred findings, `docs/DESIGN.md` for acceptance criteria, and `WORK_LOG.md` for progress. This file records decisions, not a transcript of personal conversations.
