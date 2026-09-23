# Spec: Release Merge Fast Path

**Spec ID:** `release-fast-path`
**Proposal:** `release-fast-path`
**Status:** accepted

## Summary

Amends `plan/spec/gitlab-release/spec.md`: on the protected default branch, when the push pipeline's
commit title exactly equals the Changesets release-automation title (`chore: version package` or
`chore: version package (rc)`), the `source` and `coverage` verify jobs are skipped (`when: never`)
and only the `release` deploy job runs. Every other pipeline — including the release MR's own
pre-merge pipeline — continues to run full verification unchanged.

## Requirements

### REQ-001 Fast-path condition scoped to exact automation title

The skip rule matches only `$CI_PIPELINE_SOURCE == "parent_pipeline" && $CI_COMMIT_BRANCH ==
$CI_DEFAULT_BRANCH && $CI_COMMIT_REF_PROTECTED == "true" && $CI_COMMIT_TITLE =~ /^chore: version
package( \(rc\))?$/`.

**Acceptance:**

- [x] `deployment/.gitlab-ci.yml` `source` job has a `when: never` rule with this exact condition,
      ordered before the existing `parent_pipeline` run rule.
- [x] `deployment/.gitlab-ci.yml` `coverage` job has the same rule.
- [x] The condition string matches `INPUT_COMMIT: "chore: version package"` declared in the
      `release` job of the same file (title stays in sync).

### REQ-002 No regression to pre-merge or non-automation verification

Any pipeline that is not this exact protected-main automation push still runs `source` and
`coverage` as before.

**Acceptance:**

- [x] The release MR's own `merge_request_event` pipeline (branch = `changeset-release/main`) is
      unaffected — condition requires `CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH`, which the MR branch
      never satisfies.
- [x] A manual commit on protected `main` with any other title still runs `source`/`coverage`.
- [x] `catalog` job rule is unchanged.

### REQ-003 Release job unaffected

The `release` deploy job keeps its existing protected-branch gate and runs regardless of this
change.

**Acceptance:**

- [x] `release` job rule in `deployment/.gitlab-ci.yml` is unmodified by this spec.

## Schema / API

```yaml
rules:
  - if: '$CI_PIPELINE_SOURCE == "parent_pipeline" && $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH && $CI_COMMIT_REF_PROTECTED == "true" && $CI_COMMIT_TITLE =~ /^chore: version package( \(rc\))?$/'
    when: never
  - if: '$CI_PIPELINE_SOURCE == "parent_pipeline"'
```

## Examples

### Example: release-MR merge commit on main

**Input:** push to `main`, `CI_COMMIT_TITLE = "chore: version package"`,
`CI_COMMIT_REF_PROTECTED = "true"`, `CI_PIPELINE_SOURCE = "parent_pipeline"`

**Output:** `source` and `coverage` jobs skipped; `release` job runs.

### Example: RC release-MR merge commit on main

**Input:** `CI_COMMIT_TITLE = "chore: version package (rc)"`, same other conditions.

**Output:** `source` and `coverage` jobs skipped; `release` job runs.

### Example: feature merge to main

**Input:** `CI_COMMIT_TITLE = "feat(button): add loading state"`, same other conditions.

**Output:** `source` and `coverage` jobs run as before.

### Example: release MR's own pipeline

**Input:** `CI_PIPELINE_SOURCE = "merge_request_event"`, `CI_COMMIT_BRANCH` unset/`changeset-release/main`.

**Output:** unaffected — child pipeline runs under existing `merge_request_event` parent rule with
full `source`/`coverage`/`catalog`.

## Non-Goals

- Changing the release-automation commit title format.
- Skipping verification on the release MR's own pipeline before merge.
- Any change to publish/tag/registry behavior in the `release` job.
