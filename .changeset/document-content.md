---
"@bridge/ui": patch
---

Add `DocumentContent`, `DocumentPage`, `DocumentPageSize`, `splitDocumentPages` and `documentStyleSheet` (`@bridge/ui/document-content`): a theme-independent print presentation of `RichContent` nodes with caller font size and line height, real print page breaks, break-avoiding tables and images, fixed-layout tables with column widths, PDF-matching image alignment, and A4/Letter/Legal page frames with zoom. Hook-free and `renderToStaticMarkup`-safe so the preview and PDF HTML share one renderer.
