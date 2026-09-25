# Decisions: Consumer Replacement Requirement

| ID      | Title                   | Status   |
| ------- | ----------------------- | -------- |
| DEC-001 | Package boundary        | accepted |
| DEC-002 | Raw drop escape hatch   | accepted |
| DEC-003 | PDF failure signal      | accepted |
| DEC-004 | Scope of audit          | accepted |
| DEC-005 | Preview and layout      | accepted |
| DEC-006 | Thumbnail grid track    | accepted |
| DEC-007 | Pilot fixture unchanged | accepted |

---

### DEC-001: Package boundary

**GIVEN** the audit includes shared UI and domain adapters
**WHEN** replacing local presentation
**THEN** package owns reusable accessible UI only; bridge-web retains translation, fetch/blob lifecycle, CDN transforms, file mapping, navigation, and permissions.

### DEC-002: Raw drop escape hatch

**GIVEN** `DropArea` already exposes react-dropzone's `onDrop` and `UploadList` owns controlled validation
**WHEN** migrating CMS or media surfaces
**THEN** document raw surface composition separately from controlled list composition; do not add another `onDrop` or nest file inputs.

### DEC-003: PDF failure signal

**GIVEN** iframe PDF load/error events do not reliably indicate document render success
**WHEN** displaying a failed PDF
**THEN** accept explicit caller error status and show fallback on that status, without claiming automatic PDF failure detection.

### DEC-004: Scope of audit

**GIVEN** the audit is dated 2026-09-25
**WHEN** implementing or migrating
**THEN** implement the four package blockers only, using the audit as motivation; consumer migration and live importer inventory are outside this proposal.

### DEC-005: Preview and layout

**GIVEN** list/grid controls arrangement while consumers need no preview, row, or thumbnail media
**WHEN** rendering default attachment items
**THEN** an explicit preview prop controls presentation independently of layout; omitted preview preserves existing row/list and tile/grid behavior.

### DEC-006: Thumbnail uses the grid track

**GIVEN** WebView capture showed `preview="thumbnail"` in list layout rendering one full-width square tile per row
**WHEN** the default items render as tiles
**THEN** the list uses the grid track whenever `layout="grid"` or `preview="thumbnail"`; a browser regression asserts the tile is narrower than half the row. Supersedes the independence clause of DEC-005 for thumbnail only.

### DEC-007: Pilot fixture unchanged

**GIVEN** `internal/pilot/*` is a private, unpublished comparison fixture mirroring the owned runtime
**WHEN** adding the new public props
**THEN** change only `app/component/brand/stylex/*`; the pilot is not a package contract and is left as-is.
