# Spec: Icon Slot

**Spec ID:** `icon-slot`
**Proposal:** `consumer-gap-close`
**Status:** accepted

## Summary

Every owned component that renders an icon accepts an arbitrary consumer `ReactNode`, typically an SVG using `currentColor`, and sizes it consistently. The package ships no brand, social or logo glyph (DEC-003). A consumer icon with no intrinsic `width`/`height` is sized by its slot. An explicitly sized icon (a `width` attribute, e.g. lucide `size`, or a `size-*` class) keeps its own size.

## Requirements

### REQ-001: Open slot

No icon slot types its input as a lucide component or passes lucide-only props.

**Acceptance:**

- [x] Audit table below covers every icon slot.

### REQ-002: Consistent sizing (DEC-011)

A neutral inline SVG with no intrinsic size renders at the slot's documented size and inherits the slot's text color through `currentColor`.

**Acceptance:**

- [x] Browser: `item/custom-icon` renders the mark at the sizes in the table (`test/browser/responsive.test.ts`).
- [x] Browser: explicitly sized lucide icons in `metric-tile/variants` keep 18px.

## Audit

| Slot                         | Accepts                                     | Size (unsized SVG) | Before                      | Fix                            |
| ---------------------------- | ------------------------------------------- | ------------------ | --------------------------- | ------------------------------ |
| `Button` children            | `ReactNode`                                 | 16 (sm 14, xs 12)  | ok                          | —                              |
| `ItemMedia`                  | `ReactNode`                                 | 16                 | ok                          | —                              |
| `MetricTile.icon`            | `ReactNode`                                 | 18                 | **34** (filled box)         | `metric-tile-icon` slot sizing |
| `MarkerIcon`                 | `ReactNode`                                 | 16                 | ok                          | —                              |
| `Badge` children             | `ReactNode`                                 | 12                 | ok                          | —                              |
| `SidebarMenuButton` children | `ReactNode`                                 | 16                 | ok                          | —                              |
| `SettingsNavItem` children   | `ReactNode`                                 | 16 + 8 gap         | **unsized**                 | slot sizing + gap              |
| `DataStateMedia`             | `ReactNode`                                 | 24                 | **filled box**              | slot sizing                    |
| `EmptyMedia variant="icon"`  | `ReactNode`                                 | 16                 | **32** (filled box)         | slot sizing                    |
| `Avatar`                     | image / fallback `ReactNode`                | fallback content   | ok                          | —                              |
| `BridgeCalendarEvent.icon`   | `ReactNode`                                 | inline             | ok                          | —                              |
| `UploadPreview`              | internal file-type icon; caller `thumbnail` | 16                 | ok (not a caller icon slot) | —                              |
| `SettingItem`                | compound children                           | —                  | ok (no icon slot)           | —                              |

## Non-Goals

- Brand, social, streaming or logo glyphs, or a brand-icon export.
