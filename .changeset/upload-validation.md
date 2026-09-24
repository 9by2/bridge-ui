---
"@bridge/ui": minor
---

Add composable upload validation and issue reporting to `UploadList`.

- `validate` with `uploadValidation.default/accept/extension` and `composeUploadValidation`; `UploadIssue` with `UploadIssueCode`.
- `onValueChange(value, change)` now receives `{ reason, attachment }` (`UploadChangeReason`: `append`, `replace`, `remove`, `clear`). Existing one-argument callbacks keep working.
- `onIssue(issue, { accepted, rejected })` reports every issue. Optional `issueDisplay="inline"` renders an accessible `role="alert"` list. Upload components never toast.
- `layout` (`UploadListLayout`: `list`, `grid`), `renderEmpty`, `renderItem`, and single-file replace through `multiple={false}`.
- `UploadPreview` `variant` (`UploadPreviewVariant`: `row`, `tile`).
- **Deprecated:** `UploadList` `onReject`. Use `onIssue`; `onReject` still fires unchanged.
