# Cue Input Radius

**Proposal:** `cue-input-radius`
**Status:** done
**Phase:** [Foundation quality](../../ADHD.md#5-quality)

## Problem

The owned Input renders a 10px control radius in Cue mode, while Cue's source Input uses `rounded-lg` (8px). The package Theme currently supplies the same 10px default in every mode.

## Scope

### In scope

- Match Cue's default control radius in Cue mode without breaking explicit radius overrides.
- Verify the public Input in a browser and document its theme behavior.

### Out of scope

- Editing generated Shadcn source or migrating consumers.
- Changing other theme defaults.

## Success Criteria

- [x] Cue Input has an 8px radius; an explicit control radius still wins.
- [x] Existing package gates pass.

## Specs

| Spec             | Path                            | Summary                                    |
| ---------------- | ------------------------------- | ------------------------------------------ |
| cue-input-radius | `spec/cue-input-radius/spec.md` | Cue control radius and override precedence |

## References

- `../../ADHD.md`
- `/Users/h/dev/@talent-tech/cueeee/cue/app/component/shadcn/input.tsx`
