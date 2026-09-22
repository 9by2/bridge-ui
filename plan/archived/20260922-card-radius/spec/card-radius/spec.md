# Spec: Card Radius

**Spec ID:** `card-radius`
**Proposal:** `card-radius`
**Status:** accepted

## Summary

Card exposes a surface-radius choice while retaining the current default visual treatment.

## Requirements

### REQ-001: Radius API

Card accepts an optional `radius` prop.

**Acceptance:**

- [x] Supported values are `none`, `sm`, `default`, and `lg`.
- [x] Omitted `radius` resolves to `default`.
- [x] The rendered Card has the resolved `data-radius` value.

### REQ-002: Matched compound corners

The root Card, CardHeader, and CardFooter use the selected surface geometry at their exposed edges.

**Acceptance:**

- [x] `none` produces zero-radius root, header, and footer edges.
- [x] `default` remains 14px.

## Schema / API

```ts
type CardRadius = "none" | "sm" | "default" | "lg"

type CardProps = ComponentProps<"div"> & {
  radius?: CardRadius
  size?: "default" | "sm"
}
```

## Examples

### Square Card

**Input:**

```tsx
<Card radius="none" />
```

**Output:**

```html
<div data-slot="card" data-radius="none"></div>
```

## Non-Goals

- Custom arbitrary radius values.
- Changing global shape tokens.
