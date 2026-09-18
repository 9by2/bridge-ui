# Decisions: Convert Playwright Catalog Suite to Bun.WebView

| ID      | Title                                                              | Status   |
| ------- | ------------------------------------------------------------------ | -------- |
| DEC-001 | Full replacement, not dual-stack                                   | accepted |
| DEC-002 | Chrome backend only for CI/harness                                 | accepted |
| DEC-003 | Hand-rolled harness, no third-party WebView test framework         | accepted |
| DEC-004 | Screenshot diffing via pixelmatch + pngjs                          | accepted |
| DEC-005 | Custom orchestrator replaces Playwright `webServer`                | accepted |
| DEC-006 | `bun test --parallel` / `--retry` replace Playwright worker config | accepted |
| DEC-007 | Spec files renamed `.spec.ts` → `.test.ts`                         | accepted |

---

### DEC-001: Full replacement, not dual-stack

**GIVEN** the initial proposal offered a "dual-stack" option keeping Playwright as a fallback gate
**WHEN** the user selected "full-replace"
**THEN** Playwright, `@playwright/test`, `playwright`, `@axe-core/playwright` are removed entirely from `package.json`, CI, Docker, and documentation; Bun.WebView becomes the sole required browser-verification gate with no Playwright fallback path.

---

### DEC-002: Chrome backend only for CI/harness

**GIVEN** `Bun.WebView` supports both `webkit` (macOS-only, zero deps) and `chrome` (CDP-based, cross-platform) backends, and CI runs Linux
**WHEN** choosing the backend for the shared harness
**THEN** the harness defaults to `backend: { type: "chrome", url: false }` everywhere (matches existing `cmd/verify-pilot-*.ts` scripts and works identically on macOS dev machines and Linux CI), preserving Playwright's Chromium-only current behavior.

---

### DEC-003: Hand-rolled harness, no third-party WebView test framework

**GIVEN** no mature "Playwright-for-Bun.WebView" library exists in the dependency graph
**WHEN** deciding how to replicate `page`/`expect`/`AxeBuilder`
**THEN** build a minimal in-repo harness (`test/browser/support/`) directly on `Bun.WebView` + `bun:test`, following the exact patterns already proven in `cmd/verify-pilot-browser.ts`, `cmd/verify-pilot-axe.ts`, and `cmd/verify-catalog-readiness.ts`. No new runtime dependency beyond `pixelmatch` (pure JS, screenshot diff only).

---

### DEC-004: Screenshot diffing via pixelmatch + pngjs

**GIVEN** `visual.spec.ts` is the only spec using true pixel screenshot comparison (`toHaveScreenshot`), and `pngjs` is already a transitive dependency
**WHEN** replacing `toHaveScreenshot`
**THEN** add `pixelmatch` as a direct devDependency, decode PNGs with `pngjs`, and implement `expectScreenshot()` comparing against baselines carried over from `test/browser/visual.spec.ts-snapshots/` (renamed into the new support baseline directory), writing diff/actual images to `.eval/` on mismatch, with `BUN_UPDATE_SNAPSHOTS=1` to rebase.

---

### DEC-005: Custom orchestrator replaces Playwright `webServer`

**GIVEN** `bun test` has no built-in dev-server lifecycle equivalent to Playwright's `webServer` config
**WHEN** wiring `catalog:test`
**THEN** add `cmd/run-catalog-test.ts`: builds the catalog, starts `vite preview` on port 6007, polls readiness, execs `bun test test/browser`, and always tears the preview server down in `finally`. `package.json`'s `catalog:test` script becomes `bun cmd/run-catalog-test.ts`.

---

### DEC-006: `bun test --parallel` / `--retry` replace Playwright worker config

**GIVEN** Playwright used `workers: process.env.CI ? 1 : 4` and no retries
**WHEN** replacing this in `bun test`
**THEN** `cmd/run-catalog-test.ts` passes `bun test test/browser` with no `--parallel` flag in CI (sequential, matching `workers: 1`) and may pass `--parallel=4` locally when `CI` is unset, matching prior local parallelism; no `--retry` is set (matches Playwright's default `retries: 0` implied by the current config, which sets no `retries` key).

---

### DEC-007: Spec files renamed `.spec.ts` → `.test.ts`

**GIVEN** `bunfig.toml`'s default test root/convention and the rest of the repo (`test/component/**/*.test.tsx`, `test/**/*.test.ts`) uses the `.test.ts(x)` suffix, and Playwright's own convention was `.spec.ts`
**WHEN** converting the 26 files
**THEN** each converted file is renamed to `test/browser/<name>.test.ts` (dropping `.spec`), keeping the same base name, so `bun test` naming stays consistent repository-wide and the git history for each file is preserved via `git mv`.
