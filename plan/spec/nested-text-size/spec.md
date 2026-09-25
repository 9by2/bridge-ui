# Spec: Nested Text Size

**Spec ID:** `nested-text-size`
**Proposal:** `nested-text-size`
**Status:** accepted

## Requirements

### REQ-001: Non-compounding text

Muted, Small, Large, Body, StatusStamp, Badge, TimelineStepDescription, TimelineStepTime, WizardStepDescription, WizardStepCounter, and DetailItemLabel resolve their font size from rem-based `--bridge-text-size-*` tokens. Their default computed size does not change with nesting depth and is never below 12px (at a 16px root).

### REQ-002: SwimLaneBoard text

The count badge and corner label default to at least 12px. SwimLaneBoardItem uses `--bridge-text-size-base` (0.875rem), and nested text components keep their own size.

### REQ-003: Lane width

`columnMinWidth` and `columnMaxWidth` (CSS length or px number) bound each expanded column track. The defaults are `min(18rem, 82vw)` and `20rem`. At a 390px viewport, one no-lane board lane fits fully with about 40px of the next lane visible. The grid never stretches a lane past the maximum.

## Schema / API

```ts
type SwimLaneBoardProps = {
  columnMinWidth?: CSSProperties["minWidth"]
  columnMaxWidth?: CSSProperties["maxWidth"]
}
```

Tokens: `--bridge-text-size-xs` 0.75rem, `-sm` 0.75rem, `-md` 0.8125rem, `-base` 0.875rem, `-lg` 1rem.
