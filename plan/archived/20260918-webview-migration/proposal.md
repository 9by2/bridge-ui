# Convert Playwright Catalog Suite to Bun.WebView

**Proposal:** `webview-migration`
**Status:** in-progress
**Phase:** ADHD §5 Quality (catalog/browser verification gate)

## Problem

`ADHD.md` §5 and `README.md` currently require Playwright as a separate, mandatory CI gate alongside Bun.WebView for catalog/browser verification. The user has decided (full-replace) to drop Playwright entirely: one browser-automation dependency, one test runner (`bun test`), zero Node-based Playwright toolchain, zero `playwright-report/` artifact, zero Playwright browser download in `deployment/Dockerfile.catalog`.

All 26 `test/browser/*.spec.ts` files, `playwright.config.ts`, `@playwright/test`/`playwright`/`@axe-core/playwright` dependencies, the `catalog:test` script, the CI `catalog` stage, and the Playwright section of `Dockerfile.catalog` must be replaced by an equivalent Bun.WebView-based suite that runs under `bun test`.

## Scope

### In scope

- A reusable Bun.WebView test harness (`test/browser/support/`) providing: navigation to catalog/style-x preview routes, CSS-selector locators with actionable-wait semantics, role-based queries (button/tab/menu/dialog/etc. via `aria`/`data-slot` matching), keyboard/mouse helpers, `expect.poll`-style polling, axe-core injection + WCAG run, CDP passthrough (device metrics, emulated media, heap profiling), file-upload simulation (in-page canvas → File → drag/drop or native input assignment), and PNG screenshot diff (pixelmatch/pngjs, already vendored) replacing `toHaveScreenshot`.
- Conversion of all 26 `test/browser/*.spec.ts` files to `bun:test` + the new harness, preserving test intent, matrix coverage (theme × width × component loops), and assertions.
- Removal of `playwright.config.ts`, `@playwright/test`, `playwright`, `@axe-core/playwright` from `package.json`/lockfile.
- Update `catalog:test` script to run the new Bun.WebView suite via `bun test`.
- Update `deployment/.gitlab-ci.yml` `catalog` stage and `deployment/Dockerfile.catalog` to drop Playwright browser installation and `playwright-report/` artifact; keep Chrome available for `Bun.WebView` `backend: { type: "chrome" }`.
- Update `cmd/verify-ci-runtime.ts` (drops Playwright version/browser assertions, no longer needs `PLAYWRIGHT_BROWSERS_PATH`).
- Update `ADHD.md` §5 and `README.md` wording to describe Bun.WebView as the sole required browser-verification gate.
- Preserve existing `visual.spec.ts` PNG baselines under `test/browser/visual.spec.ts-snapshots/` (renamed to match new harness convention) as the pixel baseline for the ported screenshot test.

### Out of scope

- Changing catalog application source, Vite config, or component behavior.
- Adding a new component catalog viewer.
- Cross-browser (WebKit + Chrome) matrix; Chrome-only via `backend: { type: "chrome" }` for Linux CI parity (mirrors current headless Playwright Chromium usage). WebKit backend stays available for local macOS but is not the CI-required path.
- Visual diff tolerance tuning beyond a pragmatic default threshold.

## Success Criteria

- [ ] `playwright.config.ts` deleted; no `@playwright/test`, `playwright`, `@axe-core/playwright` in `package.json`.
- [ ] All 26 spec files converted to `bun:test` + harness, live under `test/browser/*.test.ts`, and pass via `bun run catalog:test` (0 Playwright imports repository-wide, verified by `bun cmd/check-source-boundary.ts` or a grep gate).
- [ ] `deployment/.gitlab-ci.yml` `catalog` stage and `deployment/Dockerfile.catalog` no longer reference Playwright.
- [ ] `cmd/verify-ci-runtime.ts` passes without Playwright assertions.
- [ ] `ADHD.md` §5 and `README.md` describe Bun.WebView as the sole required catalog/browser gate; no residual "Playwright" mentions except historical/archived plan text.
- [ ] `bun fmt`, `bun lint`, `bun typecheck`, `bun test`, `bun coverage:runtime`, package build, and the new `bun run catalog:test` all pass locally.

## Specs

| Spec            | Path                           | Summary                                                                                                             |
| --------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| webview-harness | `spec/webview-harness/spec.md` | Contract for the reusable Bun.WebView test-support module replacing Playwright's `page`/`expect`/`AxeBuilder` APIs. |

## References

- `ADHD.md` §5 (Quality gate wording)
- `README.md` (catalog/browser verification section)
- `cmd/verify-pilot-browser.ts`, `cmd/verify-pilot-axe.ts`, `cmd/verify-catalog-readiness.ts`, `cmd/verify-pilot-catalog.ts` (existing Bun.WebView usage patterns)
- `node_modules/bun-types/bun.d.ts` (`Bun.WebView` API surface)
