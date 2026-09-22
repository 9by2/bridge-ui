# Settings Composition

**Proposal:** `settings-composition`
**Status:** done
**Phase:** [Foundation First](../../ADHD.md#foundation-first)

## Problem

Consumers can assemble `Sidebar` and `SettingItem`, but the package has no responsive composition for settings content in constrained dialogs and tablet layouts.

## Scope

### In scope

- Export an owned settings composition with sidebar navigation and content slots.
- Replace the sidebar with a dialog-backed section picker below 768px.
- Add a catalog example using existing setting rows.

### Out of scope

- Product routes, persisted selection, translated product copy, or consumer migration.

## Success Criteria

- [x] Desktop renders a semantic settings navigation beside its content.
- [x] Tablet and smaller renders a dialog-backed navigation picker.
- [x] Navigation item activation works through its public button contract.
- [x] Package test, typecheck, and catalog build pass.

## Specs

| Spec                 | Path                                | Summary                                   |
| -------------------- | ----------------------------------- | ----------------------------------------- |
| settings-composition | `spec/settings-composition/spec.md` | Responsive settings composition contract. |

## References

- [ADHD.md](../../ADHD.md)
- User-provided settings reference
- [ClickUp settings navigation](https://mobbin.com/sites/sections/bc246468-a583-4199-b5f6-78f7957aa779)
