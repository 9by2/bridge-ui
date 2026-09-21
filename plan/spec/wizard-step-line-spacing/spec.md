# Spec: Wizard Step Line Spacing

**Spec ID:** `wizard-step-line-spacing`
**Proposal:** `wizard-step-line-spacing`
**Status:** accepted

## Summary

The horizontal WizardStep line variant renders slim, visibly separated progress segments.

## Requirements

### REQ-001: Segment geometry

Each horizontal line indicator is 6px high, while adjacent line items are separated by 8px.

**Acceptance:**

- [x] Bun.WebView measures a 6px indicator height.
- [x] Bun.WebView measures an 8px horizontal gap between adjacent indicators.

## Non-Goals

- Altering non-line WizardStep variants.
