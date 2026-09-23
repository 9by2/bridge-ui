# React Doctor Warning Cleanup

**Status:** active

## Problem

Full React Doctor 0.9.14 scan reports 138 warnings. Previous proposals fixed errors and a small number of confirmed warnings, but the requested full cleanup remains incomplete. See [ADHD.md](../../ADHD.md) for source ownership.

## Scope

Resolve warnings in owned code and private tooling without hiding diagnostics, breaking package contracts, or manually editing generated Shadcn files. Classify warnings that require regeneration or are generated artifacts.

## Success

- Reduce full-scan warnings to zero where technically possible without violating source ownership.
- Verify catalog, package, runtime and browser contracts after changes.
- Keep unrelated concurrent changes untouched.

## Progress

Full scan (React Doctor 0.9.14): 138 to 78 warnings, zero errors, no skipped checks. Context values, formatter allocation, inventory lookups, catalog lazy initialization, accessibility labels, and targeted verification tooling improved. The current-page breadcrumb no longer presents a dead link. Owned Button, WizardStepIndicator, and UploadViewer complexity was reduced without changing their public contracts. Remaining findings include 20 cross-file duplicate trees (mostly deliberate owned/pilot or vendored example mirrors), 14 generated Shadcn findings requiring CLI regeneration, 9 ordered browser verification loops, and 3 warnings in ignored build/report bundles. Other findings include index keys for position-addressed data, carousel callback effects required by its public API, and presentation complexity advisories. A restricted same-origin preview iframe failed the browser render test; the working iframe was restored. The upload preview extraction did not resolve its warning and was reverted. The proposal remains active; no scanner warnings have been suppressed or generated sources hand-edited.

## Current Scan (2026-09-23)

Node-based React Doctor 0.9.14 full scan: **63 warnings, 0 errors, score 70, 45 affected files**. Checkpoint commits `8268f40`, `81967a4`, and `3641822` fixed catalog/pilot findings, refreshed generated Shadcn through a guarded CLI registry override, and keyed catalog demos to reset on revision changes. All relevant package, runtime coverage, catalog build/browser/visual/memory, boundary, tree-shaking, lint, and typecheck gates passed; the scan remains open.

Residual inventory by rule:

- 20 `duplicate-jsx-subtree`: 11 owned/pilot mirrored presentation trees and nine catalog or vendored example trees. Deduplicating the package runtime against the private pilot would change the independent comparison fixture; vendored cases and variant examples intentionally repeat compositions. Needs a separate source-ownership decision before removing the mirrors.
- Nine `async-await-in-loop`: ordered navigation/assertions against a shared `Bun.WebView`; parallelizing would race navigation and invalidate the verification. Scanner does not distinguish required ordering from accidental serialization.
- Nine `no-array-index-as-key`: chart payloads, slider thumb positions, and upload previews. Chart/slider entries can share values or keys; using those as IDs would collide. File lists can contain duplicate names; changing their identity needs an accepted stable ID contract, not a string substitution.
- Nine carousel warnings across generated, owned and pilot implementations: three each of `no-pass-data-to-parent`, `no-pass-live-state-to-parent`, and `no-prop-callback-in-effect`. `setApi` is a published callback for exposing the Embla instance when it becomes available. Removing it requires a tested alternate public contract; generated source additionally requires CLI regeneration.
- Six `no-high-complexity-react-function`: sidebar (owned and pilot), upload preview (owned and pilot), catalog shell, and catalog upload example. Not blocked; branch extraction needs focused behavioral/browser verification. A sidebar mobile JSX extraction did not reduce the diagnostic and was reversed.
- Three `prefer-tag-over-role`: `ItemGroup` (owned and pilot) uses `div role=list` around composable `Item` and `Separator` children; replacing the container alone with `ul` would create invalid list markup. Calendar `DaySlot` uses a draggable drop target with keyboard/click handlers; a native button cannot safely host its current nested interactive events. These need semantic redesign, not tag substitution.
- Three `insecure-crypto-risk`: scan includes ignored compiled `catalog-dist` and Playwright trace bundles, not editable package source. Inspect build/report provenance and scanner scope before attributing this to application crypto.
- Two `no-adjust-state-on-prop-change`: image-crop owned/pilot effect handles bitmap load and canvas errors on file changes; scanner location points at error handling. Requires a tested asynchronous lifecycle redesign; deleting `setError` would conceal failure.
- One `iframe-missing-sandbox`: a restricted sandbox made the interactive chart preview fail its browser render contract; requires a separately tested origin/isolation design.
- One `no-giant-component`: vendored editable event chart example. Its editor and chart currently share refs, state, and handlers; extraction remains possible with a browser regression test.

The generated Shadcn portion is down to five warnings (three carousel callback findings and two chart payload keys). The remaining warnings are **not** a completed or waived scan; continue independent fixes without hiding diagnostics or touching unrelated worktree changes.
