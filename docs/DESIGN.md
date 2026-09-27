# One-way display filter

## Contract

When the active product view is ChatGPT, omit records confirmed to belong to Codex from project and conversation lists. When the active view is Codex, preserve the original rendering behavior. Do not mutate the records or their persisted visibility, archive, membership, or deletion state.

The words "active view" and "ownership" below describe concepts to investigate; they are not verified API fields. This draft deliberately does not invent selectors or record schema for an uninspected app build.

## Classification

Both of these signals are required:

1. A reliable indication that the active top-level view is ChatGPT.
2. Reliable provenance or product metadata establishing that an item belongs to Codex.

Neither a local `cwd` nor a coding model name proves ownership. ChatGPT Work may use local folders. Names and titles are user-editable and must not be used as a product classifier.

For a project containing mixed or unknown-origin items, determine how the app represents membership before choosing a rule. Do not hide a ChatGPT project merely because one child looks like a Codex conversation. If the available metadata cannot support the required distinction, report that the build is unsupported.

If the active view, ownership schema, or compatibility check is unknown, leave the original UI intact and visibly report that filtering is inactive. This preserves data and avoids silently hiding legitimate ChatGPT items; it also means the visibility requirement is not met in that state.

## Candidate mechanisms

| Mechanism | Why investigate it | Unresolved constraints |
| --- | --- | --- |
| Runtime UI injection | A Windows community tool demonstrates loopback CDP injection into an app page without rewriting the official bundle | Current build must support the approach; mode and item metadata must be accessible; changes must survive rerenders and mode changes; late injection can expose unwanted rows briefly |
| Patch a separate copy of the application | A Windows pagination patch demonstrates modifying copied webview assets while preserving the original install | Bundle signatures and packaging may differ; lifecycle and updates need checking; a copied app may use separate Electron user data; maintenance is version-specific |

These are research options, not installation instructions. Do not enable remote debugging on a network interface, disable security controls, replace the installed application, or modify user data merely to reproduce a reference project. Stop and document a constraint if the approach needs an unapproved change.

Prefer a filter at a verified list/render boundary over text matching or broad CSS. Apply it only in the ChatGPT view, and recompute when the view changes. Any shared cache must retain the original items so switching to Codex immediately restores its normal lists.

For paginated results, hiding one fetched page must not incorrectly report that the history is empty or exhausted. Search, recent items, pinned items, and project children may use different sources; inventory them before claiming completeness.

## Acceptance matrix

Use synthetic project and conversation names for evidence.

| Case | Expected result |
| --- | --- |
| ChatGPT project and ordinary conversation | Remain visible and usable in ChatGPT |
| ChatGPT Work project backed by a local folder | Remains visible; not misclassified by its folder |
| Confirmed Codex project and conversation | Absent from relevant ChatGPT project and conversation lists |
| Pinned, recent, search, and expanded project lists | Apply the same rule wherever that surface can return Codex content |
| Pagination, newly created item, rerender, and restart | No persistent reappearance; legitimate ChatGPT results remain discoverable |
| ChatGPT → Codex → ChatGPT | Codex rendering remains normal; the ChatGPT filter is reapplied correctly |
| Slow startup or delayed metadata | No claim of complete filtering if Codex names flash before the filter runs |
| Unknown mode, metadata, or unsupported build | Original UI preserved; filter explicitly reported as inactive |
| Disable or remove the patch | Original interface returns; underlying records remain accessible |

Every surface claimed as supported needs an observed pass. A runtime prototype that briefly reveals Codex rows is a partial result, not full acceptance of "do not appear".

## Verification and rollback

Record the app version, operating system, patch commit, relevant asset identifiers, coverage, and rollback steps. Compare normal Codex behavior and representative record accessibility before and after applying the prototype. Check for unintended persistent writes by the patch; ordinary app activity can change files and should not be confused with patch mutations.

For a runtime prototype, verify that disabling its launcher/injection and restarting restores normal rendering. For a copied-app prototype, retain the original installation and verify reopening it without the prototype. Do not publish a rollback command until its actual paths and effects have been tested.

This is a visual convenience feature. It does not isolate storage, accounts, permissions, or model context, and it is not a privacy boundary between people sharing a device.
