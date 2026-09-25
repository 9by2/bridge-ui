# Spec: Effect Color Token

**Spec ID:** `effect-color-token`
**Proposal:** `effect-color-token`
**Status:** accepted

## Summary

Owned modal backdrops, elevation shadows and the Cue scrollbar derive from public semantic CSS variables.

## Requirements

### REQ-001: Backdrop and shadow variables

`--bridge-color-backdrop` (StyleX fallback `rgb(0 0 0 / 10%)`) colors Dialog, AlertDialog, Sheet and Drawer backdrops. `--bridge-color-shadow` (StyleX fallback `black`; no stylesheet default so a Theme inline override and host CSS on any Theme root both apply) colors every owned elevation shadow; recipes own alpha and geometry.

**Acceptance:**

- [x] `Theme theme={{ color: { backdrop, shadow } }}` emits both variables and portals inherit them.
- [x] Host CSS override reaches compiled Dialog backdrop and popup shadow.
- [x] Default output is visually unchanged.

### REQ-002: Scrollbar variables

`--bridge-color-scrollbar` and `--bridge-color-scrollbar-hover` color the Cue scrollbar thumb.

### REQ-003: Calendar colored event text

Colored all-day BridgeCalendar events choose black or white text from the event color lightness.

### REQ-004: Generated catalog reference

Generated Shadcn backdrops use `bg-overlay` and the slider thumb uses `bg-background`, applied only through `cmd/refresh-shadcn-doctor.ts`. Catalog Tailwind `--overlay` and `--shadow-*` resolve from `--bridge-color-backdrop` / `--bridge-color-shadow` on every theme scope.

**Acceptance:**

- [x] Defaults match former `bg-black/10` and Tailwind black shadow.
- [x] Scoped override reaches generated utilities.

## Non-Goals

- Recharts engine attribute selectors, color picker preset data, Bubble tinted lightness factors.
