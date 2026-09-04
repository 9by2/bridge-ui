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

- [ ] Every `app/component/shadcn/<name>.tsx` has `storybook/shadcn/<name>.stories.tsx`.
- [ ] Inventory verification fails for missing or extra story basenames.
- [ ] Story source imports public components from `@bridge/ui`.

### REQ-002: Catalog fixtures

The catalog must support company UI review contexts.

**Acceptance:**

- [ ] Light and dark themes are selectable.
- [ ] English and Thai copy fixtures are selectable without runtime product i18n.
- [ ] Normal and reduced motion are selectable.
- [ ] Mobile viewport is selectable.
- [ ] Public component stories enable autodocs.

### REQ-003: Interaction coverage

Core interactive primitive families must have executable browser behavior.

**Acceptance:**

- [ ] Button/input interaction executes.
- [ ] Checkbox/select interaction executes.
- [ ] Dialog/popover interaction executes.
- [ ] Tabs/accordion interaction executes.
- [ ] Tooltip/toast interaction executes.

### REQ-004: Accessibility

Storybook must run accessibility checks.

**Acceptance:**

- [ ] Accessibility addon is configured.
- [ ] Browser story tests include addon annotations.
- [ ] No blocking accessibility failure exists in required interaction stories.

### REQ-005: Executable output

Storybook must compile and run independently.

**Acceptance:**

- [ ] Development server starts.
- [ ] Static build completes.
- [ ] All stories execute in headless Chromium.
- [ ] Storybook imports the public package root and canonical CSS.

## Non-Goals

- StyleX compilation.
- Hosted visual regression.
- GitLab publication.
- Product-specific stories or containers.
