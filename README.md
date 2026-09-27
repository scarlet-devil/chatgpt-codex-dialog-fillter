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

Project names, assistant nicknames, model names, and local folder paths are not sufficient evidence of product ownership.

## Start here

- [Design and acceptance criteria](docs/DESIGN.md)
- [Upstream issues and patch references](docs/RESEARCH.md)
- [Local implementation handoff / 本地交接](docs/HANDOFF.md)
- [Project memory](PROJECT_MEMORY.md) and [work log](WORK_LOG.md)
- [Contributor instructions](AGENTS.md)

The next step is a read-only inspection of the current desktop app to identify reliable view and ownership metadata. Implementation depends on that evidence; this repository does not currently offer an installation command.
