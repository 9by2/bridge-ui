# Spec: Resizable Sheet

**Spec ID:** `resizable-sheet`
**Proposal:** `resizable-sheet`
**Status:** accepted

## Summary

This spec defines an opt-in native resizing capability for the owned Sheet content surface.

## Requirements

### REQ-001: Opt-in SheetContent resizing

`SheetContent` accepts `resizable?: boolean`, defaulting to `false`.

**Acceptance:**

- [ ] A resizable side sheet exposes `data-resizable="true"` and its side-specific native resize property.
- [ ] A sheet without `resizable` retains its current dimensions and no resize property.

### REQ-002: Side-aware resize axis

Left and right sheets resize horizontally. Top and bottom sheets resize vertically.

**Acceptance:**

- [ ] The fixed outer edge for each side remains anchored during resizing.

## Schema / API

```ts
type SheetContentProps = Primitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  resizable?: boolean
}
```

## Examples

### Resizable inspector

```tsx
<SheetContent side="right" resizable />
```

## Non-Goals

- Persisting the resized dimension.
- Keyboard resizing controls.
