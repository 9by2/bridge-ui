# Design

UploadPreview presents transfer state. UploadViewer renders caller-owned URL in a controlled dialog. UploadList composes controlled local/remote attachment with DropArea, cumulative constraint and accessible feedback. ImageCrop owns transient editing and emits a cropped File without uploading.

```tsx
<UploadViewer
  open={open}
  onOpenChange={setOpen}
  source={attachment}
  closeLabel="Close"
  fallback="Preview unavailable"
  downloadLabel="Download"
/>
```
