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

- [ ] Matrix covers `variant`, `size`, `orientation`, `side`, `align`, `state`, and `collapsible` where explicitly supported.
- [ ] Every finite value appears at least once.
- [ ] Cross-product permutations are not required.

### REQ-002: Discoverable stories

Every affected module must expose variant coverage in its own Storybook entry.

**Acceptance:**

- [ ] Every matrix module exports a named `Variants` story.
- [ ] Every `Variants` story renders real package components.
- [ ] Galleries label each axis value visibly.

### REQ-003: Semantic states

Common semantic states must be reviewable when supported.

**Acceptance:**

- [ ] Disabled and invalid controls are visible.
- [ ] Checked or selected controls are visible.
- [ ] Open overlays are visible through stories or interactions.
- [ ] Loading and destructive states are visible where supported.

### REQ-004: Enforcement

Variant completeness must be machine checked.

**Acceptance:**

- [ ] Test fails when a matrix module lacks `Variants`.
- [ ] Test fails when a matrix module lacks an explicit fixture case.
- [ ] Static Storybook build passes.
- [ ] All default and variant stories pass Chromium and accessibility execution.

## Non-Goals

- Every combination of multiple variant axes.
- Arbitrary continuous values.
- Generated source edits.
- StyleX implementation.
