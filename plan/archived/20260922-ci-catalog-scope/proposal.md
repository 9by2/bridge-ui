# CI Catalog Scope

**Proposal:** `ci-catalog-scope`
**Status:** in-progress
**Phase:** [Quality](../../ADHD.md#quality)

## Problem

GitLab creates both branch and merge-request pipelines for an open merge request, running the expensive catalog browser gate twice. The catalog also runs for commits where its full visual and accessibility suite is not needed.

## Scope

### In scope

- Prevent duplicate branch pipelines when an MR pipeline exists.
- Run the catalog gate only for non-chore MR and default-branch commits.
- Lock the pipeline contract with a regression test.

### Out of scope

- Removing catalog accessibility, visual, interaction, or memory checks.
- Changing source, coverage, package, or release verification scope.

## Success Criteria

- [ ] An MR push creates only the MR pipeline.
- [ ] Catalog runs only once for non-chore MR or default-branch commits.
- [ ] Catalog does not run for conventional `chore` commits.

## Specs

| Spec             | Path                            | Summary                                  |
| ---------------- | ------------------------------- | ---------------------------------------- |
| ci-catalog-scope | `spec/ci-catalog-scope/spec.md` | CI pipeline and catalog-job eligibility. |

## References

- [ADHD.md](../../ADHD.md#quality)
- [Catalog CI stability](../spec/catalog-ci-stability/spec.md)
