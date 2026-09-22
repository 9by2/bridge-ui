# Spec: Cue Button Full Parity

**Spec ID:** `cue-button-full-parity`
**Proposal:** `cue-button-full-parity`
**Status:** accepted

## Summary

The public `@bridge/ui` Button has a locally implemented StyleX recipe that reproduces all Cue Button visual declarations without importing Cue runtime code.

## Requirements

### REQ-001: Full Cue recipe

Cue mode must resolve the root, default, outline, secondary, ghost, destructive, warning, CTA, link, and size styling defined by Cue's canonical Button source.

**Acceptance:**

- [x] Browser coverage verifies every variant family and expanded outline/secondary treatment.
- [x] The public source has no Cue runtime import.

## Schema / API

```tsx
<Button variant="cta" size="xl">
  Buy ticket
</Button>
```

## Non-Goals

- Replacing Base UI or importing product application code.
