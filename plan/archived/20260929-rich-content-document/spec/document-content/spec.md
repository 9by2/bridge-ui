# Document Content Contract

**Status:** accepted

`DocumentContent({ content?, emptyFallback?, fontSize? = 12, lineHeight? = 1.3, fontFamily?, monoFontFamily?, labels?: { pageBreak }, renderImage?, className? })`: renders the `RichContentNode` contract (same sanitizers, depth limit 24, malformed nodes dropped) as plain semantic HTML under `.bridge-document`. Theme-independent: black on white, `color-scheme: light`, no `--bridge` tokens. Sizes are the legacy CMS 12px print values scaled by `fontSize`. Hook-free; `renderToStaticMarkup` output equals client DOM. `video` nodes and copy actions are omitted. Images are eager, in `figure[data-slot=document-image][data-align]`, width from `displayWidth`. Tables: `table-layout: fixed`, `<col>` percentages from `columnWidths`, 1px black cell borders, header `scope` as RichContent.

Print: `pageBreak` = `hr[data-slot=document-page-break][aria-label]` with `break-after: page`; tables, rows, images, quotes, code use `break-inside: avoid`; headings `break-after: avoid`.

`DocumentPage({ size? = A4 | Letter | Legal | {width,height}, margin? (48px default), contentMargin?, zoom? = 1, header?, footer?, headerHeight?, footerHeight?, ...article })`: frame reserves `size * zoom`; page is `article[data-slot=document-page]` at unscaled size with CSS `zoom`. Print: zoom 1, no shadow or frame margin, consecutive frames break before.

`splitDocumentPages(nodes)`: top-level split at `pageBreak`, empty pages kept. `documentStyleSheet`: exported scoped CSS for standalone HTML.

Acceptance: theme independence in dark theme, PDF page count equals page-break count + 1, server/client markup parity, axe clean page archetype.
