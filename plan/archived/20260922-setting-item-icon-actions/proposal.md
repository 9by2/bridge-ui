# Setting Item Icon Actions

**Proposal:** `setting-item-icon-actions`
**Status:** in-progress
**Phase:** [Foundation First](../../ADHD.md#foundation-first)

## Problem

Inline setting rows need a compact, recognizable edit affordance in their catalog examples.

## Scope

### In scope

- Show accessible edit icon buttons in `SettingItem` and `Settings` catalog examples.

### Out of scope

- New `SettingItem` behavior, consumer migration, or persisted editing.

## Success Criteria

- [ ] Both catalogs present edit actions as labelled icon buttons.
- [ ] Catalog build and focused WebView accessibility verification pass.

## Specs

| Spec                      | Path                                     | Summary                       |
| ------------------------- | ---------------------------------------- | ----------------------------- |
| setting-item-icon-actions | `spec/setting-item-icon-actions/spec.md` | Catalog icon-action contract. |

## References

- [ADHD.md](../../ADHD.md)
- User-provided account settings reference
