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
      38|- [x] Push commit to `main` (9c9b2ccd -> next commit); pipeline #59395/#59396 got past `before_script` for the first time, surfacing a separate pre-existing `next-themes` module-resolution bug at `bun typecheck`.
- [x] Add `next-themes@^0.4.6` to `package.json` dependencies (was resolving only via a stray uncommitted `node_modules/next-themes`, absent from `bun.lock`); `bun install`; re-verify `bun fmt`/`lint`/`typecheck`/`boundary`/`build`/`test`/`coverage:brand`/`verify:package`/`verify:tree-shaking` all clean.
- [x] Push follow-up commit; pipeline #59400/#59401 `source` and `coverage` jobs went green (confirms image republish + `--no-sandbox` + `next-themes` fixes all correct), but `catalog` job failed 383/522 with `Cannot find module 'axe-core/axe.min.js'`.
- [x] Add `axe-core@^4.13.0` to `package.json` devDependencies (leftover transitive install from removed `@axe-core/playwright`, absent from `bun.lock`); `bun install`; re-verify all local gates; rerun full local `bun catalog:test` — 522/522 pass.
- [x] Push follow-up commit; pipeline #59413/#59414 `source` and `coverage` jobs green again, but `catalog` job hit GitLab's default 15-minute script timeout mid-run (real CI runs each test ~1.8-2.5x slower than local; full 522-test suite needs ~15-18min there).
- [x] Add `timeout: 30m` to the `catalog` job in `deployment/.gitlab-ci.yml`; add a regression test asserting the timeout is present; re-verify all local gates.
- [x] Push follow-up commit; pipeline #59431/#59432 `source`/`coverage` green, full 522-test catalog suite ran in 311.52s (well under 30m) but 1 test failed: `dropdown-menu/item-variant renders accessibly` (real intermittent WCAG AA color-contrast flake, reproduced locally ~1-in-8).
- [x] Root-caused: `dropdown-menu.tsx`'s popup has a 100ms opacity entrance animation; `runAxe()` ran immediately after click, occasionally sampling mid-fade so the destructive item's red text computes under-threshold contrast. Added `Promise.allSettled(document.getAnimations()...)` wait before axe, mirroring `cmd/verify-secondary-contrast.ts`. Verified 15/15 consecutive local runs pass.
- [ ] Push follow-up commit; confirm GitLab pipeline `source`/`coverage`/`catalog` jobs all pass.
- [ ] Archive proposal per plan/PROPOSAL.md
