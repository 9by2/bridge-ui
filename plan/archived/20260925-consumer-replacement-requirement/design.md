# Design: Package Blockers for Consumer Replacement

## Overview

Change the four owned brand components that block replacement. Keep `DropArea` as the raw drop callback escape hatch; it already accepts `onDrop`, `onDropRejected`, `accept`, and children. `UploadList` remains the controlled validated flow, not a wrapper around an independently mounted `DropArea`. Existing callers use default values and stay source-compatible.

## Architecture

```text
bridge-web: blob fetch, CDN source, File mapping, copy, domain state
                  |                 |
                  v                 v
@bridge/ui: UploadViewer / DropArea + UploadList / MultiSelect / Combobox
                  |
                  v
             catalog + public export + packed client/SSR
```

## Components

| Component          | Responsibility                                                                       | Location                                       |
| ------------------ | ------------------------------------------------------------------------------------ | ---------------------------------------------- |
| UploadViewer       | Controlled loading/error/ready presentation, safe actions and media failure          | `app/component/brand/stylex/upload-viewer.tsx` |
| DropArea           | Existing raw drop callback and compound children; document recipe, no runtime change | `app/component/brand/stylex/drop-area.tsx`     |
| UploadList         | Select a built-in preview policy without replacing selection/validation              | `app/component/brand/stylex/upload-list.tsx`   |
| MultiSelectTrigger | Full-width field variant                                                             | `app/component/brand/stylex/multi-select.tsx`  |
| ComboboxChip       | Named removal control per chip                                                       | `app/component/brand/stylex/combobox.tsx`      |

## Data Flow

1. Viewer receives caller-owned status and URL; it renders a progress/status message, media, or error, and optional caller action. Changing URL or reopening clears any old media failure.
2. CMS/media surfaces use `DropArea` with their own `onDrop` and children; controlled lists use `UploadList`, which handles accepted/rejected files once and renders selected preview policy.
3. Multi-select and combobox expose the width and translated remove name through owned public props, without consumer CSS selectors.

## Example Code

```tsx
<UploadViewer
  open={open}
  onOpenChange={setOpen}
  source={{ name: file.name, type: file.type, url: blobUrl }}
  status={blobUrl ? "ready" : "loading"}
  statusLabel={copy.loading}
  fallback={copy.unavailable}
  closeLabel={copy.close}
  downloadLabel={copy.download}
  action={<Button onClick={() => openFile(blobUrl)}>{copy.open}</Button>}
/>

<UploadList
  value={attachment}
  onValueChange={setAttachment}
  copy={copy}
  preview="none"
>
  <span>{copy.choose}</span>
</UploadList>

<MultiSelectTrigger width="full"><MultiSelectValue placeholder={copy.genre} /></MultiSelectTrigger>
<ComboboxChip value={tag} removeLabel={copy.removeTag(tag)}>{tag}</ComboboxChip>
```

## Risks & Mitigations

| Risk                                                                  | Mitigation                                                                                                                                                               |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Custom upload surface duplicates file selection/validation            | Document two distinct recipes: raw `DropArea` with custom content, or controlled `UploadList` with children/`renderEmpty`/`renderItem`. Never nest one inside the other. |
| Browser PDF failure is not reliably detectable from iframe load/error | Define a caller-controlled failure state for PDF; do not promise browser-detected PDF failures.                                                                          |
| User-provided actions expose unsafe URLs                              | Preserve existing URL safety check for package-generated links; caller owns safety of its custom action.                                                                 |
| Thumbnail semantics differ from grid layout                           | Preview controls media rendering, while layout controls list/grid arrangement; keep old defaults (`row` for list, `tile` for grid).                                      |
| Existing unlabeled chip remove stops rendering                        | Document the deliberate accessibility correction; consumers supply `removeLabel` per chip to restore removal.                                                            |
| Generated Shadcn equivalents diverge                                  | Change owned brand implementation and exports; never hand-edit generated source.                                                                                         |
