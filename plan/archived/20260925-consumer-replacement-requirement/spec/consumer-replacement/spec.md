# Spec: Package Blockers for Consumer Replacement

**Spec ID:** `consumer-replacement`
**Proposal:** `consumer-replacement-requirement`
**Status:** accepted
**Amends:** [upload-composition](../../../spec/upload-composition/spec.md), [upload-validation](../../../spec/upload-validation/spec.md)

## Summary

Extend four owned brand contracts in `@bridge/ui` 0.11.0 to unblock shared-presentation replacement. This spec is limited to package source, tests, catalog, documentation, and release metadata; bridge-web migration is not an acceptance gate. Existing callers must continue compiling and behaving the same when new props are omitted, except that an unnamed chip remove button must no longer render.

## API

```ts
export const UploadViewerStatus = { loading: "loading", ready: "ready", error: "error" } as const
export type UploadViewerStatus = ValueOf<typeof UploadViewerStatus>
// Additive UploadViewer props; all existing props remain.
type ViewerAddition = {
  status?: UploadViewerStatus // default ready
  statusLabel?: string // required when status is loading
  action?: React.ReactNode // caller owns action URLs/handlers
  source: { name: string; type: string; url?: string; description?: string }
}

export const UploadListPreview = { none: "none", row: "row", thumbnail: "thumbnail" } as const
export type UploadListPreview = ValueOf<typeof UploadListPreview>
// Additive UploadList prop: preview?: UploadListPreview.
// Additive owned MultiSelectTrigger prop: width?: "intrinsic" | "full" (default intrinsic).
// Additive owned ComboboxChip prop: removeLabel?: string (required when showRemove is true).
```

`ValueOf` follows the package's existing constant/type convention. Do not change generated `app/component/shadcn/**` APIs by hand.

## Requirements

### REQ-001: Controlled file viewer state and action (G1)

Change `app/component/brand/stylex/upload-viewer.tsx`. `status` defaults to `ready`; existing callers with `source.url` require no change. For `loading`, announce `statusLabel` with `role="status"` and render neither media nor download. For `error`, announce `fallback` with `role="alert"`. For `ready` and a safe nonempty URL, render supported media and the existing download link; unsupported types display existing fallback and download. For `ready` without a safe URL, render fallback without any package-generated link. Failed image/audio/video media displays fallback and no download; failure state resets when source URL/type or dialog opening changes. PDF failure is caller-driven through `status="error"`; do not rely on iframe events. Do not render PDF fallback while ready. Render `action` alongside the built-in download and Close controls only in ready state with a safe URL; its behavior and URL safety are caller-owned. Preserve `finalFocus` and URL protocol restrictions.

**Acceptance:**

- [x] Component: loading with absent URL exposes status label; transitioning to ready with a URL renders media and download, with no stale error.
- [x] Component: error status and image/audio/video failure announce fallback; ready PDF shows iframe but not failure copy.
- [x] Component: missing/unsafe URL renders no built-in navigation and no custom action; supported safe URL renders supplied action.
- [x] Browser: close/Escape restore `finalFocus`; ready/error PDF transitions remain accessible.
- [x] Public type/packed fixture: old viewer call compiles unchanged.

### REQ-002: Advanced upload composition (G2)

Change `app/component/brand/stylex/upload-list.tsx` only for `preview`; keep `DropArea` runtime as-is. `preview="none"` suppresses the default attachment preview list, not the drop target, status announcements, `renderEmpty`, controlled value, or selection/validation callbacks. `row` displays row previews; `thumbnail` displays tile previews with image thumbnail (or file-type icon), always in the grid track (DEC-006). Omitted `preview` keeps the current list/row and grid/tile behavior; `layout` independently controls list/grid arrangement. `renderItem` overrides default preview unless `preview="none"`. Document two non-nested recipes in CUSTOMIZATION.md: raw CMS/media selection through `DropArea onDrop/onDropRejected` with compound children, and controlled validated selection through `UploadList` children/`renderEmpty`/`renderItem`/`onIssue`. The consumer owns any thumbnail URL lifecycle and toast.

**Acceptance:**

- [x] Component: `none` hides default items while selection, validation, `onValueChange`, `onIssue`, and live announcements still work; callers can render a custom surface in `children`.
- [x] Component: explicit row/thumbnail/default cases preserve named preview/removal actions; `renderItem` overrides displayed items except for `none`.
- [x] Browser: raw `DropArea` and controlled `UploadList` examples deliver one callback per selection, respect disabled state, and allow keyboard file picker activation; removal restores focus.
- [x] Catalog/documentation: no nested drop target and no consumer descendant selector; no network upload or package toast.

### REQ-003: Full-width multi-select trigger (G4)

Change `app/component/brand/stylex/multi-select.tsx`. Add `width?: "intrinsic" | "full"` (default `intrinsic`) to the owned trigger. Apply the width on the actual trigger element, including `asChild` composition, without changing all `Button` widths or the generated Shadcn multi-select. Keep caller className/props, `role="combobox"`, and `aria-expanded`.

**Acceptance:**

- [x] Catalog/browser: full-width trigger fills a form row and default remains intrinsic; both open and select by keyboard.
- [x] Public type check: `asChild` and regular trigger accept width and preserve semantics; generated Shadcn source is untouched.

### REQ-004: Accessible chip removal (G5)

Change `app/component/brand/stylex/combobox.tsx`. Add `removeLabel?: string` on the owned `ComboboxChip`; require a nonempty caller-provided label when `showRemove` is true (omit the built-in remove control if no label is provided rather than rendering an unnamed control). Pass the label to `Primitive.ChipRemove` so each button identifies its chip, e.g. `removeLabel={copy.removeTag(tag)}`. `showRemove={false}` stays display-only. Do not derive copy from `children` or hardcode English/Thai.

**Acceptance:**

- [x] Component: two chips expose distinct supplied remove names and clicking one changes only its selection; unlabeled chips expose no unnamed remove button.
- [x] Browser: keyboard removal preserves usable focus and accessibility archetype passes; `showRemove={false}` has no remove control.
- [x] Existing controlled combobox selection behavior is retained.

### REQ-005: Package integration

Export all new constants/types/props through existing stable public entries. Document each new prop and both upload recipes in CUSTOMIZATION.md, add catalog examples for the new states, and add a changeset. Existing upload validation, list change reasons, safe viewer URL policy, SSR, and no-toast boundary remain intact.

**Acceptance:**

- [x] `bun fmt`, `bun lint`, `bun typecheck`, `bun boundary`, `bun test`, `bun coverage:runtime`, `bun run build`, `bun catalog:build`, `bun catalog:test`, relevant visual check, `bun verify:package`, `bun verify:tree-shaking`, and React Doctor gates pass.
- [x] Packed client and SSR consume new and existing props without package-specific transforms; relevant Bun.WebView screenshots/steps are stored in `.eval/MMDD-consumer-replacement/`.

## Non-Goals

- Consumer code edits in bridge-ui; migration is a separate bridge-web proposal after package release.
- `TypographyTable` with no production importer; existing Table already composes semantic tables.
- CDN transforms, document/blob fetching, domain copy, permission logic, scheduling state, brand icons, or app navigation.
- Removal of valid app-owned `TitledPanel`, breadcrumbs, resizable-sheet persistence, alert compositions, or rich text editor.
