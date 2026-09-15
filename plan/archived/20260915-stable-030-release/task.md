# Tasks: Stable 0.3.0 Release

Implementation order matters - complete top to bottom.

## Setup

- [x] Fetch and confirm `v0.3.0-rc.0` at `ddf92a8`.
- [x] Fast-forward local `main` to the released RC source.

## Core

- [x] Exit Changesets RC mode through Bun.

## Integration

- [x] Verify stable release metadata and diff.
- [x] Commit and push the stable-promotion state.

## Verification

- [x] Run formatter, lint, typecheck, test, coverage, catalog check, and package build gate.
- [x] All specs in `spec/` reviewed against implementation.
- [x] Archive proposal per repository workflow.

Verification: formatter, typecheck, boundary, 45 Bun test, runtime and brand coverage at 100%, package build, tree-shaking, packed package/client/SSR, and 467 Playwright case pass. Lint reports the known 10 generated Shadcn warning and zero error.
