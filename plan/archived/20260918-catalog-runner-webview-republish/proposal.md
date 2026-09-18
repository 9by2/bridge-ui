# Republish Catalog Runner Image for Bun.WebView

**Proposal:** `catalog-runner-webview-republish`
**Status:** in-progress
**Phase:** ADHD §5 Quality (catalog/browser verification gate)

## Problem

`deployment/.gitlab-ci.yml`'s `CATALOG_IMAGE` digest pin still resolves to the pre-`webview-migration` catalog runner image (built by `perf(ci): prebuild catalog runtime` / `fix(ci): pin catalog runner image`), which only contains Playwright's own headless Chromium under `/ms-playwright/chromium-1243` and no system `chromium` binary. `chore(webview-migration): replace Playwright catalog suite with Bun.WebView` rewrote `deployment/Dockerfile.catalog` to install the Debian `chromium` apt package (for `Bun.WebView`'s `backend: { type: "chrome" }` auto-detection) and rewrote `cmd/verify-ci-runtime.ts` to actually spawn a `Bun.WebView` Chrome backend, but the image was never rebuilt/republished, so the digest pin is stale. CI now fails `bun cmd/verify-ci-runtime.ts` in every `before_script` with `Failed to spawn Chrome ... ERR_DLOPEN_FAILED` (GitLab pipeline #59369/#59370, job 249475 and siblings), blocking every `source`, `coverage`, and `catalog` job.

A second, independent bug surfaced during republish verification: `deployment/Dockerfile.catalog` has no `USER` directive, so the container runs as root, and Chrome's zygote refuses `Running as root without --no-sandbox is not supported` (confirmed by direct `docker run` against the freshly-built image — `backend: { type: "chrome", url: false }` alone still fails with `Chrome process closed the pipe`). Every `new Bun.WebView({ backend: { type: "chrome", ... } })` call site in the repository was missing `--no-sandbox`, so this would have broken CI even against a correctly-rebuilt image.

## Scope

### In scope

- Rebuild `deployment/Dockerfile.catalog` as a multi-arch (`linux/amd64`, `linux/arm64`) image and push to `registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime` (renamed from `bridge-ui-catalog-runner`).
  10|- Update the `CATALOG_IMAGE` repository path and digest pin in `deployment/.gitlab-ci.yml` to the new image.
- Update every repository reference to the old repository/digest (`test/internal/catalog-runner.test.ts`, `plan/spec/catalog-ci-image/spec.md`, `README.md`) to the new image.
- Add `argv: ["--no-sandbox"]` to every `Bun.WebView({ backend: { type: "chrome", ... } })` call site (23 files: `cmd/verify-*.ts` and `test/browser/support/page.ts`).
- Add a regression test (`test/internal/catalog-runner.test.ts`) asserting every chrome-backend call site includes `--no-sandbox`.
- Verify `bun cmd/verify-ci-runtime.ts` passes inside the new image on both platforms before pinning.
- Push and confirm the GitLab pipeline (`source`, `coverage`, `catalog` jobs) goes green.

### Out of scope

- Changing `deployment/Dockerfile.catalog` content itself (already correct from the webview-migration proposal).
- Any further Bun.WebView harness changes.
- Bumping the `Bun.version`/`node --version` assertions in `cmd/verify-ci-runtime.ts` (kept at `1.4.1`/`v22.22.0` to match the republished image; local Bun 1.4.2 mismatch is expected and not the CI failure).

## Success Criteria

- [x] New multi-arch `bridge-ui-ci-verify-runtime` image published under a fresh digest, containing a working `chromium` binary discoverable by `Bun.WebView`.
      20|- [x] `deployment/.gitlab-ci.yml` `CATALOG_IMAGE` pinned to `bridge-ui-ci-verify-runtime@sha256:19eddc384cca8f39c94290a0c161ac4c837683418ed288849444ea4eeb750200`.
- [x] `test/internal/catalog-runner.test.ts`, `plan/spec/catalog-ci-image/spec.md`, `README.md` updated to the new image name and digest; `bun test test/internal/catalog-runner.test.ts` passes.
- [x] Every `Bun.WebView` chrome backend call site passes `argv: ["--no-sandbox"]`; locked in by a new regression test.
- [x] `bun cmd/verify-ci-runtime.ts` passes locally against the new image on `linux/amd64` and `linux/arm64`.
- [x] GitLab pipeline triggered from `main` (pipeline #59439) shows `source`, `coverage`, and `catalog` jobs all passing.

## Specs

| Spec             | Path                                 | Summary                                                   |
| ---------------- | ------------------------------------ | --------------------------------------------------------- |
| catalog-ci-image | `plan/spec/catalog-ci-image/spec.md` | Amended: digest pin updated to the webview-capable image. |

## References

- `plan/archived/20260918-webview-migration/` (introduced the Dockerfile/verify-ci-runtime changes never republished)
- `plan/archived/20260914-catalog-ci-image-pin/` (original digest-pin mechanism)
- GitLab pipeline #59369 / #59370, job 249475 (failure evidence)
