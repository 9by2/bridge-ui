# Breadcrumb Custom Separator

**Proposal:** `breadcrumb-custom-separator`
**Status:** in-progress
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

`BreadcrumbSeparator` already accepts caller content, but the catalog only displays the default chevron and does not communicate the customization contract.

## Scope

### In scope

- Show a slash custom separator in the Breadcrumb catalog example.
- Retain a public-contract regression assertion for custom separator content.

### Out of scope

- Add automatic separator insertion.
- Change the default chevron separator.

## Success Criteria

- [ ] The catalog renders a caller-provided slash separator.
- [ ] The component test verifies custom separator content remains available.

## Specs

| Spec                        | Path                                       | Summary                           |
| --------------------------- | ------------------------------------------ | --------------------------------- |
| breadcrumb-custom-separator | `spec/breadcrumb-custom-separator/spec.md` | Separator child-content contract. |

## References

- [ADHD.md](../../ADHD.md)
