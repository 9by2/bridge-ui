# Setting Item Inline Variant

**Proposal:** `setting-item-inline`
**Status:** in-progress
**Phase:** [Foundation First](../../ADHD.md#foundation-first)

## Problem

Account-style settings need compact label-and-value rows, but `SettingItem` only documents its descriptive default presentation.

## Scope

### In scope

- Add a public inline variant for compact setting rows.
- Document the variant in the catalog.

### Out of scope

- Product account screens, editing logic, i18n, or consumer migration.

## Success Criteria

- [ ] `SettingItem` supports an inline label-and-action layout.
- [ ] Long caller-owned action content remains contained.
- [ ] The catalog shows account-style inline rows.
- [ ] Focused test, format, lint, typecheck, catalog build, and package build pass.

## Specs

| Spec                | Path                               | Summary                      |
| ------------------- | ---------------------------------- | ---------------------------- |
| setting-item-inline | `spec/setting-item-inline/spec.md` | Inline setting row contract. |

## References

- [ADHD.md](../../ADHD.md)
- User-provided account settings reference
