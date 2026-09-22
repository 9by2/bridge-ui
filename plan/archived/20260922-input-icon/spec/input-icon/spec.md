# Spec: Input Icon

**Spec ID:** `input-icon`
**Proposal:** `input-icon`
**Status:** accepted

## Summary

This spec defines the optional decorative leading icon supported by the owned Input component.

## Requirements

### REQ-001: Leading decorative icon

Input accepts an optional `icon` ReactNode.

**Acceptance:**

- [x] When supplied, icon renders before the input visually and is hidden from the accessibility tree.
- [x] The input remains labelable, focusable, ref-compatible, and form-compatible.

### REQ-002: Composition boundary

Interactive or trailing adornments use InputGroup.

**Acceptance:**

- [x] CUSTOMIZATION.md includes an InputGroup example for interactive adornments.

## Schema / API

```ts
type InputProps = ComponentProps<"input"> & {
  icon?: ReactNode
}
```

## Examples

### Decorative search icon

```tsx
<Input icon={<SearchIcon />} aria-label="Search" placeholder="Search" />
```

## Non-Goals

- Interactive icon buttons through the Input API.
- A trailing icon prop.
