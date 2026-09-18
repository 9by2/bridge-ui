# Tasks: Convert Playwright Catalog Suite to Bun.WebView

Implementation order matters — complete top to bottom.

## Setup

- [x] Add `pixelmatch` as a direct devDependency; confirm `pngjs` resolves (already transitive) — `bun add -D pixelmatch`.
- [x] Write failing characterization tests for the harness itself under `test/browser/support/*.test.ts` (locator visibility/text/css, byRole matching, pollUntil timeout, axe inject+run, screenshot diff pass/fail, upload file assignment) before implementing each support module (TDD).
- [x] Implement `test/browser/support/env.ts` (`CATALOG_BASE_URL`).
- [x] Implement `test/browser/support/webview.ts` (`openCatalog`).
- [x] Implement `test/browser/support/locator.ts` (CSS locator: click/text/count/boundingBox/css/attr/isVisible/focus/evaluate). Superseded by the more complete chainable `query.ts` `Locator`.
- [x] Implement `test/browser/support/role.ts` (`byRole` accessible-name query). Superseded by `runtime.ts`'s in-page query engine plus `query.ts`'s `getByRole()`.
- [x] Implement `test/browser/support/poll.ts` (`pollUntil`, plus added `pollValue`).
- [x] Implement `test/browser/support/matcher.ts` (`expect.extend` for `toBeVisible`, `toHaveText`, `toContainText`, `toHaveCSS`, `toHaveAttribute`, `toHaveCount`, `toBeFocused`, `toBeEnabled`/`toBeDisabled`, `toBeChecked`, `toHaveValue`, `toHaveClass`, `toHaveURL`, `toHaveJSProperty`, `toBeAttached`/`toBeHidden`).
- [x] Implement `test/browser/support/axe.ts` (`runAxe`, vendored `axe-core/axe.min.js` injection, same WCAG tag matrix as today).
- [x] Implement `test/browser/support/screenshot.ts` (`expectScreenshot` via pixelmatch/pngjs, baseline dir, clip support).
- [x] Implement `test/browser/support/upload.ts` (`uploadFile`, in-page canvas PNG generation helper).
- [x] Implement `test/browser/support/cdp.ts` (`withHeapSession` heap/DOM-count helpers for `memory.test.ts`).
- [x] Implement `test/browser/support/index.ts` barrel export.
- [x] Implement `cmd/run-catalog-test.ts` orchestrator (build catalog, start preview, poll port, run `bun test test/browser`, teardown in `finally`).
- [x] Run harness unit tests green before touching any spec file (`test/browser/support/harness.test.ts`, 7/7 passing).

## Core — Spec Conversion (alphabetical, simplest first)

- [x] `tab-example.spec.ts` → `tab-example.test.ts`
- [x] `tab-capsule.spec.ts` → `tab-capsule.test.ts`
- [x] `tab-line.spec.ts` → `tab-line.test.ts`
- [x] `stylex-multi-select.spec.ts` → `stylex-multi-select.test.ts`
- [x] `stylex-scroll.spec.ts` → `stylex-scroll.test.ts`
- [x] `stylex-engine.spec.ts` → `stylex-engine.test.ts`
- [x] `stylex-isolation.spec.ts` → `stylex-isolation.test.ts`
- [x] `menu-focus.spec.ts` → `menu-focus.test.ts`
- [x] `stylex-menu.spec.ts` → `stylex-menu.test.ts`
- [x] `reusable-presentation.spec.ts` → `reusable-presentation.test.ts` (`toHaveJSProperty`)
- [x] `cue-theme.spec.ts` → `cue-theme.test.ts`
- [x] `public-stylex.spec.ts` → `public-stylex.test.ts`
- [x] `stylex-control.spec.ts` → `stylex-control.test.ts`
- [x] `stylex-route.spec.ts` → `stylex-route.test.ts` (iframe via `.contentFrame()`)
- [x] `stylex-parity.spec.ts` → `stylex-parity.test.ts`
- [x] `stylex-compound.spec.ts` → `stylex-compound.test.ts`
- [x] `dev-600-presentation-states.spec.ts` → `dev-600-presentation-states.test.ts` (`emulateMedia` via `view.cdp("Emulation.setEmulatedMedia")`)
- [x] `shell-header.spec.ts` → `shell-header.test.ts` (`pollValue` heavy)
- [x] `stylex-layout.spec.ts` → `stylex-layout.test.ts`
- [x] `upload-composition.spec.ts` → `upload-composition.test.ts`
- [x] `upload.spec.ts` → `upload.test.ts`
- [x] `brand.spec.ts` → `brand.test.ts` (iframe count assertions)
- [x] `theme-parity.spec.ts` → `theme-parity.test.ts` (axe)
- [x] `visual.spec.ts` → `visual.test.ts` (screenshot diff; migrated `test/browser/visual.spec.ts-snapshots/*.png` → `test/browser/support/__screenshot__/`)
- [x] `memory.spec.ts` → `memory.test.ts` (CDP heap profiling)
- [x] `catalog.spec.ts` → `catalog.test.ts` (dynamic per-example generation via `readdirSync`, axe sweep, clipboard permission — 387/387 passing)

