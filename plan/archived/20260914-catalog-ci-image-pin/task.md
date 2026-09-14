# Tasks: Catalog CI Image Pin

Implementation order matters - complete top to bottom.

## Setup

- [x] Confirm published OCI index contains amd64 and arm64.

## Core

- [x] Add regression contract for digest pin and absent builder job.
- [x] Pin child CI to published service image digest.
- [x] Make runtime architecture verification portable.

## Integration

- [x] Validate GitLab CI configuration.
- [x] Verify both image architectures locally.

## Verification

- [x] Run affected test, formatter, lint and typecheck.
- [x] All specs in `spec/` reviewed against implementation.
- [x] Archive proposal per repository workflow.
