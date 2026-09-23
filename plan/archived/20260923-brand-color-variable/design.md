# Design: Brand Color Variable

Brand recipes reference a public CSS custom property before falling back to the existing StyleX token. StyleX themes continue to own mode defaults; a host can set the public name on a Theme root or descendant.

```ts
const brandColor = `var(--bridge-color-brand, ${token.brand})`
```

No generated Shadcn source or consumer code changes. Test the published CSS as the public seam and verify rendering in Bun.WebView.
