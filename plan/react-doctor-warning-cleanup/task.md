# Task

- [x] Inventory current full-scan diagnostics by source ownership.
- [x] Refresh guarded Shadcn diagnostics through the CLI and verify package/catalog gates (five generated warnings remain).
- [x] Replace catalog revision-reset effects with keyed remounts and verify build/browser behavior.
- [x] Record the 63 residual warnings by rule, contract, and next verification requirement.
- [x] Fix owned/pilot chart array-index keys and 6 `no-high-complexity-react-function` findings (sidebar, upload-preview, catalog shell, catalog upload example) via extraction; verified with full gate sequence (`ed71720`).
- [x] Refresh generated Shadcn `chart.tsx` array-index keys through the guarded CLI registry override, matching the owned/pilot fix (`ace365d`).
- [x] Fix `no-giant-component` for vendored TanStack editable-event example via pure JSX extraction (`EventEditorToolbar`/`EventEditorIdentityList`); verified with full gate sequence plus a targeted manual `Bun.WebView` interaction check (`164306f`).
- [x] Attempt `iframe-missing-sandbox` fix; confirmed genuinely blocked (curated sandbox either re-triggers a stricter self-defeating-sandbox warning or breaks the ts-chart preview's cross-origin dynamic import, failing `render-pipeline.test.ts`); reverted cleanly.
- [x] Re-verify every remaining diagnostic individually via `react-doctor why <file>:<line>` (not bucket assumption): 20 `duplicate-jsx-subtree` (11 owned/pilot mirrors + 9 catalog/vendored copyable-example repeats), 9 `async-await-in-loop`, 9 carousel `setApi` findings, 3 `prefer-tag-over-role` (`ItemGroup` two-file not three-file; generated Shadcn `item.tsx` never had `role="list"`), 2 `no-array-index-as-key` (slider), 1 `no-adjust-state-on-prop-change` remaining after image-crop re-confirm, 1 `iframe-missing-sandbox`. All confirmed blocked with concrete rationale.
- [x] Verify full scan (46 warnings, 0 errors, score 80, 34 affected files) and record final state per DEC-001.
- [ ] Archive plan once no further fix attempts are planned (left open in case of future follow-up; current session's remaining-warning inventory is fully documented and stable).
