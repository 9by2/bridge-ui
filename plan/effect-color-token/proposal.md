# Effect Color Token

**Proposal:** `effect-color-token`
**Status:** in-progress
**Phase:** [ADHD.md](../../ADHD.md) Foundation 3 — canonical token support light and dark mode

## Problem

The shared theme token proposal moved owned recipe colors to `--bridge-color-*`, but modal backdrops, elevation shadows, the colored all-day calendar event text and the Cue scrollbar still carry literal `rgb(0 0 0 / N%)`, `#fff`, and `oklch(...)` values. A consumer cannot retint them from a Theme or host CSS.

## Scope

### In scope

- Public `--bridge-color-backdrop` for modal backdrop (Dialog, AlertDialog, Sheet, Drawer).
- Public `--bridge-color-shadow` for owned elevation shadows (menus, popover, hover card, select, navigation menu, toast, tabs, sidebar, chart tooltip, sheet, color picker, swim lane board, sidebar inset adapter).
- Public `--bridge-color-scrollbar` and `--bridge-color-scrollbar-hover` for the Cue scrollbar.
- BridgeCalendar colored all-day event text derived from the event color instead of fixed `#fff`.
- Theme `color.backdrop` and `color.shadow` typed overrides.
- CUSTOMIZATION.md documents the new variables and the remaining non-token exceptions.

- Generated Shadcn backdrop and slider thumb through the guarded CLI refresh (DEC-005).

### Out of scope

- Recharts engine-emitted `stroke="#ccc"` / `stroke="#fff"` attribute selectors.
- Color picker preset palette and `#000000` value default (user data).
- Bubble `tinted` relative-color lightness factors (recipe derivation from `primary`).
- Catalog shell and vendored TanStack examples.

## Success Criteria

- [ ] Zero literal `rgb(0 0 0 …)`, `black`, or `#fff` visual color in owned `app/component/brand/stylex/**` recipes except documented exceptions.
- [ ] Host override of `--bridge-color-backdrop` and `--bridge-color-shadow` reaches a compiled Dialog backdrop and popup shadow in the browser.
- [ ] Default rendering is unchanged (same default colors).
- [ ] fmt, lint, typecheck, test, coverage, build, catalog build and browser gates pass.

## Specs

| Spec               | Path                              | Summary                                              |
| ------------------ | --------------------------------- | ---------------------------------------------------- |
| effect-color-token | `spec/effect-color-token/spec.md` | Backdrop, shadow, scrollbar variables and exceptions |

## References

- [shared-theme-token spec](../spec/shared-theme-token/spec.md)
- [theme-customization spec](../spec/theme-customization/spec.md)
