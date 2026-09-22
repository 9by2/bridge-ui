# Spec: Customization Reference

**Spec ID:** `customization-reference`
**Proposal:** `customization-reference`
**Status:** accepted

## Summary

Defines `CUSTOMIZATION.md` as a concise public customization reference. It must cover every package component family while reserving detailed API and state examples for the catalog.

## Requirements

### REQ-001: Complete family coverage

The guide identifies all public component families in meaningful functional groups.

**Acceptance:**

- [x] Every public family is listed once.
- [x] Compound APIs are represented at the family level.

### REQ-002: Useful customization guidance

Each group identifies supported semantic variants, controlled props, composition children, or structural options where those affect integration.

**Acceptance:**

- [x] No private CSS classes or implementation selectors are described as public APIs.
- [x] Native routine props are not duplicated.

## Non-Goals

- Exhaustive generated component API reference.
- Component implementation changes.
