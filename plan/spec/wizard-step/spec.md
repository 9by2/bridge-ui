# Spec: Wizard Step

**Spec ID:** `wizard-step`
**Proposal:** `wizard-step`
**Status:** accepted

## Summary

This spec defines a consumer-independent presentation contract for a
multi-step wizard header: a horizontal-or-vertical row of step indicators
connected by a progress line, distinct from `TimelineStep`'s content-feed
layout. The package owns geometry, semantic slot, color token, and
accessibility default; the application owns the active-step index,
validation outcome, copy, and navigation side effect.

## Requirement

### REQ-001 Root container

The package must expose a `WizardStep` root that accepts `orientation`
(`horizontal` default, `vertical`), `variant` (`number` default, `dot`,
`line`), and `tone` (`hard` default, `soft`).

**Acceptance:**

- [x] `data-slot="wizard-step"`, `data-orientation`, `data-variant`,
      `data-tone` are present on the root.
- [x] Horizontal orientation contains overflow (`overflowX: auto`) rather
      than widening the document.
- [x] Native `div` prop, `ref`, `className`, and ARIA pass through.

### REQ-002 Step item and interactive completed state

The package must expose a `WizardStepItem` accepting `state` (`upcoming`
default, `current`, `completed`, `error`) and supporting a Base UI `render`
override.

**Acceptance:**

- [x] `data-slot="wizard-step-item"` and `data-state` are present.
- [x] Default render is a non-interactive `<div>` for every state.
- [x] Passing `render={<button/>}` or `render={<a/>}` swaps the rendered
      tag while preserving `data-slot`/`data-state` and merged props
      (Base UI `mergeProps` semantics, matching `Marker`/`Item`).
- [x] No built-in click handler, `onStepClick`, or navigation side effect
      exists on the package component.

### REQ-003 Indicator

The package must expose a `WizardStepIndicator` that visually maps `state`
to a distinct treatment: `upcoming` (outline), `current` (filled or soft
per `tone`), `completed` (filled + checkmark icon), `error` (destructive
fill + X icon).

**Acceptance:**

- [x] `data-slot="wizard-step-indicator"` and `data-state` are present.
- [x] `completed` renders a checkmark icon regardless of `children`.
- [x] `error` renders an X icon regardless of `children`.
- [x] `upcoming` / `current` render the supplied `children` (typically the
      step number) when `variant="number"`; indicator renders no text
      content when the root `variant="dot"`.
- [x] `error` uses `token.destructive` / `token.destructiveForeground`;
      every other state reuses `token.primary`, `token.border`,
      `token.background`, `token.mutedForeground` — the same tokens
      `TimelineStepIndicator` uses for equivalent states.

### REQ-004 Connector

The package must expose a `WizardStepConnector` reflecting `state`
(`upcoming` default, `current`, `completed`, `error`) with horizontal or
vertical geometry matching the parent `WizardStep`'s `orientation`.

**Acceptance:**

- [x] `data-slot="wizard-step-connector"`, `data-state`, `data-orientation`
      are present; `aria-hidden="true"` is set (decorative).
- [x] `completed` renders a solid `token.primary` line;
      `current` renders the same primary→border gradient formula as
      `TimelineStepConnector`'s `currentConnector`; `upcoming` renders
      `token.border`; `error` renders `token.destructive`.
- [x] Vertical connector geometry uses normal-flow flex sizing (simplified
      from the original absolute-position formula during implementation
      — see decision note below) rather than `TimelineStepConnector`'s
      absolute-position formula, because `WizardStep`'s flex-row layout
      does not share `TimelineStep`'s block-stacked item geometry.

### REQ-005 Label, title, description, counter

The package must expose `WizardStepLabel` (layout wrapper),
`WizardStepTitle`, `WizardStepDescription`, and an optional
`WizardStepCounter` text slot.

**Acceptance:**

- [x] Every element exposes a documented `data-slot`.
- [x] No default copy exists; all text is caller-supplied.
- [x] Long copy and Thai copy wrap inside the label without document
      overflow.

### REQ-006 Package contract

`WizardStep` and its parts must be available from the package root and a
stable direct subpath, per `ADHD.md`'s Private Package gate.

**Acceptance:**

- [x] `app/index.ts` contains
      `export * from "./component/brand/stylex/wizard-step"`.
- [x] `package.json` `exports["./wizard-step"]` resolves to
      `dist/component/brand/stylex/wizard-step.{js,d.ts}`.
- [x] Clean Vite client and SSR fixtures resolve both the root and direct
      entry.
- [x] `internal/catalog/example/wizard-step/default.tsx` exists, imports
      from `"@bridge/ui"`, and exports `default function Example`
      (satisfies `test/internal/catalog.test.ts`).

## API

```tsx
type WizardStepOrientation = "horizontal" | "vertical"
type WizardStepVariant = "number" | "dot" | "line"
type WizardStepTone = "hard" | "soft"
type WizardStepState = "upcoming" | "current" | "completed" | "error"
```

## Examples

### Horizontal checkout wizard

**Input:**

```tsx
<WizardStep aria-label="Checkout">
  <WizardStepItem state="completed" render={<button type="button" />}>
    <WizardStepIndicator state="completed" />
    <WizardStepLabel>
      <WizardStepTitle>Account</WizardStepTitle>
    </WizardStepLabel>
  </WizardStepItem>
  <WizardStepConnector state="completed" />
  <WizardStepItem state="current">
    <WizardStepIndicator state="current">2</WizardStepIndicator>
    <WizardStepLabel>
      <WizardStepTitle>Payment</WizardStepTitle>
    </WizardStepLabel>
  </WizardStepItem>
</WizardStep>
```

**Output:** `WizardStepIndicator[data-state="completed"]` renders a
checkmark and its `WizardStepItem` is a `<button>`; the `current` indicator
renders `"2"` inside a filled circle and its `WizardStepItem` remains a
`<div>`.

## Non-Goal

- Active-step index ownership, step validation logic, route/navigation
  wiring, translated copy, or step-count business rules — all remain in
  the consuming application container.
- Editorial/oversized-number variant (Arcade reference in Mobbin research)
  — out of scope for this primitive.
- Changes to `TimelineStep` or its existing `TimelineStepState` vocabulary.
