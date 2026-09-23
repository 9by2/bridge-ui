# Spec: Shared Theme Token

**Spec ID:** `shared-theme-token`
**Proposal:** `shared-theme-token`
**Status:** accepted

## Requirements

All owned component recipes derive theme colors, font families and sizes, radii and shared spacing from stable semantic variables declared in `app/style/component.css`. Themes retain light/dark/cue/future defaults; nested themes and portals inherit scoped overrides. Public semantic component props remain supported. No `--bridge-button-*`, `--bridge-slider-*`, or other component-named styling override is public. Keep engine-owned layout and dynamic-data custom properties separate from theme styling.

## Implementation boundary

Mode-dependent colors use semantic `--bridge-color-*` variables with a distinct fallback per mode in StyleX. Geometry uses semantic control/surface/overlay names plus a fixed-size radius scale; typography uses the shared font family and size scale. Deliberately square/circular shapes and data-driven or transient visual state values are not treated as theme tokens. Host CSS overrides are scoped to the Theme subtree, and Slider local color props still take precedence on their range or thumb.
