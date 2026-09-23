# Spec: Cue Input Radius

**Spec ID:** `cue-input-radius`
**Proposal:** `cue-input-radius`
**Status:** accepted

## Summary

The owned Input follows Cue's `rounded-lg` geometry in Cue mode while preserving the documented global control-radius customization seam.

## Requirements

### REQ-001: Cue geometry

An Input inside a Cue Theme defaults to an 8px radius; other theme defaults remain unchanged.

**Acceptance:**

- [x] Browser-computed Cue Input radius is 8px.

### REQ-002: Override

An explicit `theme.radius.control` takes precedence over the Cue default.

**Acceptance:**

- [x] Browser-computed Input radius matches an explicit control radius.

## Schema / API

```tsx
<Theme mode="cue" theme={{ radius: { control: "3px" } }}>
  <Input aria-label="Search" />
</Theme>
```

## Non-Goals

- New Input props or generated-source changes.
