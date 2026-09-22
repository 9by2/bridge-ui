# Spec: Theme Customization

**Spec ID:** `theme-customization`
**Proposal:** `theme-customization`
**Status:** accepted

## Summary

Defines the additive public Bridge UI theme customization contract for scoped colors, shared radius, shared spacing, and density presets. The package retains behavior, accessibility, and static CSS ownership.

## Requirements

### REQ-001: Scoped typed customization

`Theme` accepts optional `density` and `theme` props and exposes the resolved contract to package portals.

**Acceptance:**

- [ ] Nested Themes inherit omitted override values.
- [ ] Only documented `--bridge-*` variables are emitted.
- [ ] Existing `ThemeMode` behavior remains compatible.

### REQ-002: P0 geometry and color coverage

Button, Input, Textarea, Card, Dialog, Popover, Toast, and Sonner consume documented semantic custom properties.

**Acceptance:**

- [ ] Consumer radius and density values affect P0 shared geometry.
- [ ] Consumer color values affect P0 semantic surfaces/actions.
- [ ] Explicit local semantic props remain valid.

### REQ-003: Documentation

Consumer setup, supported variables, P0 matrix, and limitations are documented.

**Acceptance:**

- [ ] `CUSTOMIZATION.md` contains setup and examples.
- [ ] README links `CUSTOMIZATION.md`.

## Schema / API

```ts
const BridgeDensity = { compact: "compact", default: "default", comfortable: "comfortable" } as const
type BridgeDensity = ValueOf<typeof BridgeDensity>

type BridgeThemeOverride = {
  color?: Record<
    "background" | "foreground" | "primary" | "primaryForeground" | "surface" | "surfaceForeground" | "border",
    string
  >
  radius?: Partial<Record<"control" | "controlSmall" | "surface" | "overlay", string>>
  space?: Partial<Record<1 | 2 | 3 | 4 | 5, string>>
}
```

## Non-Goals

- Arbitrary per-component style maps.
- Generated component source edits.
- A claim of all-component customization coverage.
