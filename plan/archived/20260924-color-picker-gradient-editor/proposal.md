# Color picker gradient editor

**Proposal:** `color-picker-gradient-editor`
**Status:** done
**Amends:** [plan/spec/color-picker/spec.md](../spec/color-picker/spec.md)

## Problem

The first `ColorPicker` custom editor only produced a solid hex even when the swatches were gradients. A gradient picker must let the user author any gradient the CSS gradient functions support.

## Scope

### In scope

- Required, explicitly declared `mode: "fill" | "gradient"`; the composing layer maps its payload into that mode.
- Gradient model: `kind` linear / radial / conic, `angle`, radial `shape`, `repeating`, stops with optional position.
- Gradient editor: type, angle or shape, repeating, stop list (color, position, add, remove, min 2).
- Emit the CSS string with a structured option; `colorPickerParse` restores it into the editor.
- Grouped `label` copy override replacing individual label props.

### Out of scope

- Interpolation color space, radial size keyword and center position, color hint, double-position stops, drag-on-bar stop editing.

## Success Criteria

- [x] Every gradient function is authorable and round-trips through `colorPickerParse`.
- [x] Catalog declares `mode` explicitly in every example, with payload-mapping fill and gradient examples.
- [x] Package, coverage, catalog and browser gates pass.

## Specs

| Spec         | Path                        | Summary                           |
| ------------ | --------------------------- | --------------------------------- |
| color-picker | `spec/color-picker/spec.md` | Updated public component contract |
