# Decisions: Republish Catalog Runner Image for Bun.WebView

| ID      | Title                                                    | Status   |
| ------- | -------------------------------------------------------- | -------- |
| DEC-001 | Republish instead of Dockerfile change                   | accepted |
| DEC-002 | Keep Bun/Node version assertions unchanged               | accepted |
| DEC-003 | Rename image repository to `bridge-ui-ci-verify-runtime` | accepted |
| DEC-004 | Add `--no-sandbox` to every `Bun.WebView` chrome backend | accepted |

---

### DEC-001: Republish instead of Dockerfile change

**GIVEN** `deployment/Dockerfile.catalog` on `main` already installs the apt `chromium` package correctly (verified by a local `docker buildx build`)
**WHEN** the pinned `CATALOG_IMAGE` digest in `deployment/.gitlab-ci.yml` still points at the pre-migration Playwright-only image
**THEN** the fix is to rebuild and republish the existing Dockerfile under a fresh digest and repin, not to modify the Dockerfile itself.

---

### DEC-002: Keep Bun/Node version assertions unchanged

**GIVEN** `cmd/verify-ci-runtime.ts` asserts `Bun.version === "1.4.1"` and `node --version === "v22.22.0"`, matching what `deployment/Dockerfile.catalog` pins (`oven/bun:1.4.1` + `node:22.22.0-bookworm-slim`)
**WHEN** the local macOS dev machine reports Bun 1.4.2
**THEN** the version assertions stay at `1.4.1`/`v22.22.0` to match the republished image; the local version mismatch is expected and out of scope for this CI fix.

---

### DEC-003: Rename image repository to `bridge-ui-ci-verify-runtime`

**GIVEN** the user requested the rebuild be tagged `registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime`
**WHEN** the previous repository path was `registry.fountain.sellsuki.com/service/bridge-ui-catalog-runner`
**THEN** the image is built and pushed under the new `bridge-ui-ci-verify-runtime` repository name, and every reference to the old `bridge-ui-catalog-runner` repository path in the repo is updated to the new name alongside the new digest.

---

### DEC-004: Add `--no-sandbox` to every `Bun.WebView` chrome backend

**GIVEN** `deployment/Dockerfile.catalog` runs as root (no `USER` directive) and Chrome's zygote refuses `Running as root without --no-sandbox is not supported` — confirmed by direct `docker run` against the newly-pushed image: `backend: { type: "chrome", url: false }` alone fails with `Chrome process closed the pipe`, while adding `argv: ["--no-sandbox"]` succeeds; a non-root `-u 1000:1000` container also fails (`No usable sandbox! ... install chromium-sandbox package`) because Debian's `chromium` apt package ships without a setuid sandbox helper
**WHEN** every `new Bun.WebView({ backend: { type: "chrome", ... } })` call site in the repository (`cmd/verify-ci-runtime.ts`, `test/browser/support/page.ts`, and 13 other `cmd/verify-*.ts` scripts) omits `--no-sandbox`, so this is a second, independent CI blocker beyond the stale image digest — it would break `before_script` and `catalog:test` even against a freshly-built image
**THEN** add `argv: ["--no-sandbox"]` to the chrome backend options at every call site (not a Dockerfile/user change, since Debian's `chromium` package needs the setuid helper for non-root sandboxing and CI containers commonly run as root anyway).

---

### DEC-005: Add missing `next-themes` dependency

**GIVEN** the fixed image/`--no-sandbox` change let CI's `source` job progress past `before_script` for the first time and reach `bun typecheck`, which then failed with `Cannot find module 'next-themes'` in `app/component/shadcn/sonner.tsx` and `internal/pilot/sonner.tsx`
**WHEN** `next-themes` was never declared in `package.json`/`bun.lock` — it only resolved locally because of a stray, uncommitted `node_modules/next-themes` left over from a prior shadcn CLI generation, invisible to `bun install --frozen-lockfile` in CI
**THEN** add `next-themes@^0.4.6` to `dependencies` in `package.json` and run `bun install` to update `bun.lock`; this is a pre-existing bug unrelated to the webview/catalog-runner fix, only surfaced because CI never got this far before.

---

### DEC-006: Add missing `axe-core` dependency

**GIVEN** the `source`/`coverage` fixes let CI reach the `catalog` job for the first time since the webview migration, which then failed 383/522 tests with `Cannot find module 'axe-core/axe.min.js' from test/browser/support/axe.ts`
**WHEN** `axe-core` was never declared in `package.json`/`bun.lock` — it resolved locally only via a leftover transitive install from the removed `@axe-core/playwright` package (installed 4.13.0, present in `node_modules` but absent from the lockfile)
**THEN** add `axe-core@^4.13.0` to `devDependencies` (dev-only: used exclusively by `test/browser/support/axe.ts` and `cmd/verify-*.ts` scripts, never shipped in package output) and run `bun install`; re-ran the full local `bun catalog:test` suite afterward — 522/522 pass, confirming this was the last blocker and the single earlier `dropdown-menu` failure was a transient flake, not a regression.

---

### DEC-007: Add explicit 30-minute timeout to the `catalog` CI job

**GIVEN** the `axe-core` fix let the `catalog` job run all 522 tests in real GitLab CI for the first time, and CI's shared runner executes each test at roughly 1.8–2.5s (vs ~1s locally), so the full suite needs ~15–18 minutes there — the job hit GitLab's default 15-minute script timeout mid-run (`execution took longer than 15m0s`) on an otherwise-passing test (`ts-chart/25-calendar-heatmap`, itself hit by the timeout cutting off mid-assertion, not a real failure)
**WHEN** `deployment/.gitlab-ci.yml`'s `catalog` job had no explicit `timeout:` override, so it inherited the GitLab default
**THEN** add `timeout: 30m` to the `catalog` job (2x headroom over the observed ~15–18 minute real runtime) and lock it in with a regression test in `test/internal/catalog-runner.test.ts`.
