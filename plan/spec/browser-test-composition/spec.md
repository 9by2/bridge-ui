# Spec: Browser Test Composition

**Spec ID:** `browser-test-composition`
**Proposal:** `browser-test-composition`
**Status:** accepted

## Requirements

### REQ-001: Exhaustive static catalog coverage

Every catalog example SHALL be discovered by static inventory checks and compiled by `bun catalog:build`.

### REQ-002: Public behavior ownership

Owned component state, callbacks, validation, cleanup and accessibility state SHALL be verified at component/public API seams whenever a browser is not required.

### REQ-003: Compact browser contracts

`bun catalog:test` SHALL run a fixed compact browser suite covering catalog shell, render pipeline, semantic accessibility archetypes, focus/keyboard, responsive composition and existing browser regressions. New visual-only examples SHALL NOT automatically create a browser test.

### REQ-004: Explicit diagnostics

Visual and memory browser probes SHALL be independently runnable and SHALL NOT be included by `bun catalog:test`.

### REQ-005: Assertion relevance

Browser assertions SHALL protect a browser-only public behavior, a unique semantic composition, a documented exact visual contract, or a focused defect regression. CSS implementation measurements without one of those justifications SHALL NOT remain.

## Acceptance

- [x] All examples are statically inventoried and compile in the catalog build.
- [x] Pre-push runs compact browser contracts only.
- [x] Visual and memory commands select only their diagnostics.
- [x] Accessibility cases cover form, modal, menu, selector, data, upload, responsive shell, theme and owned-composite archetypes.
