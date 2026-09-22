# Spec: StyleX Preview

**Spec ID:** `stylex-preview`
**Proposal:** `stylex-only-example`
**Status:** accepted

## Summary

The component catalog has one example implementation: public Bridge UI StyleX components. Route pathname does not select an alternate implementation.

## Requirements

### REQ-001 Single implementation

Every example route loads the public StyleX package implementation.

**Acceptance:**

- [ ] Root and `/style-x` compatibility URLs render the same StyleX component.
- [ ] No implementation switch or normal/candidate status is displayed.

### REQ-002 Preview continuity

Theme, locale, reduced motion, mobile frame, lazy preview disposal, and source disclosure remain available.

**Acceptance:**

- [ ] Embedded preview URLs render the StyleX implementation.

## Non-Goals

- Removing compatibility URLs from historical verification commands.
