# Dialog Density Padding

**Proposal:** `dialog-density-padding`
**Status:** done
**Phase:** [Foundation First](../../ADHD.md#foundation-first)

## Problem

Dialog content honors density-aware surface padding, while its footer uses fixed 16px geometry. Compact and comfortable themes render inconsistent dialog spacing.

## Scope

### In scope

- Make Dialog footer offsets and padding follow the existing surface-padding token.
- Verify compact, default, and comfortable dialog geometry in the catalog browser.

### Out of scope

- Dialog API changes or consumer migration.
- AlertDialog styling changes.

## Success Criteria

- [x] Dialog content and footer use the same density-aware surface inset.
- [x] Catalog browser verification passes at each public density.

## Specs

| Spec                   | Path                                  | Summary                          |
| ---------------------- | ------------------------------------- | -------------------------------- |
| dialog-density-padding | `spec/dialog-density-padding/spec.md` | Dialog density padding contract. |

## References

- [ADHD.md](../../ADHD.md)
- [Customization](../../CUSTOMIZATION.md#theme-customization)
