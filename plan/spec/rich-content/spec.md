# Rich Content Contract

**Status:** accepted (supersedes the RichContent part of `content-video-media`)

`RichContent({ content?, emptyFallback?, variant?: "default" | "compact", className?, labels?: Partial<RichContentLabels>, renderImage?, copyText? })`.

Nodes: `paragraph` / `heading` (1-6) with inline `children` and optional `align` (left/center/right/justify); `quote` with inline `children` and/or `blocks`; `list` (`ordered`, `start?`, items as legacy inline arrays or `{ children?, blocks? }`); `codeBlock` (`code`, `language?`, `copyable?` default true); `table` (`rows[].cells[]` with `header?`, `colSpan?`, `rowSpan?`, `children?`, `blocks?`; `columnWidths?` percent); `image` (`src`, `alt`, `width?`, `height?`, `align?`, `displayWidth?`, `sourceSet?`, `sizes?`, `blurDataUrl?`); `video` (`embedUrl`, `title`, `poster?`); `horizontalRule`; `pageBreak`; `break` (deprecated rule alias).

Inline: `text` (`bold`, `italic`, `strike`, `underline`, `code`, `copyable`, `href`, `external`; combinable) and `lineBreak`.

Rules:

- No HTML rendering. Unknown/malformed nodes dropped; >24 nesting levels dropped; empty result renders `emptyFallback`.
- Links: http(s), mailto, root-relative (`//` rejected). `external` → `target="_blank" rel="noopener noreferrer"`.
- Images and sourceSet: http(s), root-relative. `displayWidth` accepts positive number (px) or `<n>(px|%|rem|em|vw|cm|mm|in|pt|pc)`. Blur: base64 image data URL or safe URL without quote/paren/space.
- `renderImage` receives only sanitized data; package keeps the aligned figure.
- Video: HTTPS youtube(-nocookie).com `/embed/<id>` only, non-empty title, rendered by `VideoPlayer` with an optional `VideoThumbnail` poster from app-built `poster` URLs (unsafe candidates dropped) and `"{playVideo}: {title}"` label.
- Copy: success shows `copiedCode` (button label + polite status) for 1.5s; failure never confirms. Inline copy omitted inside links.
- Table: labelled focusable scroll region; spans only integers > 1; header cell `scope="row"` when row has data cells, else `col`.
- Page break: `role="separator"` with `labels.pageBreak`, print `break-before: page`.
- Tiptap mapping stays in the application.
