# Spec: Cue Input Radius

**Spec ID:** `cue-input-radius`
**Proposal:** `cue-input-css-radius`
**Status:** accepted

## Summary

The published CSS owns the default Input control radius for each mode, and Theme emits inline control radius only for explicit overrides.

## Requirements

### REQ-001: Published defaults

`@bridge/ui/style.css` supplies the base control radius and Cue's `0.5em` value. Input consumes the CSS variable without Theme writing a default inline value.

**Acceptance:**

- [x] Default Cue Input computes half its responsive font size with no inline control-radius override.
- [x] Other modes retain their base CSS radius.

### REQ-002: Theme overrides

An explicit `theme.radius.control` overrides the stylesheet and remains inherited through nested Themes.

**Acceptance:**

- [x] Browser-computed radius follows an explicit override.

## Schema / API

```tsx
<Theme mode="cue" theme={{ radius: { control: "0.25em" } }}>
  <Input aria-label="Search" />
</Theme>
```

## Non-Goals

- New Input props or generated-source changes.
