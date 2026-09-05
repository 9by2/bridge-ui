# Chart Catalog Design

Independent exact-source modules demonstrate Cartesian, polar, hierarchy and flow chart families. A visible option reference explains the Bridge chart wrapper API and links the larger Recharts API. Dark is the default unless theme=light is explicit. Keep light-mode accessibility verification explicit rather than silently replacing it.

```tsx
<ChartContainer config={config}>
  <LineChart data={data} />
</ChartContainer>
```
