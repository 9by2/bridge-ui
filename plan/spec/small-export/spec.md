# Spec: Small Export

**Spec ID:** `small-export`
**Proposal:** `consumer-gap-close`
**Status:** accepted

## Summary

Type and thin wrapper exports so consumers drop direct third-party imports.

## Requirements

### REQ-001

- `export type { DateRange, Matcher } from "react-day-picker"` next to `Calendar`.
- `MultiSelectSeparator` thin wrapper over `CommandSeparator`.
- `export type { Crop, PercentCrop, PixelCrop } from "react-image-crop"` next to `ImageCrop`.

**Acceptance:**

- [x] Root and direct entries expose each name; the declaration output resolves them.
- [x] `MultiSelectSeparator` renders a separator inside a multi-select list.
