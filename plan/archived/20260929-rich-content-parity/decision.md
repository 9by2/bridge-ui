# Decisions: Rich Content Parity

| ID      | Title                                                   | Status   |
| ------- | ------------------------------------------------------- | -------- |
| DEC-001 | Additive, backward-compatible node shapes               | accepted |
| DEC-002 | Inline vs block children use separate fields            | accepted |
| DEC-003 | Copy labels and accessible names enter through `labels` | accepted |
| DEC-004 | Image slot receives sanitized data only                 | accepted |
| DEC-005 | Video reuses VideoPlayer                                | accepted |
| DEC-006 | `break` stays a rule alias                              | accepted |

---

### DEC-001: Additive, backward-compatible node shapes

**GIVEN** 0.14.0 consumers may already pass `list.items` as text-run arrays and `break` nodes
**WHEN** extending the contract in a patch release
**THEN** only add union members and optional fields; legacy shapes render as before.

### DEC-002: Inline vs block children use separate fields

**GIVEN** quote, list item and table cell may hold either inline text or nested blocks
**WHEN** typing their content
**THEN** `children` holds inline runs and `blocks` holds block nodes; both may be present (inline first). No shape sniffing.

### DEC-003: Copy labels and accessible names enter through `labels`

**GIVEN** the package owns no product i18n
**WHEN** rendering copy buttons, code header, table region, page break and video play button
**THEN** `RichContent labels` supplies strings with English defaults.

### DEC-004: Image slot receives sanitized data only

**GIVEN** consumers apply CDN transforms
**WHEN** `renderImage` is provided
**THEN** it receives already-validated `src`, `sourceSet`, `blurDataUrl`; unsafe images never reach the slot. The package still owns the alignment frame.

### DEC-005: Video reuses VideoPlayer

**GIVEN** VideoPlayer already enforces HTTPS YouTube(-nocookie) `/embed/<id>` and deferred sandboxed iframe
**WHEN** rendering a `video` node
**THEN** delegate to VideoPlayer with a YouTubeThumbnail poster; invalid URLs render nothing.

### DEC-006: `break` stays a rule alias

**GIVEN** 0.14.0 `break` renders `<hr>`
**WHEN** adding `horizontalRule` and inline `lineBreak`
**THEN** keep `break` rendering a rule (deprecated alias); line breaks use inline `lineBreak`.

### DEC-007: Longhand borders

**GIVEN** browser verification showed StyleX border shorthands with `var()` colors computing to 0 width (table, rule, page break, and the 0.14.0 quote border)
**WHEN** declaring borders
**THEN** use longhand width/style/color properties.

### DEC-008: Compose Typography

**GIVEN** the package already owns prose primitives in `typography.tsx`
**WHEN** rendering headings, paragraphs, quotes, lists, inline code, rules and the copy button
**THEN** compose `Heading`, `Body`, `Blockquote`, `List`, `InlineCode`, `Separator` and `Button`; RichContent adds only layout (spacing, alignment) and CMS-only structures (code block, table, figure). `compact` becomes tighter block spacing because Typography owns size and line height.
