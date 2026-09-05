# Inline Example Design

Map the existing component example inventory into a vertical section list. Each section has a title, descriptive copy, isolated preview and its own exact-source disclosure. Retain global viewport, theme, language and motion control. Remove comparison and selection chrome because each example is already present.

```tsx
choices.map((item) => <section key={item.path}>...</section>)
```
