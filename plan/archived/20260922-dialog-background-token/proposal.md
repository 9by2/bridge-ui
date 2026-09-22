# Dialog Background Token

**Proposal:** `dialog-background-token`
**Status:** done
**Phase:** [Foundation First](../../ADHD.md#foundation-first)

## Problem

Dialog currently shares the generic surface color with Card, so a theme cannot set an independent modal background.

## Scope

### In scope

- Add documented Dialog background and foreground semantic color keys.
- Preserve the current surface pair as the fallback.
- Verify scoped Dialog portal customization.

### Out of scope

- Changing default Dialog visual values.
- AlertDialog customization changes.

## Success Criteria

- [x] Dialog supports independent background and foreground Theme overrides.
- [x] Dialog preserves the existing surface visual pair when no override is provided.

## Specs

| Spec                    | Path                                   | Summary                              |
| ----------------------- | -------------------------------------- | ------------------------------------ |
| dialog-background-token | `spec/dialog-background-token/spec.md` | Dialog semantic background contract. |

## References

- [Customization](../../CUSTOMIZATION.md#theme-customization)
