# Spec: Storybook Contract

**Spec ID:** `storybook-contract`
**Proposal:** `storybook-variant-coverage`
**Status:** accepted

## Summary

This amendment requires Storybook to expose every explicit finite visual and state value in generated `@bridge/ui` APIs, in addition to complete module and interaction coverage.

## Requirements

### REQ-001: Variant matrix

A canonical matrix must record every explicit finite generated axis.

**Acceptance:**

- [x] Matrix covers `variant`, `size`, `orientation`, `side`, `align`, `state`, and `collapsible` where explicitly supported.
- [x] Every finite value appears at least once across 27 module galleries.
- [x] Cross-product permutations are not required.

### REQ-002: Discoverable stories

Every affected module must expose variant coverage in its own Storybook entry.

**Acceptance:**

- [x] Every matrix module exports a named `Variants` story.
- [x] Every `Variants` story renders real package components.
- [x] Galleries label each axis value visibly.

### REQ-003: Semantic states

Common semantic states must be reviewable when supported.

**Acceptance:**

- [x] Disabled and invalid controls are visible.
- [x] Checked or selected controls are visible.
- [x] Open overlays are visible through stories or interactions.
- [x] Loading and destructive states are visible where supported.

### REQ-004: Enforcement

Variant completeness must be machine checked.

**Acceptance:**

- [x] Test fails when a matrix module lacks `Variants`.
- [x] Test fails when a matrix module lacks an explicit fixture case.
- [x] Static Storybook build passes.
- [x] All 90 default and variant stories pass Chromium and accessibility execution.

## Non-Goals

- Every combination of multiple variant axes.
- Arbitrary continuous values.
- Generated source edits.
- StyleX implementation.
