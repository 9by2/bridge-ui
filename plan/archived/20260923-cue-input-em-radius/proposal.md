# Cue Input Relative Radius

**Proposal:** `cue-input-em-radius`
**Status:** done
**Phase:** [Foundation quality](../../ADHD.md#5-quality)

## Problem

Cue Input currently uses a root-relative radius (`0.5rem`); the desired unit is `em` so its radius follows its responsive font size.

## Scope

### In scope

- Use `em` for Cue's default control radius and Input's standalone fallback.
- Preserve explicit Theme overrides; verify at mobile and desktop font sizes.
- Amend the shipped Cue Input radius spec through this proposal.

### Out of scope

- Changing generated source or adding new Input variants for a unit-only change.
- Migrating consumer applications.

## Success Criteria

- [x] Cue Input radius uses `em` and follows its responsive font size.
- [x] Explicit radius override still wins; package gates pass.

## Specs

| Spec             | Path                            | Summary                                      |
| ---------------- | ------------------------------- | -------------------------------------------- |
| cue-input-radius | `spec/cue-input-radius/spec.md` | Amend default unit and responsive acceptance |

## References

- `../../ADHD.md`
- `../spec/cue-input-radius/spec.md`
