# Spec: Component Variant Expansion

**Spec ID:** `component-variant-expansion`
**Proposal:** `component-variant-expansion`
**Status:** accepted

## Summary

Defines additive shared UI variants, ReactCrop-compatible image selection, a canonical framed Table API, and representative catalog examples.

## Requirements

### REQ-001: Semantic variants

Alert, Badge, Card, Checkbox, Slider, StatusStamp, and Textarea expose typed variants. StatusStamp includes neutral, info, pending, inactive, partial-success, success, warning, and destructive.

**Acceptance:**

- [ ] Existing variant contracts remain valid.
- [ ] New variants are exported and catalogued.

### REQ-002: Composed controls

Collapsible supplies an optional chevron trigger and line separation. Combobox supplies a button trigger composition. Slider permits range and thumb colors or custom thumb content.

**Acceptance:**

- [ ] Controls retain keyboard and accessible primitive semantics.

### REQ-003: Image crop compatibility

ImageCrop accepts the ReactCrop crop, constraint, state, callback, and selection presentation options. `ImageCropEditor` retains Bridge file encoding rather than combining it with controlled crop selection.

**Acceptance:**

- [ ] `crop`, `onChange`, `onComplete`, `aspect`, selection constraints, disabled/locked behavior, and selection options work.

### REQ-004: Canonical framed tables

Table supports plain and framed variants. The framed variant provides density, hint, and scroll viewport composition. TableFrame symbols remain functional aliases.

**Acceptance:**

- [ ] Native plain table semantic composition remains valid.
- [ ] Existing TableFrame examples and imports retain behavior.

### REQ-005: Catalog repairs

Calendar days have at least 4px padding. Drawer represents all four sides. Page uses default line Tabs. Resizable shows horizontal and vertical layouts. ResponsiveImage demonstrates `sizes` and responsive sources. MultiSelect command surfaces have a visible background.

**Acceptance:**

- [ ] Catalog covers each public request and passes catalog checks.

## Non-Goals

- Application migrations.
- Replacing Base UI or ReactCrop interactions with local copies.
