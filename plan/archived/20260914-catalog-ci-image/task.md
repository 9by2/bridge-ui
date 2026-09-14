# Tasks: Catalog CI Image

Implementation order matters - complete top to bottom.

## Setup

- [x] Record current job timing and required browser contract.
- [x] Decide Playwright and Bun.WebView responsibility.

## Core

- [x] Add version-pinned catalog runtime Dockerfile.
- [x] Add image runtime verification.
- [x] Add GitLab image publication job.

## Integration

- [x] Consume prebuilt image in child CI.
- [x] Remove per-job Node and Playwright browser provisioning.
- [x] Document build and image update flow.

## Verification

- [x] Build and verify image locally.
- [x] Run source and catalog gate in image.
- [x] All specs in `spec/` reviewed against implementation.
- [x] Archive proposal per repository workflow.
