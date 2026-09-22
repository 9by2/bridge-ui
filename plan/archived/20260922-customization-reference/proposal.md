# Customization Reference

**Proposal:** `customization-reference`
**Status:** in-progress
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

`CUSTOMIZATION.md` explains theme setup and a few components but does not give consumers a compact, complete map of the public component families and their meaningful customization seams.

## Scope

### In scope

- Add a concise component reference for every public family.
- Document only meaningful consumer-facing customization, composition, controlled-state, and accessibility seams.
- Keep Theme setup and P0 support matrix accurate.

### Out of scope

- Duplicating generated API reference or native HTML prop documentation.
- Changing component behavior or consumer application code.

## Success Criteria

- [x] Every catalog/public component family appears in the customization reference.
- [x] Documentation distinguishes supported props from unsupported internal selector overrides.
- [x] Documentation remains concise and usable as the package entry guide.

## Specs

| Spec                    | Path                                   | Summary                                           |
| ----------------------- | -------------------------------------- | ------------------------------------------------- |
| customization-reference | `spec/customization-reference/spec.md` | Compact public component customization reference. |

## References

- [ADHD.md](../../ADHD.md)
- [CUSTOMIZATION.md](../../CUSTOMIZATION.md)
