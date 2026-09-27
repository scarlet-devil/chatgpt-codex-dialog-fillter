# Research notes

Checked on 2026-09-27. The search found matching reports and useful patching techniques, but no verified ready-to-install patch for this exact one-way filter. This is a bounded search result, not proof that no implementation exists anywhere.

## Matching upstream reports

| Source | Relevance | State when checked |
| --- | --- | --- |
| [openai/codex #40581](https://github.com/openai/codex/issues/40581) | Windows: Codex chats and projects appear after switching to the ChatGPT view; reported app version `26.818.8289.0` | Open; no fix was established by the inspected report |
| [openai/codex #35749](https://github.com/openai/codex/issues/35749) | Requests hiding local projects in ChatGPT Work without removing them from Codex; shared removal is not an acceptable workaround | Open; requests product-specific visibility |

The reported versions are source context, not supported versions of this project. Issue status can change after this research date.

## Implementation references

### Windows runtime injection

Repository: [JiaYang-BUAA/Codex-Desktop-Usage-Monitor-Windows](https://github.com/JiaYang-BUAA/Codex-Desktop-Usage-Monitor-Windows).

Inspected revision: `41a21c65948a457212cc292e42610a8d4e60f95a`.

- [`scripts/injector.mjs`](https://github.com/JiaYang-BUAA/Codex-Desktop-Usage-Monitor-Windows/blob/41a21c65948a457212cc292e42610a8d4e60f95a/scripts/injector.mjs) discovers loopback CDP targets, selects an `app://` page, validates the WebSocket destination, and evaluates a UI injection bundle.
- [`assets/usage-placement.js`](https://github.com/JiaYang-BUAA/Codex-Desktop-Usage-Monitor-Windows/blob/41a21c65948a457212cc292e42610a8d4e60f95a/assets/usage-placement.js) contains composer and placement heuristics.

Useful for studying a reversible injection route. It is a usage-monitoring tool, not a history filter. Its ordinary-chat composer detection does not establish a reliable top-level ChatGPT-versus-Codex classifier: ChatGPT Work remains a separate concern. Unrelated monitoring, telemetry, and auto-resume behavior are outside this project.

### Windows copied-app patch

Repository: [constansino/codex-desktop-session-limit-patch](https://github.com/constansino/codex-desktop-session-limit-patch).

Inspected revision: `f6d0a6c6ef904baac8771fea890aa6e0049aa8fb` (`master`).

- [`scripts/Install-CodexSessionLimitPatch.ps1`](https://github.com/constansino/codex-desktop-session-limit-patch/blob/f6d0a6c6ef904baac8771fea890aa6e0049aa8fb/scripts/Install-CodexSessionLimitPatch.ps1) copies an installed app, patches webview JavaScript, and creates a separate launch path.
- Its frontend patch replaces a limited recent-thread query with pagination. It checks expected bundle patterns and can require reapplication after an update.

Useful for studying packaging and version checks. It solves missing older histories, not product-view separation. Its string patterns are not evidence that the current application has the same internals.

### Small UI patch module

Repository: [gxanshu/codex-desktop-appimage](https://github.com/gxanshu/codex-desktop-appimage).

Inspected revision: `c78a4df076a475ca68f23a62e87a95e23bb6dc8c`.

- [`sidebar-project-name.js`](https://github.com/gxanshu/codex-desktop-appimage/blob/c78a4df076a475ca68f23a62e87a95e23bb6dc8c/linux-features/ui-tweaks/patches/sidebar-project-name.js) shows a narrowly scoped, idempotent sidebar styling patch.

Useful as a small UI-change reference. This is Linux packaging and styling, not a Windows filter or an ownership classifier.

## Evidence boundary

These sources were read, not installed or executed. This repository currently copies none of their implementation code. A future contributor must inspect the actual target build and check licensing before adapting code. Public research cannot establish what fields or hooks are available in the maintainer's installed app.
