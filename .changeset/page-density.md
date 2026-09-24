---
"@bridge/ui": minor
---

Add `Page` density, width, header slot and form action, and `DataState` retry.

- `Page` `density` (`PageDensity`: `compact`, `default`, `comfortable`, `none`) is the canonical padding prop. `data-density` is added.
- **Deprecated:** `Page` `spacing`. It stays a working alias with the same values; `density` wins when both are set, and `data-spacing` keeps emitting. Migrate `spacing="x"` → `density="x"`. Removal is planned for the next major.
- `Page` `width` (`PageWidth`: `full`, `content` 80rem, `form` 48rem, `editor` edge-to-edge) controls max-width only.
- New `PageEyebrow`, `PageMeta`, `PageFilter` header slots and `PageFormAction` (`align`, `sticky`).
- `DataState` `onRetry` + `retryLabel` render a standard retry button.
