# Spec: Tabs Variant

**Spec ID:** `tabs-variant`
**Proposal:** `tabs-border-bottom`
**Status:** accepted

## Summary

Tabs list supports filled, active-line, and full border-bottom presentation without changing primitive behavior.

## Requirements

### REQ-001: Public option

`TabsList` and `tabsListVariants` must accept `"border-bottom"`.

**Acceptance:**

- [x] Type and runtime helper accept the option.

### REQ-002: Presentation

The option must draw a full-width neutral list bottom rule and only a primary-color active-trigger underline.

**Acceptance:**

- [x] Catalog computed style verifies list and active trigger border.

## Schema / API

```ts
type TabsListVariant = "default" | "line" | "border-bottom" | null
```

## Examples

### Navigation tabs

**Input:** `variant="border-bottom"`

**Output:** full-width tab list rule with active underline.

## Non-Goals

- Primitive selection behavior changes.
