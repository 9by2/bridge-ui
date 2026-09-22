# Spec: Resizable Sheet

**Spec ID:** `resizable-sheet`
**Proposal:** `resizable-sheet-handle`
**Status:** accepted

## Summary

`SheetContent` supports opt-in resizing through a visible pointer drag handle located at the center of the side facing the application content.

## Requirements

### REQ-001: Visible resize handle

When `resizable` is true, `SheetContent` renders a `role="separator"` resize handle with an axis-appropriate accessible label.

**Acceptance:**

- [ ] Right sheets place the handle at the vertical center of their left edge; left sheets use their right edge.
- [ ] Top sheets place the handle at the horizontal center of their bottom edge; bottom sheets use their top edge.

### REQ-002: Pointer resizing

Dragging the handle changes the sheet width for left/right sides and height for top/bottom sides while preserving the side's fixed outer edge.

**Acceptance:**

- [ ] The sheet does not become smaller than 288px wide or 192px tall.
- [ ] The component reports the next dimension through `onSizeChange` and renders the caller-controlled `size`.

### REQ-003: Side-aware maximum dimension

Resizable left and right sheets accept `maxWidth` and default to `80vw`. Resizable top and bottom sheets accept `maxHeight` and default to `70vh`.

**Acceptance:**

- [ ] Consumer-provided `maxWidth` or `maxHeight` overrides the matching default bound.

## Schema / API

```ts
type SheetContentProps = Primitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  resizable?: boolean
  size?: number
  onSizeChange?: (size: number) => void
  maxWidth?: CSSProperties["maxWidth"]
  maxHeight?: CSSProperties["maxHeight"]
}
```

## Non-Goals

- Persisted dimensions.
- Keyboard dimension controls.
- Sheet-owned persistence.
