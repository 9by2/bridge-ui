# Design

Add `layout` to DropArea with stacked default, inline and compact treatment. Media, avatar, document and file list compose the same primitive. Preview URL cleanup and selected file state belong to private catalog fixture. Remove and retry action remain outside the clickable drop target.

```tsx
<DropArea layout="inline" label="Choose attachment">
  Attach file
</DropArea>
```
