# Design

The catalog continues to compile generated Shadcn reference examples with
Tailwind through Vite. Package build uses only the StyleX compiler and the
published component CSS entry.

```text
catalog: Vite + Tailwind + StyleX -> catalog-dist
package: Bun + StyleX -> dist/style.css
```

The emitted `dist/style.css` and isolated installed tarball are the acceptance
seams. Documentation names verified behavior instead of hand-maintained module
or entry totals.
