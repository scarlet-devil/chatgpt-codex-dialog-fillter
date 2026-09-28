# Prototype acceptance — 2026-09-28

**Accepted within the original core and synthetic-demo scope. Desktop integration
and native UI acceptance remain pending. Keep the PR Draft / `review_pending`.**

Kelan locally reviewed and exercised input
`0d3f3cee6716a95cb95777cb238dd8596b9e8a55`. The core, demo and original test
files were unchanged throughout this acceptance. No desktop filter was installed.

The local checkout uses CRLF while these Git blobs use LF. Source comparison
passed after that exact line-ending conversion only; the private evidence records
both Git-blob and tested-checkout SHA-256 values. No logical source changes occurred.

This is an actual local rerun and browser exercise, separate from Alice's cloud
checks. Kelan's report self-review is S0; no formal S2 review is claimed.

## Evidence and reproduction

From the pinned checkout run:

```sh
node --test --test-reporter=tap prototype/visibility-filter.test.mjs
node --check prototype/demo.mjs
python -m http.server 0 --bind 127.0.0.1 --directory prototype
```

Open `/demo.html` on the port printed by the server. Port 0 lets the operating
system choose an available temporary port. Serve only the synthetic directory.
Stop the server when finished. The sequence below starts with a fresh page and
keeps each preceding state unless a step explicitly resets it.

- Original suite: **27 passed**, zero failed, skipped or cancelled.
- Browser: **20 sequential checkpoints / 73 expected-versus-observed assertions
  passed**, using rendered DOM state after actual control interactions.
- Five full-page screenshots captured: B01, B02, B10, B17 and B20.
- Captured browser warning/error log was empty. The server recorded a harmless
  missing favicon (404); this is not a claim that every HTTP request succeeded.
- Demo syntax check passed. No core or demo repair was necessary.

The private evidence packet contains raw TAP, every expected/observed browser
value, screenshot bytes, source/evidence SHA-256 manifest and governance report.
Original executable tests and this ordered checklist make the claims replayable;
hashes establish artifact identity, not correctness by themselves. The browser
exercise is a sequential scenario, not twenty independent unit tests.

## Browser acceptance sequence

| ID | Action | Required / observed result |
| --- | --- | --- |
| B01 | Open fresh demo | Filter off; project/recent/pinned/search counts 3/4/2/5. |
| B02 | Enable | Counts 2/3/1/4; Work retained, hidden member omitted, search has 2 uncovered. |
| B03 | Search `工程` | Query unchanged; hidden member yields empty-state placeholder. |
| B04 | Move to show | Recent and pinned restore member; same query immediately shows it. |
| B05 | Simulate membership-save failure | Previous show membership restored in pinned and same search. |
| B06 | Simulate sidebar-save failure | Successfully saved hide membership remains hidden. |
| B07 | Move out of projects | Member visible; same search reports 1 uncovered. |
| B08 | Move to hide | Member omitted again from pinned and same search. |
| B09 | Clear query | Search shows 4, hides 1, has 2 uncovered. |
| B10 | Simulate late lookup; wait for completion message | New show membership wins; search retains unresolved-example row, now covered; uncovered count falls to 1. |
| B11 | Select Codex | Enabled checkbox stays on; original 3/4/2/5 lists restored. |
| B12 | Select ChatGPT | Rehydrated hide membership reapplied; search still has 1 uncovered. |
| B13 | Disable | Original recent, pinned and search rows restored. |
| B14 | Move to show while disabled | Original recent rows remain visible. |
| B15 | Enable again | Latest show membership used; all 5 search rows visible, 1 uncovered. |
| B16 | Move to hide | Pinned contains only Work before disposal. |
| B17 | Remove prototype | Original rows restored; filter controls disabled, checkbox off. |
| B18 | Reset | Controls enabled, filter off, ChatGPT selected, query empty. |
| B19 | Enable reset instance | Initial search counts 4 visible / 1 hidden / 2 uncovered. |
| B20 | Reload page | Fresh default-off state; original search and pinned rows restored. |

These controls manipulate synthetic snapshots. B05/B06 do not test real persistence
failures, and B11/B12 do not switch the desktop application itself. Reload checks
the completed demo page state, not a frame-by-frame native first-paint guarantee.

## Coverage boundary and next gate

| Area | Evidence at this input | Remaining native acceptance |
| --- | --- | --- |
| Project/recent/pinned/search | Core tests and four rendered synthetic lists | Bind and exercise actual desktop consumers. |
| Expanded/archive/composer and remote searches | Simulated core consumers only | Each real surface, identity mapping and lookup completeness. |
| Current membership / cached results | Synthetic moves, fixed-query recomputation and late-response rejection | Native event reconciliation, actual save/rollback and cache freshness. |
| Pagination | Core test retains cursor/total through an all-hidden page | Native load-more controls, subsequent pages and totals presentation. |
| Disable / mode / removal | Core reference restoration and synthetic browser controls | Reversible desktop adapter removal and original rendering restoration. |
| Unknown and wanted Work | Core fixtures plus rendered synthetic examples | Maintain native eligibility and fail-open behavior on real supported surfaces. |

No blocking defect was observed in this bounded acceptance. Proceed to a concrete,
default-off thin-adapter candidate and its rollback procedure. Desktop installation
or activation needs the later authorized runtime stage. Mixed projects and origin
classification remain outside v1; deferred Work instruction/context research stays
deferred. No real conversation movement, app settings/history writes, Ready, merge
or release occurred.
