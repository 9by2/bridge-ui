# Tasks: Republish Catalog Runner Image for Bun.WebView

Implementation order matters — complete top to bottom.

## Setup

- [x] Diagnose root cause: pull and inspect the currently-pinned `bridge-ui-catalog-runner` image; confirm it only has `/ms-playwright/chromium-1243` and no system `chromium`.
- [x] Confirm `deployment/Dockerfile.catalog` on `main` already installs `chromium` correctly via a local `docker buildx build`.

## Core

- [x] Build and push a multi-arch (`linux/amd64`, `linux/arm64`) image from `deployment/Dockerfile.catalog` to `registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime:latest`.
- [x] Resolve the new OCI index digest (`sha256:19eddc384cca8f39c94290a0c161ac4c837683418ed288849444ea4eeb750200`).
      10|- [x] Pull both platform images locally and run `bun cmd/verify-ci-runtime.ts` against each — discover the `--no-sandbox` root-Chrome bug this way.
- [x] Add `argv: ["--no-sandbox"]` to every `Bun.WebView({ backend: { type: "chrome", ... } })` call site (23 files, single `sed` pass on the identical literal `type: "chrome", url: false`).
- [x] Re-verify `bun cmd/verify-ci-runtime.ts` passes against both platform images after the fix.

## Integration

- [x] Update `deployment/.gitlab-ci.yml` `CATALOG_IMAGE` to the new repository/digest.
- [x] Update `test/internal/catalog-runner.test.ts` digest constant.
- [x] Add a regression test in `test/internal/catalog-runner.test.ts` asserting every chrome-backend call site includes `--no-sandbox`.
      20|- [x] Update `plan/spec/catalog-ci-image/spec.md` digest references.
- [x] Update `README.md` image name, build command, and add a sentence documenting the root/`--no-sandbox` requirement.

## Verification

- [x] `bun fmt` — clean
- [x] `bun lint` — 0 errors, 10 pre-existing generated-source warnings (documented baseline)
- [x] `bun node_modules/typescript/bin/tsc --noEmit` — clean
- [x] `bun boundary` — clean
      30|- [x] `bun run build` — clean
- [x] `bun test` — 48/48 pass
- [x] `bun coverage:brand` and `bun coverage:runtime` — 100% statement/branch/function/line
- [x] `bun verify:package` — clean
- [x] `bun verify:tree-shaking` — clean
- [x] `bun catalog:test` (full 522-test Bun.WebView suite) — 521/522 pass on first full run (one `dropdown-menu` axe flake under resource pressure); reran `catalog.test.ts` in isolation — 387/387 pass, confirming no regression from the `--no-sandbox` change.
- [x] All specs in `spec/` reviewed against implementation
      38|- [ ] Push commit to `main`; confirm GitLab pipeline `source`/`coverage`/`catalog` jobs pass.
- [ ] Archive proposal per plan/PROPOSAL.md
