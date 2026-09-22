# Restore CI Coverage

**Proposal:** `restore-ci-coverage`
**Status:** in-progress

## Problem

Runtime branch coverage is below the required 90% CI threshold.

## Scope

### In scope

- Add public-contract coverage for meaningful board behavior.
- Run every local CI verification job sequentially.

### Out of scope

- Change production behavior or coverage thresholds.

## Success Criteria

- [ ] Runtime coverage meets every 90% threshold.
- [ ] All CI-equivalent commands pass.

## Specs

| Spec             | Path                            | Summary                             |
| ---------------- | ------------------------------- | ----------------------------------- |
| runtime-coverage | `spec/runtime-coverage/spec.md` | Required runtime coverage contract. |

## References

- `ADHD.md`
- `deployment/.gitlab-ci.yml`
