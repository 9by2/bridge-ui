# Compact Page Spacing

**Proposal:** `page-compact-spacing`
**Status:** in-progress
**Phase:** [Foundation First](../../ADHD.md#foundation-first)

## Problem

The current page layout retains wide desktop gutters where dialog-adjacent and dense views need consistent 16px padding.

## Scope

### In scope

- Add zero, compact, and comfortable page spacing variants plus opt-in dynamic padding.
- Render every Page child in every spacing configuration in the page catalog.
- Reduce the Page title scale for a denser visual hierarchy.

### Out of scope

- New page layout primitives or consumer migration.

## Success Criteria

- [x] `Page` provides public compact and comfortable spacing options and opt-in dynamic padding.
- [x] The catalog renders every Page child in default, none, compact, comfortable, and dynamic-padding configurations.
- [x] Tests, typecheck, catalog build, and WebView padding verification pass.

## Specs

| Spec                 | Path                                | Summary                        |
| -------------------- | ----------------------------------- | ------------------------------ |
| page-compact-spacing | `spec/page-compact-spacing/spec.md` | Compact page padding contract. |

## References

- [ADHD.md](../../ADHD.md)
