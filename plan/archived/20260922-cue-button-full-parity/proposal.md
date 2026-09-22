# Cue Button Full Parity

**Proposal:** `cue-button-full-parity`
**Status:** completed
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

The public Button retains local visual approximations after the default primary treatment. Its outline, secondary-expanded, and CTA treatments diverge from Cue's canonical Button source.

## Scope

### In scope

- Mirror every Cue Button root, variant, size, and interaction declaration in Bridge's public StyleX Button.
- Verify rendered Cue-mode variants and expanded state.

### Out of scope

- Runtime imports from Cue or product source.
- Bridge-only compound control extensions.

## Success Criteria

- [x] Cue-mode public Button visual behavior matches Cue's canonical button recipe.
- [x] Browser regression coverage protects each Cue variant family and expanded treatment.

## Specs

| Spec                   | Path                                  | Summary                               |
| ---------------------- | ------------------------------------- | ------------------------------------- |
| cue-button-full-parity | `spec/cue-button-full-parity/spec.md` | Complete public Button recipe parity. |

## References

- `/Users/h/dev/@talent-tech/cueeee/cue/app/component/shadcn/button.tsx`
- `/Users/h/dev/@talent-tech/cueeee/cue/app/globals.css`
