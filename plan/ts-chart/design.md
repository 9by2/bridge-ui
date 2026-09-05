# TsChart Design

Load preview iframe lazily to avoid mounting every chart runtime at once. Verify chart geometry inside the real catalog page, not only standalone preview. TsChart is a thin generic React adapter with default height and package-owned host styling. Pin the current published alpha and document the stability limitation.

```tsx
<TsChart definition={definition} ariaLabel="Monthly volume" />
```
