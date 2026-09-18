# Design: Republish Catalog Runner Image for Bun.WebView

## Overview

Rebuild the already-correct `deployment/Dockerfile.catalog` as a multi-arch image, push it to the pinned registry path, and repoint every digest reference in the repository at the new immutable digest. No Dockerfile or harness code changes — this is a republish-and-repin operation to close the gap left by the webview-migration proposal.

## Architecture

```mermaid
flowchart LR
  A[deployment/Dockerfile.catalog<br/>chromium apt package] --> B[docker buildx build --platform amd64,arm64 --push]
  B --> C[registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime@sha256:NEW]
  C --> D[deployment/.gitlab-ci.yml CATALOG_IMAGE]
  D --> E[GitLab source/coverage/catalog jobs]
```

## Components

| Component | Responsibility | Location |
10|| ----------------- | -------------------------------------------- | ------------------------------------------------ |
| Runtime image | Bun 1.4.1, Node 22.22.0, apt `chromium` | `deployment/Dockerfile.catalog` (unchanged) |
| Digest pin | Consume new image by immutable digest | `deployment/.gitlab-ci.yml` |
| Digest assertions | Verify no repo reference to old digest | `test/internal/catalog-runner.test.ts` |
| Spec contract | Document the current pinned digest | `plan/spec/catalog-ci-image/spec.md` |
| Docs | Describe rebuild/push command with new digest | `README.md` |

## Data Flow

1. `docker buildx build --platform linux/amd64,linux/arm64 -f deployment/Dockerfile.catalog -t registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime:latest --push .`
2. Resolve the pushed OCI index digest via `docker buildx imagetools inspect ... --format '{{json .Manifest}}'` or the `push` output.
   20|3. Replace every occurrence of the old `bridge-ui-catalog-runner@sha256:887a2a4f...` reference with the new `bridge-ui-ci-verify-runtime@sha256:NEW` across `deployment/.gitlab-ci.yml`, `test/internal/catalog-runner.test.ts`, `plan/spec/catalog-ci-image/spec.md`, `README.md`.
3. Locally verify `bun cmd/verify-ci-runtime.ts` against the new image on both `--platform` values via `docker run --platform ...`.
4. Push commit; confirm GitLab pipeline goes green.

## Example Code

```bash
# from repo root
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f deployment/Dockerfile.catalog \
  -t registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime:latest \
  --push .

   30|docker buildx imagetools inspect registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime:latest \
  --format '{{json .Manifest}}' | jq -r '.digest'
```

## Risks & Mitigations

| Risk                                     | Mitigation                                                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| New digest missed in one reference file  | `rg` for the old digest repository-wide before commit; must return empty.                                  |
| amd64 build untested (arm64-only runner) | Run `bun cmd/verify-ci-runtime.ts` under `docker run --platform linux/amd64` via emulation before pinning. |
| Registry push requires auth              | Already authenticated as `robot$bvmsk.sittipong` against the fountain registry.                            |
