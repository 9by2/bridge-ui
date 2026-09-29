# Decisions: Rich Content Document

### DEC-001: Token pair plus ring for the play icon

**GIVEN** posters can be any brightness and `primary` flips between themes
**WHEN** drawing the play affordance
**THEN** fill `primary`, glyph `primaryForeground`, and a 2px `primaryForeground` ring so either the fill or the ring contrasts with any poster.

### DEC-002: Separate DocumentContent instead of a RichContent variant

**GIVEN** RichContent composes themed Typography (DEC-008 of rich-content-parity)
**WHEN** rendering print documents that must be black on white and match PDF output
**THEN** add `DocumentContent` sharing the RichContent node contract and sanitizers, rendering plain semantic elements with a document stylesheet.

### DEC-003: Self-contained stylesheet, pure component

**GIVEN** the PDF HTML is a standalone document rendered on the server and needs print media rules and list counters
**WHEN** styling DocumentContent / DocumentPage
**THEN** emit one package-owned `<style href precedence>` (React 19 dedupes and hoists it) scoped under `.bridge-document`, with low-specificity `:where()` selectors so app CSS can override; no hooks, so `renderToStaticMarkup` yields the same markup as the preview.

### DEC-004: Sizes scale from the caller base font

**GIVEN** bridge-web's print CSS used fixed px at a 12px base
**WHEN** porting sizes
**THEN** express them in `em` of the caller `fontSize` (12px reproduces today's output) so other base sizes scale consistently.

### DEC-005: Video is omitted from documents

**GIVEN** print output cannot play embeds
**WHEN** a `video` node appears in DocumentContent
**THEN** drop it; the app may map it to an image/link node instead.
