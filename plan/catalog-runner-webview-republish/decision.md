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
