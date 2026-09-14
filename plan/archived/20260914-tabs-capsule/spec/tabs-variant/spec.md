# Spec: Tabs Variant

**Spec ID:** `tabs-variant`
**Proposal:** `tabs-capsule`
**Status:** accepted

## Summary

Tabs exposes `default`, `line`, and `capsule` list presentation without changing primitive behavior.

## Requirement

- `TabsList` accepts `"default"`, `"line"`, `"capsule"`, or `null`.
- Default trigger has no border.
- Line list has a neutral full-width baseline and primary active underline.
- Capsule list is transparent and content-width.
- Capsule trigger is borderless and fully rounded with balanced padding.
- Only the active capsule trigger has a background.
- Direct trigger icon is 16px independent of label text size.

## API

```ts
type TabsListVariant = "default" | "line" | "capsule" | null
```
