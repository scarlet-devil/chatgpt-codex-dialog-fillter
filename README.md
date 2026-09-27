# chatgpt-codex-dialog-fillter

Hide Codex projects and conversations from the ChatGPT view in the unified desktop app.

**Status: design draft. No working filter, installer, or supported app version yet.**

The first target is Windows. The desired behavior is one-way: the ChatGPT view shows ChatGPT content, while the Codex view continues to show its existing content. Hiding an item must not delete, archive, move, or modify the underlying project or conversation.

This is an independent community experiment, not an official OpenAI product. A visual filter would not provide account, storage, or security isolation.

## Scope

- Hide confirmed Codex projects and conversations in ChatGPT lists, including pinned items, recent items, and search results where those surfaces expose them.
- Preserve ChatGPT projects and conversations, including ChatGPT Work content backed by local folders.
- Leave the Codex view and stored histories unchanged.
- Support disabling the filter and returning to the original interface.

Project names, assistant nicknames, model names, and local folder paths are not sufficient evidence of product ownership. The reported native `Chat` filter and internal `codex` category are also insufficient: on the inspected build, they can exclude wanted `tpp` Work conversations.

## Start here

- [Design and acceptance criteria](docs/DESIGN.md)
- [Upstream issues and patch references](docs/RESEARCH.md)
- [Local implementation handoff / 本地交接](docs/HANDOFF.md)
- [Reported local inspection, 2026-09-27](docs/INSPECTION_SUMMARY_20260927.md)
- [Project memory](PROJECT_MEMORY.md) and [work log](WORK_LOG.md)
- [Contributor instructions](AGENTS.md)

Local static inspection of app package `26.924.2738.0` has been reported. Alice has now read both original reports through the private evidence channel and reviewed their reasoning. Conversation and project filtering require separate rules; the native grouping still does not establish product ownership. The next step is to validate the ownership contract on controlled cases before a prototype. The complete anchor manifest and raw probe output remain pending independent review; UI behavior, search coverage, and rollback remain unverified.

Machine-specific reports stay in the maintainer's private Drive channel. This public repository contains sanitized conclusions and specifications, without private report links or raw local evidence. No installation command is available yet.
