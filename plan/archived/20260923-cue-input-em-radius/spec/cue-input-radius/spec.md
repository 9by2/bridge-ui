# Spec: Cue Input Radius

**Spec ID:** `cue-input-radius`
**Proposal:** `cue-input-em-radius`
**Status:** accepted

## Summary

The owned Input follows Cue's rounded control geometry with an `em` Theme default while preserving the documented global control-radius customization seam.

## Requirements

### REQ-001: Cue geometry

An Input inside Cue Theme defaults to `0.5em` (relative to Input's computed font size). Other theme defaults remain unchanged. Standalone Input has an `em` fallback.

**Acceptance:**

- [x] Browser-computed Cue Input radius is half its font size on mobile and desktop while the Theme value is `0.5em`.

### REQ-002: Override

An explicit `theme.radius.control` takes precedence over the Cue default.

**Acceptance:**

- [x] Browser-computed Input radius follows the explicit override.

## Schema / API

```tsx
<Theme mode="cue" theme={{ radius: { control: "0.25em" } }}>
  <Input aria-label="Search" />
</Theme>
```

## Non-Goals

- New Input props or generated-source changes.
