# Color picker

**Proposal:** `color-picker`
**Status:** done
**Phase:** [ADHD.md](../../ADHD.md) — reusable presentation component

## Problem

Product surfaces (event/ticket background, theme accent) need a swatch picker: a grid of circular fill or gradient swatches, a clear selected ring, and a trailing "more" control for a custom color. No package component provides this, so each application would re-implement palette, selection semantics and custom-color entry.

## Scope

### In scope

- `ColorPicker` presentation component with radio-group semantics.
- Fill and gradient option support; gradient defaults to `linear` (135deg), `radial` optional.
- System presets `colorPickerPreset.gradient` (default, reference palette) and `colorPickerPreset.fill`; consumer may inject any option list.
- Trailing custom-color popover (native color input + hex field) that emits a fill option.
- `size` (`sm` / `md` / `lg`) and `layout` (`grid` / `row`) variants; `column` for grid.
- Controlled / uncontrolled value, disabled, form `name`, caller-supplied copy.
- Export, catalog, CUSTOMIZATION doc, changeset, tests, Bun.WebView evidence.

### Out of scope

- Custom gradient authoring, eyedropper, alpha channel, saved/recent colors.
- Persisting selection or mapping to product theme (application-owned).

## Success Criteria

- [x] Keyboard and pointer select any preset swatch; selection exposed as `aria-checked`.
- [x] Custom hex commits only when valid and shows as selected in the trailing slot.
- [x] Every variant is demonstrated in catalog and CUSTOMIZATION.md.
- [x] Package, coverage, catalog and browser gates pass.

## Specs

| Spec         | Path                        | Summary                   |
| ------------ | --------------------------- | ------------------------- |
| color-picker | `spec/color-picker/spec.md` | Public component contract |
