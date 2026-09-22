# Spec: Page Layout Variant

**Spec ID:** `page-layout-variant`
**Proposal:** `page-layout-variant`
**Status:** accepted

## Summary

This contract defines the opt-in constrained layout for `Page` while retaining full-width composition as its default.

## Requirements

### REQ-001: Full-width default

`Page` without `variant` MUST not apply a maximum width or automatic inline margins.

**Acceptance:**

- [ ] The default rendered `Page` has `data-variant="default"`.
- [ ] The root layout has no max-width or automatic inline margin declaration.

### REQ-002: Explicit constrained layout

`Page variant="container"` MUST apply the existing 1480px maximum width and automatic inline margins.

**Acceptance:**

- [ ] The rendered `Page` has `data-variant="container"`.
- [ ] The container layout is applied only for that variant.

## Schema / API

```ts
const pageVariant = {
  default: "default",
  container: "container"
} as const

type PageVariant = ValueOf<typeof pageVariant>

type PageProps = ComponentProps<"div"> & {
  variant?: PageVariant
}
```

## Examples

### Full-width page

```tsx
<Page>Content spans its parent width.</Page>
```

### Constrained page

```tsx
<Page variant="container">Content is capped at 1480px and centered.</Page>
```

## Non-Goals

- Configurable container widths.
- Automatic migration of consumers.
