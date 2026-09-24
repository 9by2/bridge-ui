# Decisions: Consumer Gap Close

| ID      | Title                                                      | Status   |
| ------- | ---------------------------------------------------------- | -------- |
| DEC-001 | Page `spacing` → `density`, backward compatible            | accepted |
| DEC-002 | Upload never toasts; app decides                           | accepted |
| DEC-003 | Brand icons stay in the consumer                           | accepted |
| DEC-004 | Stacked branch per workstream group                        | accepted |
| DEC-005 | Page `width` owns max-width only; `density` owns padding   | accepted |
| DEC-006 | `onIssue` canonical; `onReject` deprecated but still fires | accepted |
| DEC-007 | Validation lives on `UploadList`                           | accepted |
| DEC-008 | Keep Base UI `toast` name; add `sonnerToast`               | accepted |

---

### DEC-001: Page `spacing` → `density`, backward compatible

**GIVEN** `Page` exposes `spacing` and consumers need a canonical density scale
**WHEN** a caller passes `density`, `spacing`, both or neither
**THEN** resolve `density ?? spacing ?? "default"`; `spacing` is `@deprecated`; `data-spacing` keeps emitting and `data-density` is added; removal waits for a future major.

### DEC-002: Upload never toasts; app decides

**GIVEN** upload errors need user feedback
**WHEN** validation or limit fails
**THEN** upload modules report through `onIssue` / `onReject` and optional inline `issueDisplay="inline"`; they never import a toast module. A static test enforces it.

### DEC-003: Brand icons stay in the consumer

**GIVEN** brand/social/logo glyphs are product-owned
**WHEN** a component renders an icon
**THEN** it accepts a consumer `ReactNode` slot sized through `currentColor`/`1em`-friendly CSS; the package ships no brand glyph export.

### DEC-004: Stacked branch per workstream group

**GIVEN** shared files (`app/index.ts`, `CUSTOMIZATION.md`, `package.json`) conflict across parallel MRs
**WHEN** work is split for review
**THEN** branches stack: `feat/sonner-spinner` → `feat/page-density` → `feat/upload-validation` → `feat/calendar-parity` → `chore/icon-slot-audit` → `feat/prose-and-misc`; each MR targets `main` after its parent merges.

### DEC-005: Page `width` owns max-width only; `density` owns padding

**GIVEN** consumer parity needs content (max-w-7xl) and form (max-w-3xl) widths with 16→24px inline padding
**WHEN** `width` and `density` are combined
**THEN** `width` sets max-width + centering only (`full` 100%, `content` 80rem, `form` 48rem, `editor` full and zero inline padding); padding comes from `density`. Consumer parity is `width="content" density="compact"`.

### DEC-006: `onIssue` canonical; `onReject` deprecated but still fires

**GIVEN** `UploadList.onReject(UploadRejection[])` already ships
**WHEN** any issue occurs (validator, count, byte, react-dropzone rejection)
**THEN** `onIssue(issues, event)` receives every issue; `onReject` keeps its old payload and timing, marked `@deprecated`.

### DEC-007: Validation lives on `UploadList`

**GIVEN** `DropArea` is a thin react-dropzone wrapper
**WHEN** composable validation is added
**THEN** `validate`, `issueDisplay`, `layout`, `renderEmpty`, `renderItem` belong to `UploadList`; `DropArea` stays unchanged.

### DEC-008: Keep Base UI `toast` name; add `sonnerToast`

**GIVEN** root `toast` is the Base UI toast manager and renaming it is breaking
**WHEN** Sonner imperative API is exported
**THEN** root exports `sonnerToast`; `./sonner` subpath exports `{ Toaster, toast }`; both `toast` exports carry JSDoc naming their paired `Toaster`.

### DEC-009: Explicit Spinner size opts out of container icon sizing

**GIVEN** container adapter CSS sizes descendant SVGs unless they match `[class*="size-"]` (e.g. `.pilot-button svg`)
**WHEN** a caller passes `Spinner size`
**THEN** Spinner adds a `size-spinner-{size}` marker class so the explicit size wins; omitting `size` keeps container-driven icon sizing (unchanged default behavior).

### DEC-010: File-less upload issue is advisory

**GIVEN** a validator may return an issue without `file` (e.g. `minFiles`)
**WHEN** files are selected one at a time toward a minimum
**THEN** file-bound issues reject their file; file-less issues are reported through `onIssue` / inline display but never block accepted files. Blocking would make an incremental minimum unreachable. The consumer enforces minimums at submit.
