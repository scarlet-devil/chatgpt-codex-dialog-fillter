# One-way display filter

## Contract

When the active product view is ChatGPT, omit records confirmed to belong to Codex from project and conversation lists. When the active view is Codex, preserve the original rendering behavior. Do not mutate the records or their persisted visibility, archive, membership, or deletion state.

The words "active view" and "ownership" below describe product concepts, not independently verified API fields. Alice has reviewed the original local inspection reports privately. Complete static reproduction and runtime verification remain outstanding; this public design does not expose machine-specific evidence or claim an implemented schema.

## Classification

Both of these signals are required:

1. A reliable indication that the active top-level view is ChatGPT.
2. Reliable provenance or product metadata establishing that an item belongs to Codex.

Neither a local `cwd` nor a coding model name proves ownership. ChatGPT Work may use local folders. Names and titles are user-editable and must not be used as a product classifier.

### Constraint from the reported local inspection

The [inspection and review record](INSPECTION_SUMMARY_20260927.md) describes top-level modes, sidebar state, and project associations as distinct concepts. The native `All / Chat / Work` grouping maps `tpp` to an internal `codex` category; choosing `Chat` would exclude wanted Work content. The original report also distinguishes conversation filtering from project-row controls and search paths. Its four synthetic probe outcomes support a finding about native grouping, not ownership of real records. The complete anchor manifest and raw probe output are still pending independent review.

Keep three distinct concepts separate:

| Concept | Role in this feature | Evidence still needed |
| --- | --- | --- |
| Active top-level view | Determines whether the one-way filter should run | Verify agreement between top-level mode, sidebar surface state, and visible transitions; their naming schemes differ |
| Native list category | Describes how existing app filters group records | Reproduce the reported grouping evidence if needed; a label or default classification of unknown values does not establish product ownership |
| Product provenance and project association | Determines whether a record is wanted ChatGPT/Work content or unwanted Codex content | Review concrete fields, associations, missing values, and conflicting or mixed cases |

Do not implement this feature by selecting native `Chat` or by hiding every internal `codex` item. The reported legitimate `tpp` Work case must remain visible. That case is a required regression example, not proof that every record labeled `tpp` has the same ownership. Project association is a candidate source of evidence, not a sufficient predicate until its semantics are reviewed.

Before a prototype, write a documented decision table using the actual reviewed fields. It must distinguish confirmed wanted content, confirmed Codex content, and unknown/conflicting evidence. The two confirmed cases map to keep and hide respectively only while the verified ChatGPT view is active; outside it, preserve existing behavior. Unknown cases follow the inactive-filter behavior below. These behavior rules do not yet establish a field-level classifier.

### Product behavior decided by report review

This is the intended behavior to validate, not a claim that concrete provenance fields are already sufficient.

| Condition | Required behavior |
| --- | --- |
| Verified Codex view | Preserve the original rendering and caches |
| Verified ChatGPT view; content independently confirmed as ChatGPT or ChatGPT Work | Preserve its existing eligible visibility, regardless of native grouping |
| Verified ChatGPT view; content positively confirmed as Codex | Omit it from the derived display only |
| Mixed project containing confirmed wanted children | Keep the project and wanted children; omit only positively classified Codex children |
| Project positively established as wholly Codex, without wanted or unresolved content | May omit the project row under the same one-way display rule |
| Missing/conflicting provenance, unsupported schema, or uncertain active view | Leave the original UI intact and report filtering as inactive |

"Preserve" does not mean unhide archived or hidden helper records. Apply this feature to entries eligible under the app's existing visibility rules, without overriding unrelated exclusions or user settings.

All confirmed ChatGPT Work content must survive this filter. An internal coding label, a backend family, or absence of a ChatGPT project association cannot by itself establish Codex ownership. Validate positive provenance from independently known controlled cases; do not label test cases using the same classifier under review.

Project decisions require their own provenance and membership reasoning. An empty filtered page, an unloaded child list, or a page containing only Codex children cannot establish that an entire project is Codex-only. Mixed-project counts and ordering, if adjusted, must be derived without rewriting shared records. If the available metadata cannot support the required distinction, report the build as unsupported.

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
| Reported legitimate `tpp` Work conversation classified internally as `codex` | Remains visible in ChatGPT; native category alone must not trigger hiding |
| Mixed project with wanted and confirmed Codex children | Project and wanted children remain; only confirmed Codex children are omitted |
| Incomplete project pagination or absent ChatGPT association | Neither is accepted as proof of Codex-only ownership |
| Existing archived/hidden helper exclusions | Remain in effect; preserving Work does not unhide unrelated entries |
| Confirmed Codex project and conversation | Absent from relevant ChatGPT project and conversation lists |
| Missing or conflicting provenance and project associations | Preserve original visibility and disclose inactive filtering; do not guess from an internal category |
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
