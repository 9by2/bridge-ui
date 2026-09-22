# Spec: Breadcrumb Custom Separator

**Spec ID:** `breadcrumb-custom-separator`
**Proposal:** `breadcrumb-custom-separator`
**Status:** accepted

## Summary

Breadcrumb consumers can replace the default ChevronRight separator by passing React content as `BreadcrumbSeparator` children.

## Requirements

### REQ-001: Caller separator content

`BreadcrumbSeparator` renders supplied children as the separator.

**Acceptance:**

- [x] A slash child renders as the separator.
- [x] The separator retains presentational accessibility semantics.

### REQ-002: Default fallback

When children are omitted, `BreadcrumbSeparator` renders its ChevronRight icon.

**Acceptance:**

- [x] Existing default usage remains supported.

## Schema / API

```tsx
<BreadcrumbSeparator>/</BreadcrumbSeparator>
```

## Non-Goals

- Automatic separator placement by `Breadcrumb`.
- A new `separator` prop.
