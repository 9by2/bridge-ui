# Spec: Upload Validation

**Spec ID:** `upload-validation`
**Proposal:** `consumer-gap-close`
**Status:** accepted
**Amends:** [upload-composition](../../../spec/upload-composition/spec.md)

## Summary

`UploadList` gains composable validation, typed change reasons, a grid layout, render slots, single-file replace mode and issue reporting that never toasts (DEC-002, DEC-006, DEC-007, DEC-010).

## Requirements

### REQ-001: Composable validation

`validate?: UploadValidator` runs on every selection after react-dropzone filtering. Builders: `uploadValidation.default({ accept, maxFiles, minFiles, maxSize, minSize, message })`, `uploadValidation.accept(accept)`, `uploadValidation.extension([...])`, `composeUploadValidation(...validators)`. An issue with `file` rejects that file; an issue without `file` is advisory and does not block (DEC-010). `maxFiles` / `minFiles` count the resulting list (current value + incoming, or incoming only when replacing).

**Acceptance:**

- [x] `composeUploadValidation` concatenates issues from every validator in order.
- [x] `accept` matches MIME, MIME wildcard and extension; `extension` matches case-insensitively.
- [x] File-bound issue rejects only its file; file-less issue is reported and does not block.
- [x] Builder messages are replaceable per `UploadIssueCode`.

### REQ-002: Change reason

`onValueChange(value, change)` with `change = { reason, attachment }`; `reason ∈ UploadChangeReason { append, replace, remove, clear }`; `attachment` lists added or removed items. Existing one-argument callers keep working.

**Acceptance:**

- [x] Selecting in multiple mode → `append`; selecting with `multiple={false}` over an existing item → `replace`; remove → `remove`; clear → `clear`.

### REQ-003: Issue reporting (DEC-002, DEC-006)

`onIssue(issues, event)` receives every issue (react-dropzone rejection, count, byte, validator) with `event = { accepted, rejected }`. `onReject` keeps firing with its old payload and is `@deprecated`. `issueDisplay` (`UploadIssueDisplay { none, inline }`, default `none`) optionally renders the latest issues in `role="alert"`. Upload modules import no toast module.

**Acceptance:**

- [x] `onIssue` payload carries code, message and file.
- [x] `issueDisplay="inline"` renders issue messages in an alert; `none` renders nothing extra.
- [x] Static test: `drop-area`, `upload-*` modules import neither `sonner` nor the toast module.

### REQ-004: Layout and slot

`layout` (`UploadListLayout { list, grid }`) — `grid` renders tiles with square media. `renderEmpty()` renders when value is empty. `renderItem(attachment, helper)` replaces the default row; `helper = { remove, preview?, layout }`.

**Acceptance:**

- [x] `renderItem` helper `remove` removes with reason `remove` and restores focus to the drop target.
- [x] `renderEmpty` shows only when empty.

### REQ-005: Keyboard

The drop target opens the file picker with Enter/Space; remove is a named button operable by keyboard and returns focus to the drop target.

**Acceptance:**

- [x] Enter on the drop target opens the file input.
- [x] Browser: keyboard remove returns focus to the drop target.

## Schema / API

```ts
export const UploadIssueCode = {
  fileInvalidType: "file-invalid-type",
  fileTooLarge: "file-too-large",
  fileTooSmall: "file-too-small",
  tooManyFiles: "too-many-files",
  tooFewFiles: "too-few-files",
  totalSizeExceeded: "total-size-exceeded",
  custom: "custom"
} as const
export type UploadIssue = { code: UploadIssueCode; message: string; file?: File }
export type UploadValidator = (
  file: readonly File[],
  context: { value: readonly UploadAttachment[] }
) => readonly UploadIssue[]
export const UploadChangeReason = { append: "append", replace: "replace", remove: "remove", clear: "clear" } as const
export const UploadListLayout = { list: "list", grid: "grid" } as const
export const UploadIssueDisplay = { none: "none", inline: "inline" } as const
```

## Non-Goals

- Toast or global feedback (DEC-002).
- Validation on `DropArea` (DEC-007).
- Network upload.
