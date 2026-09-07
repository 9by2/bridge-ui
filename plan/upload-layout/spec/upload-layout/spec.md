# Upload Layout Contract

`UploadPreview` is a public package Item composition, available from the root and `@bridge/ui/upload-preview`. It accepts name, MIME type, caller-formatted description, optional thumbnail, disabled state, className and named preview/remove callback objects. Image/video/audio/PDF/generic icon is selected from MIME type. It creates no object URL and performs no upload; the caller owns file and viewer lifecycle. Action is a sibling button, not a nested clickable row.

DropArea accepts `layout: "stacked" | "inline" | "compact"`, default stacked. Every layout retains accessible name, keyboard selection, disabled behavior and file constraint. Catalog demonstrates media/avatar preview, multi-file removal, document filtering and explicitly simulated transfer. Object URL is revoked after replacement or unmount. No action button nests inside DropArea.

Crop example composes an adjustable center-square crop with a caller-owned upload callback. Canvas emits a 256px PNG File; image bitmap is closed in finally. Callback is a no-network demo and reports the file name/size. Upload remains outside the shared primitive.
