# Spec: Tabs Variant

**Spec ID:** `tabs-variant`
**Proposal:** `tabs-line-cleanup`
**Status:** accepted

## Summary

Tabs exposes `default` and `line` list presentation without changing primitive behavior.

## Requirement

- `TabsList` accepts `"default"`, `"line"`, or `null`.
- Default trigger has no border.
- Line list has a neutral full-width baseline.
- Active line trigger has only a primary bottom border and primary text.
- Direct trigger icon is 16px independent of label text size.

## API

```ts
type TabsListVariant = "default" | "line" | null
```
