# Spec: Storybook Contract

**Spec ID:** `storybook-contract`
**Proposal:** `phase-3-testable-storybook`
**Status:** accepted

## Summary

This spec defines the complete, browser-testable Storybook catalog for generated `@bridge/ui` components.

## Requirements

### REQ-001: Complete inventory

Every generated component module must have Storybook coverage.

**Acceptance:**

- [x] Every `app/component/shadcn/<name>.tsx` has `storybook/shadcn/<name>.stories.tsx` and a real fixture composition.
- [x] Inventory verification fails for missing or extra story basenames and missing fixture cases.
- [x] Story source imports public components from `@bridge/ui`.

### REQ-002: Catalog fixtures

The catalog must support company UI review contexts.

**Acceptance:**

- [x] Light and dark themes are selectable.
- [x] English and Thai copy fixtures are selectable without runtime product i18n.
- [x] Normal and reduced motion are selectable.
- [x] Mobile viewport is selectable.
- [x] Public component stories enable autodocs.

### REQ-003: Interaction coverage

Core interactive primitive families must have executable browser behavior.

**Acceptance:**

- [x] Button/input interaction executes.
- [x] Checkbox/select interaction executes.
- [x] Dialog/popover interaction executes.
- [x] Tabs/accordion interaction executes.
- [x] Tooltip/toast interaction executes.

### REQ-004: Accessibility

Storybook must run accessibility checks.

**Acceptance:**

- [x] Accessibility addon is configured.
- [x] Browser story tests include addon annotations.
- [x] No blocking accessibility failure exists in any of the 63 stories.

### REQ-005: Executable output

Storybook must compile and run independently.

**Acceptance:**

- [x] Development server smoke test starts successfully.
- [x] Static build completes.
- [x] All 63 stories execute in headless Chromium.
- [x] Storybook imports the public package root and canonical CSS.

## Non-Goals

- StyleX compilation.
- Hosted visual regression.
- GitLab publication.
- Product-specific stories or containers.