## Harness Notes Resolved During Conversion

- [x] iframe content access (`stylex-route.spec.ts`, `catalog.spec.ts`, `brand.spec.ts`): implemented `.contentFrame()` on `Locator` reaching into same-origin `iframe.contentDocument` via injected runtime queries.
- [x] Clipboard permission grant (`catalog.spec.ts`): implemented `page.grantClipboardPermission()` via CDP `Browser.grantPermissions`.
- [x] `page.on("pageerror")` (`catalog.spec.ts`, `stylex-control.spec.ts`): replaced with a `console` constructor callback capturing `type === "error"`.

## Integration

- [x] Delete `playwright.config.ts` (and `playwright.pilot.config.ts`).
- [x] Remove `@playwright/test`, `playwright`, `@axe-core/playwright` from `package.json` devDependencies; ran `bun install`.
- [x] Update `package.json` `catalog:test` script to `bun cmd/run-catalog-test.ts`.
- [x] Update `cmd/verify-ci-runtime.ts`: dropped `PLAYWRIGHT_BROWSERS_PATH`, chromium install-complete, and `@playwright/test` version assertions; added a Chrome-availability assertion (`Bun.WebView` constructs with `backend: { type: "chrome" }` and navigates `about:blank`).
- [x] Update `deployment/Dockerfile.catalog`: dropped `PLAYWRIGHT_BROWSERS_PATH` env and `bunx playwright@1.63.0 install --with-deps chromium`; installs plain `chromium` apt package instead (auto-detected by `Bun.WebView`'s `$PATH`/`/usr/bin/chromium` lookup — no `BUN_CHROME_PATH` override needed).
- [x] Update `deployment/.gitlab-ci.yml` `catalog` stage: dropped `test-results/` and `playwright-report/` from artifact paths.
- [x] No `test/browser-webview-poc/` scratch directory existed to delete (this session started from the already-drafted plan; harness was built directly under `test/browser/support/`).
- [x] `test/internal/catalog-runner.test.ts` rewritten to assert zero remaining Playwright import/require anywhere in `app/`, `shared/`, `internal/`, `cmd/`, `test/` and zero `playwright` string in `package.json`; passes.

## Documentation

- [x] Update `ADHD.md` §5 Quality: replaced the Playwright mention with Bun.WebView.
- [x] Update `README.md`: replaced the "Vite component catalog with Playwright verification" bullet, the `playwright.config.ts` reference, the Dockerfile Playwright description, the "Bun.WebView remains useful... does not replace the required Playwright gate" paragraph, and the coverage/policy paragraph mentioning Playwright, all now describing Bun.WebView as the sole required gate.
- [x] Also updated `plan/gitlab-release/spec/gitlab-release/spec.md` (same Playwright → Bun.WebView wording change, active spec referencing the same CI contract).

## Verification

- [x] `bun fmt` (formatter) — clean
- [x] `bun lint` — 0 errors, 10 pre-existing generated-source warnings (documented baseline); fixed 52 `method-signature-style` errors introduced by the new harness (`query.ts`, `matcher.ts`, `cdp.ts` interfaces converted to property-signature function types)
- [x] `bun typecheck` — clean
- [x] `bun boundary` — clean
- [x] `bun test` (unit + harness tests) — 47/47 pass
- [x] `bun coverage:runtime` — 100% statement/branch/function/line across all measured `app/`/`shared/` modules
- [x] `bun run catalog:test` (full suite through the real `cmd/run-catalog-test.ts` orchestrator: build catalog, start Vite preview, poll readiness, run `bun test --timeout 30000 ./test/browser`, teardown) — 522 pass / 0 fail across 27 files, exit code 0 (re-confirmed after the lint-driven type fix)
- [x] `bun run build` / `bun verify:package` / `bun verify:tree-shaking` — all pass; tree-shaking retains 26 modules, no chart/upload runtime
- [x] `.eval/0918-webview-migration/memory-sample.json` captured as evaluation evidence from `memory.test.ts`.
- [x] All specs in `spec/` reviewed against implementation
- [x] Archive and sync via `archive-plan`
