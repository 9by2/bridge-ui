# Design: Component Variant Repair

## Overview

Presentation repairs remain additive. ImageCrop preserves ReactCrop's intrinsic root sizing so its overlay and media share one measurement box; Table frame opts out of flex shrinking; Calendar renders a continuous range track aligned to inset endpoint controls and uses an inset today ring.

## Components

| Component        | Responsibility                               | Location                                    |
| ---------------- | -------------------------------------------- | ------------------------------------------- |
| ImageCrop        | Intrinsic crop surface and media containment | `app/component/brand/stylex/image-crop.tsx` |
| Table            | Full-width framed surface                    | `app/component/brand/stylex/table.tsx`      |
| Calendar         | Distinct today and selected visual states    | `app/component/brand/stylex/calendar.tsx`   |
| Catalog examples | Make public variants apparent                | `internal/catalog/example/`                 |

## Example Code

```tsx
<Calendar mode="range" numberOfMonths={2} selected={range} />
// Range middle dates share a continuous track; endpoints remain distinct.

<Table variant="frame" className="flex-1">...</Table>
```

## Risks & Mitigations

| Risk                                    | Mitigation                                                                  |
| --------------------------------------- | --------------------------------------------------------------------------- |
| Crop root and media use different boxes | Load upstream CSS in package and catalog; do not override media dimensions. |
| Calendar range states regress           | Keep modifier data public and verify range/today composition in WebView.    |
