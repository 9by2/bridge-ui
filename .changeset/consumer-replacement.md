---
"@bridge/ui": minor
---

Close the remaining consumer replacement gaps for file preview, uploads, multi-select and combobox chips.

- `UploadViewer` adds `status` (`UploadViewerStatus`: `loading`, `ready`, `error`; default `ready`), `statusLabel` and a caller-owned `action` slot. `source.url` is now optional until the file is ready. PDF fallback copy appears only on `status="error"`, not under a working preview. Download and the action appear only when the file is viewable.
- `UploadList` adds `preview` (`UploadListPreview`: `none`, `row`, `thumbnail`). `none` hides items while selection, validation and callbacks keep running. `thumbnail` renders square tiles in the grid track. If you omit it, behavior is unchanged. CUSTOMIZATION.md documents the raw `DropArea` and controlled `UploadList` recipes for custom surfaces.
- `MultiSelectTrigger` adds `width` (`MultiSelectTriggerWidth`: `intrinsic` by default, or `full`) to fill a form row.
- `ComboboxChip` adds `removeLabel`, which names each remove button. **Accessibility fix:** a chip without `removeLabel` no longer renders an unnamed icon-only remove button. Pass `removeLabel` wherever chips should stay removable.
