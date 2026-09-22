# Restore CI Coverage

**Proposal:** `restore-ci-coverage`
**Status:** completed

## Problem

Runtime branch coverage is below the required 90% CI threshold.

## Scope

### In scope

- Add public-contract coverage for meaningful board behavior.
- Run every local CI verification job sequentially.

### Out of scope

- Change production behavior or coverage thresholds.

## Success Criteria

- [x] Runtime coverage meets every 90% threshold.
- [x] All source, coverage, package, and focused catalog regression commands pass.

## Specs

| Spec             | Path                            | Summary                             |
| ---------------- | ------------------------------- | ----------------------------------- |
| runtime-coverage | `spec/runtime-coverage/spec.md` | Required runtime coverage contract. |

## References

- `ADHD.md`
- `deployment/.gitlab-ci.yml`
