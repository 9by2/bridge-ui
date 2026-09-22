# Cue Button Default Parity

**Proposal:** `cue-button-default-parity`
**Status:** in-progress
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

The public default button reimplements Cue styling without an explicit Cue-derived recipe or a rendered parity contract.

## Scope

### In scope

- Make the public StyleX default button recipe declaratively mirror Cue's default button.
- Add rendered Cue-theme regression coverage for the default treatment.

### Out of scope

- Import Cue application source or alter consumer migration.
- Change non-default button variants.

## Success Criteria

- [ ] The Cue theme's default button has Cue's exact palette, geometry, type, and active treatment.
- [ ] Public theme overrides remain supported.

## Specs

| Spec                      | Path                                     | Summary                                |
| ------------------------- | ---------------------------------------- | -------------------------------------- |
| cue-button-default-parity | `spec/cue-button-default-parity/spec.md` | Public default Button parity with Cue. |

## References

- `../../ADHD.md`
- `/Users/h/dev/@talent-tech/cueeee/cue/app/component/shadcn/button.tsx`
