# Design: Metric tile

The package owns a theme-aware, noninteractive article. Consumers compose it into grids and pass already formatted values. The required `variant` selects density and visual emphasis, not business meaning.

| Component  | Responsibility           | Location                                     |
| ---------- | ------------------------ | -------------------------------------------- |
| MetricTile | Display a labeled metric | `app/component/brand/stylex/metric-tile.tsx` |

```tsx
<MetricTile variants="featured" label="Revenue" value="฿204,215" description="Successful orders" />
<MetricTile variants="standard" label="Orders" value="753" />
<MetricTile variants="compact" label="Staff" value="7" />
```

Risk: hardcoded dark colors break Theme. Use existing theme tokens and demonstrate a dark Theme in the catalog.
