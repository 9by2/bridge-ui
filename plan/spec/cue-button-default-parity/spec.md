# Spec: Cue Button Default Parity

**Spec ID:** `cue-button-default-parity`
**Proposal:** `cue-button-default-parity`
**Status:** accepted

## Summary

The public StyleX Button's default treatment mirrors Cue while remaining an independent `@bridge/ui` implementation.

## Requirements

### REQ-001: Cue default recipe

An unqualified Button in Cue mode uses the Cue semantic primary fill and foreground, a 10px radius, 32px height, 14px medium type, and one-pixel active press.

**Acceptance:**

- [ ] Rendered browser coverage verifies the default Button in Cue mode.
- [ ] The implementation has no Cue runtime import.

## Schema / API

```tsx
<Button>Continue</Button>
```

## Non-Goals

- Changes to Button API or non-default variants.
