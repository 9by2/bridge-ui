# Page Layout Variant

**Proposal:** `page-layout-variant`
**Status:** in-progress
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

`Page` always constrains and centers its content, preventing applications from choosing full-width page composition.

## Scope

### In scope

- Make full-width `Page` layout the default.
- Provide an explicit `container` variant for constrained, centered layout.
- Document and catalog the variant.

### Out of scope

- Consumer application migration.
- New container widths or breakpoint rules.

## Success Criteria

- [ ] Default `Page` has no container layout.
- [ ] `Page variant="container"` opts into the constrained centered layout.
- [ ] The public API is documented and shown in the catalog.

## Specs

| Spec                | Path                               | Summary                       |
| ------------------- | ---------------------------------- | ----------------------------- |
| page-layout-variant | `spec/page-layout-variant/spec.md` | Page layout variant contract. |

## References

- [Page source](../../app/component/brand/stylex/page.tsx)
- [Foundation quality](../../ADHD.md#quality)
