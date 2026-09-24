# Tasks: Consumer Gap Close

Implementation order matters — complete top to bottom. Each group is one stacked branch (DEC-004).

## Setup

- [x] Worktree `../bridge-ui-consumer-gap-close` from `origin/main`
- [x] Proposal, design, decision, task, spec

## P0 — `feat/sonner-spinner`

- [x] P0-1 failing test: `sonnerToast.success()` renders inside `SonnerToaster`; `./sonner` subpath exports `Toaster` + `toast`
- [x] P0-1 root `sonnerToast`, `./sonner` subpath, JSDoc on both `toast`
- [x] P0-1 `CUSTOMIZATION.md` "Which toaster?"
- [x] P0-2 failing test: `Spinner` keeps status role + label across sizes and forwards props
- [x] P0-2 `SpinnerSize` + `size` prop, catalog example
- [x] P0 changeset (minor), gates, commit
- [x] P0 WebView regression: explicit Spinner size overridden by `.pilot-button svg` rule; fixed via `size-*` opt-out (DEC-009)

## P1-1 — `feat/page-density`

- [x] failing test: `spacing` alone resolves as before, `density` overrides, default unchanged, `data-density`
- [x] `PageDensity`, `PageWidth`, `density`, `width`
- [x] `PageEyebrow`, `PageMeta`, `PageFilter`, `PageFormAction` (`sticky`)
- [x] `DataState` `onRetry` + `retryLabel` (test: click calls `onRetry`)
- [x] catalog, `CUSTOMIZATION.md` migration note, changeset, gates, commit
- [x] WebView regression: `content` width style key collided with PageContent style; renamed and guarded in `test/browser/responsive.test.ts`

## P1-3 — `feat/upload-validation`

- [x] failing tests: validation composition, change reason per path, replace mode, `onIssue` payload, inline alert, keyboard remove, no toast import
- [x] `UploadIssueCode`, `UploadChangeReason`, `UploadListLayout`, `UploadIssueDisplay`, `uploadValidation`, `composeUploadValidation`
- [x] `UploadList` `validate`, `onIssue`, `issueDisplay`, `layout`, `renderEmpty`, `renderItem`, `multiple`
- [x] catalog, `CUSTOMIZATION.md`, changeset, gates, commit
- [x] `UploadPreview` `variant` (`row`/`tile`) for grid; permanent browser test for inline issue + keyboard remove focus

## P1-2 — `feat/calendar-parity`

- [x] failing tests: `color` exposed through custom property, `muted` state, `renderHoliday` + holiday `meta`, activation by click + keyboard
- [x] browser test: month drag-hover highlight set while dragging over and cleared after drop/leave
- [x] implementation, spec extension, catalog, `CUSTOMIZATION.md`, changeset, gates, commit
- [x] Browser drag-hover test added to compact gate (`cmd/run-catalog-test.ts`); CDP real-drag evidence

## P1-4 — `chore/icon-slot-audit`

- [x] audit table in spec; fix non-conforming slot
- [x] catalog example with neutral inline-SVG mark in `Button`, `ItemMedia`, `MetricTile`
- [x] `CUSTOMIZATION.md` note, changeset if fix, gates, commit
- [x] Fixed MetricTile/DataStateMedia/EmptyMedia/SettingsNavItem unsized SVG (DEC-011); browser guard in responsive suite

## P2 — `feat/prose-and-misc`

- [ ] P2-1 prose typography set + `./typography` subpath + catalog
- [ ] P2-2 `ResponsiveImage` `fallbackSrc` (test: swap once, no loop) + blur `placeholder`
- [ ] P2-3 `ShellHeaderActionProvider`, `useShellHeaderAction`, `ShellHeaderActionSlot` (test: set, render, clear on unmount)
- [ ] P2-4 `DateRange`/`Matcher`, `MultiSelectSeparator`, `PercentCrop`/`PixelCrop`
- [ ] catalog, `CUSTOMIZATION.md`, changeset, gates, commit

## Verification

- [ ] Bun.WebView evidence in `.eval/0924-consumer-gap-close/`
- [ ] All specs in `spec/` reviewed against implementation
- [ ] Archive proposal and sync spec (archive-plan)
- [ ] Final report: exports, before → after API table, deprecations, consumer migration note
