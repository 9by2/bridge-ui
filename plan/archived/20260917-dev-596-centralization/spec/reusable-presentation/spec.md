# Spec: Reusable Presentation

**Spec ID:** `reusable-presentation`
**Proposal:** `dev-596-centralization`
**Status:** accepted

## Summary

This spec defines consumer-independent presentation contracts for timeline progress, page toolbar, data state, and table frame. Every contract accepts caller content and native prop while excluding application routing, state management, translation, permission, and data behavior.

## Requirement

### REQ-001 Timeline

The package must expose a compound timeline component with vertical and horizontal orientation, position metadata, item state, connector treatment, indicator size/tone, content, title, description, and time slot.

**Acceptance:**

- [x] Every element exposes a documented `data-slot`.
- [x] Horizontal orientation contains overflow rather than widening the document.
- [x] Upcoming state remains visually distinct in light and dark theme.
- [x] Caller class, ref, ARIA, icon, and copy pass through.

### REQ-002 Page toolbar

The package Page composition must expose a full-width wrapping toolbar slot.

**Acceptance:**

- [x] Native div prop, ref, class, and accessible label pass through.
- [x] Narrow content wraps without document overflow.

### REQ-003 Data state

The package must expose a controlled state surface with neutral, loading, error, permission, and disabled presentation variants.

**Acceptance:**

- [x] Error and permission default to `role="alert"`; consumer role override remains possible.
- [x] Media, title, description, and action are independent child slots.
- [x] No default copy, icon, callback, or business effect exists.
- [x] Long and Thai copy wrap inside the surface.

### REQ-004 Table frame

The package must expose a bordered frame with optional mobile hint and a horizontally scrollable viewport.

**Acceptance:**

- [x] Compact and standard density are represented as presentation metadata.
- [x] The frame accepts any caller-owned semantic table content.
- [x] Horizontal overflow is contained by the viewport.
- [x] Hint copy is caller-owned and hidden above the mobile breakpoint.

### REQ-005 Package contract

Every new component must be available from the package root and a stable direct subpath.

**Acceptance:**

- [x] Declaration and JavaScript target exist in packed output.
- [x] Clean Vite client and SSR fixtures resolve the root and direct entry.
- [x] No consumer application import or undocumented transform is required.

## API

```tsx
type TimelineStepOrientation = "vertical" | "horizontal"
type TimelineStepPosition = "left" | "right" | "alternate"
type TimelineStepState = "default" | "completed" | "current" | "upcoming"
type DataStateVariant = "neutral" | "loading" | "error" | "permission" | "disabled"
type TableFrameDensity = "compact" | "standard"
```

## Non-Goal

- Product copy, retry callback, icon choice, route link, query state, permission rule, column model, row behavior, Studio density policy, or consumer migration.
