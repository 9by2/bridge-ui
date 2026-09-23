# Release Merge Fast Path

**Proposal:** `release-fast-path`
**Status:** in-progress
**Phase:** amends `plan/spec/gitlab-release/spec.md` and `plan/spec/changeset-release/spec.md`

## Problem

Merging the automated `changeset-release/main` MR into `main` re-runs the full `source` and `coverage`
verify jobs (fmt, lint, typecheck, boundary, build, test, coverage:brand, verify:package,
verify:tree-shaking, coverage:runtime) even though that commit only ever changes
`package.json` version fields, `CHANGELOG.md`, and `.changeset/**`. The underlying app/shared
source was already verified on the feature MRs that were consumed into the changeset. This
duplicate verification adds pipeline time to every release with no additional safety, since the
`release` job still gates on `CI_COMMIT_REF_PROTECTED == "true"` regardless.

## Scope

### In scope

- Add a `when: never` short-circuit rule to the `source` and `coverage` jobs in
  `deployment/.gitlab-ci.yml` that matches only the protected-`main` push produced by squash-merging
  the release MR, identified by its fixed commit title (`chore: version package` or
  `chore: version package (rc)`, set by `INPUT_COMMIT` in the same file).
- Update `test/internal/release.test.ts` (and `catalog-runner.test.ts` if assertions overlap) to
  assert the new skip rule exists.
- Amend `plan/spec/gitlab-release/spec.md` to document the fast path.

### Out of scope

- Changing the `catalog` job rule (already skips any `chore:`-titled commit).
- Changing the `release` job's protected-branch gate.
- Skipping verification on the `changeset-release/main` branch's own MR pipeline — that pipeline
  still runs full `source`/`coverage` before the MR can be merged, since its `$CI_COMMIT_BRANCH` is
  not `main` (it runs as `merge_request_event`, matched separately).
- Any change to `changesets-gitlab` / `INPUT_COMMIT` title format itself.

## Success Criteria

- [x] Pushing the release-MR merge commit to protected `main` (title `chore: version package` or
      `chore: version package (rc)`) skips `source` and `coverage` jobs while `release` still runs.
- [x] Any other push to protected `main` (e.g. a manual `chore:` commit with a different title, or a
      real feature merge) still runs `source`/`coverage` unchanged.
- [x] The release MR's own merge-request pipeline still runs full `source`/`coverage` before merge is
      allowed (no regression to pre-merge verification).
- [x] `test/internal/release.test.ts` codifies the new rule.

## Specs

| Spec                | Path                             | Summary                                                                                 |
| ------------------- | -------------------------------- | --------------------------------------------------------------------------------------- |
| `release-fast-path` | `spec/release-fast-path/spec.md` | Skip redundant verify jobs for the version-only release-merge commit on protected main. |

## References

- `plan/spec/gitlab-release/spec.md`
- `plan/spec/changeset-release/spec.md`
- `deployment/.gitlab-ci.yml`
