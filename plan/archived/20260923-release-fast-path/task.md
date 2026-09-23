# Tasks: Release Merge Fast Path

Implementation order matters — complete top to bottom.

## Setup

- [x] Confirm `INPUT_COMMIT` title strings (`chore: version package`, `chore: version package
    (rc)`) via `git log` and `deployment/.gitlab-ci.yml`.
- [x] Confirm `catalog` job precedent for `chore:`-title skip rule.

## Core

- [x] Add `when: never` rule to `source` job in `deployment/.gitlab-ci.yml` matching protected-main
      `parent_pipeline` push with release-automation commit title.
- [x] Add matching `when: never` rule to `coverage` job.

## Integration

- [x] Update `test/internal/release.test.ts` to assert the new rule text is present for both jobs.
- [x] Re-run `bun test test/internal/release.test.ts test/internal/catalog-runner.test.ts` and confirm
      no regressions to existing assertions (e.g. `child:\n  stage: verify\n  rules:\n    - if:
    '$CI_PIPELINE_SOURCE == "parent_pipeline"'` string-match tests must still pass or be updated
      consistently).

## Verification

- [x] `bun fmt --check`
- [x] `bun lint`
- [x] `bun typecheck`
- [x] `bun test`
- [x] All specs in `spec/` reviewed against implementation
- [x] Archive proposal per plan/PROPOSAL.md
