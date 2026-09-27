# Project memory

## Stable objective

In the unified desktop app, Codex projects and conversations must not appear in the ChatGPT interface. The Codex interface already behaves as desired for the reported use case.

The earlier idea of fully separating both histories has been narrowed to one-way interface visibility. The initial target is Windows; the exact installed build is not yet recorded.

## Decisions — 2026-09-27

- Repository: [`scarlet-devil/chatgpt-codex-dialog-fillter`](https://github.com/scarlet-devil/chatgpt-codex-dialog-fillter), created and named by the maintainer.
- The maintainer authorized a public repository, commits, and a Draft PR.
- This initial contribution contains a design, research, and local handoff. It does not claim that a usable patch exists.
- Product view and content ownership must be established from actual app evidence. Local folders and ChatGPT Work are not automatically Codex content.
- Prefer a reversible, narrowly scoped interface change. Choose the implementation mechanism only after local feasibility review.

## Open questions

1. Which current app state reliably identifies the active ChatGPT or Codex view?
2. Which record metadata distinguishes Codex-owned content from ChatGPT-owned content, including Work and mixed project containers?
3. Can every relevant list and search surface be filtered before it becomes visible?
4. Does the installed build support a reversible injection or copied-app workflow without weakening security controls?

See `docs/DESIGN.md` for acceptance criteria and `WORK_LOG.md` for progress. This file records decisions, not a transcript of personal conversations.
