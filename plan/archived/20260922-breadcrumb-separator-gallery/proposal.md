# Breadcrumb Separator Gallery

**Proposal:** `breadcrumb-separator-gallery`
**Status:** in-progress
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

The Breadcrumb catalog shows only one custom separator, which does not demonstrate the breadth of supported caller content.

## Scope

### In scope

- Add a catalog gallery of common textual, symbolic, and icon separator content.
- Verify multiple caller-provided separators render through the public component contract.

### Out of scope

- Add new Breadcrumb component props.
- Change Breadcrumb layout or default separator behavior.

## Success Criteria

- [ ] The catalog includes a named gallery with multiple separator types.
- [ ] The component test verifies text and element separator children.

## Specs

| Spec                         | Path                                        | Summary                                       |
| ---------------------------- | ------------------------------------------- | --------------------------------------------- |
| breadcrumb-separator-gallery | `spec/breadcrumb-separator-gallery/spec.md` | Catalog coverage for separator child content. |

## References

- [Breadcrumb custom separator spec](../spec/breadcrumb-custom-separator/spec.md)
