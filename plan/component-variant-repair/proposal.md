# Component Variant Repair

**Proposal:** `component-variant-repair`
**Status:** in-progress
**Phase:** [Quality](../../ADHD.md#quality)

## Problem

The expanded component catalog obscures the Collapsible line variant, ImageCrop lacks a stable responsive surface, framed Tables can shrink in flex layouts, and Calendar overlaps today and selected states.

## Scope

### In scope

- Make the Collapsible variant example explicit.
- Give ImageCrop a Bridge-owned responsive wrapper around ReactCrop.
- Ensure framed Tables fill available width.
- Give Calendar today and selected dates distinct, composable presentation.

### Out of scope

- Changes to generated Shadcn source.
- Crop geometry or Table semantic API changes.

## Success Criteria

- [ ] Catalog visibly labels the Collapsible line variant.
- [ ] ImageCrop fills its available surface without overflowing its preview.
- [ ] `Table variant="frame"` fills its parent width.
- [ ] Today stays visibly distinct when selected.
- [ ] Targeted behavior and catalog WebView checks pass.

## Specs

| Spec                     | Path                                    | Summary                                                  |
| ------------------------ | --------------------------------------- | -------------------------------------------------------- |
| component-variant-repair | `spec/component-variant-repair/spec.md` | Repair contracts for catalog and component presentation. |

## References

- [ADHD.md](../../ADHD.md)
- [Component variant expansion archive](../archived/20260922-component-variant-expansion/)
