# Tabs Capsule

**Proposal:** `tabs-capsule`
**Status:** done
**Phase:** [ADHD component catalog](../../ADHD.md#2-shadcn-component-catalog)

## Problem

Tabs needs a compact capsule option where inactive trigger remains plain text and only the active trigger receives a rounded fill.

## Scope

- Add `capsule` to the public list variant.
- Keep capsule trigger content-width and borderless.
- Add catalog, component, browser, and visual evidence coverage.

## Success Criteria

- [x] Inactive capsule trigger has transparent background.
- [x] Active capsule trigger has rounded background and balanced padding.
- [x] Existing default and line treatment remain unchanged.

## Spec

`spec/tabs-variant/spec.md` amends the canonical Tabs variant contract.
