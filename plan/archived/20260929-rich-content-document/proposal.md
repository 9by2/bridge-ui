# Rich Content Document

**Proposal:** `rich-content-document`
**Status:** done

## Problem

1. `VideoPlayer` play icon uses `token.primary` with a hard-coded white glyph; in dark theme primary is white, so the icon is invisible. RichContent `video` inherits it.
2. bridge-web keeps a local Tiptap renderer (`app/lib/tiptap-render.tsx`, `renderTiptapNodeToHtml`) for its page-framed document preview and PDF HTML. `RichContent` is themed (Typography tokens), so it cannot match black-on-white print output.

## Scope

### In scope

- Play icon uses the `primary`/`primaryForeground` token pair with a contrasting ring; dark/light, bright/dark poster catalog cases and browser contrast test.
- `DocumentContent`: theme-independent, caller font size / line height / font family, print page breaks, break-avoid tables and images, fixed tables with column widths, PDF image frame alignment and width; pure (no hooks), `renderToStaticMarkup`-safe.
- `DocumentPage`: page frame with A4/Letter presets, margins, zoom, header/footer slots.
- `splitDocumentPages` helper for per-page PDF output.
- Catalog (A4, Letter, zoom, print), component and print-media browser tests, docs, patch changeset.

### Out of scope

- Tiptap -> node mapping, `@page` size and PDF service (app-owned).
- bridge-web migration.

## Success Criteria

- [x] Play glyph/circle contrast >= 4.5:1 and circle visible on white and black posters in light and dark.
- [x] Document output contains no `--bridge` tokens and stays black on white in dark theme.
- [x] Printing a page break produces a new PDF page.
- [x] All gates pass.
