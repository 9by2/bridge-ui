# Color picker gradient kind from composition

**Proposal:** `color-picker-gradient-kind`
**Status:** done
**Amends:** [plan/spec/color-picker/spec.md](../spec/color-picker/spec.md)

## Problem

The gradient editor let the end user switch between linear, radial and conic. The gradient function is a product decision owned by the composing surface, the same as `mode`.

## Scope

- `kind` is required when `mode="gradient"`; the editor never offers a kind switch.
- Swatches and values of another kind are not rendered.
- `colorPickerGradientPreset(kind)` re-declares the system palette in a kind.
- Catalog declares `kind` in every gradient example; the gradient example composes three surfaces, one per kind.

Out of scope: unchanged from `color-picker-gradient-editor`.

## Success Criteria

- [x] No kind control in the editor; kind-specific controls only (angle, shape, from angle).
- [x] Type system rejects a gradient picker without `kind`.
- [x] Package, coverage, catalog and browser gates pass.

## Specs

| Spec         | Path                        | Summary                       |
| ------------ | --------------------------- | ----------------------------- |
| color-picker | `spec/color-picker/spec.md` | Adds required gradient `kind` |
