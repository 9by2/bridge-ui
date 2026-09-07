# Upload Composition Contract

**Status:** accepted

Viewer supports image, audio, video, PDF and unsupported metadata/download. Controlled list preserves caller-owned local File and remote URL metadata, checks cumulative count and byte limit, and reports per-file rejection. Transfer state includes queued, uploading, success, error and cancelled with actual caller-supplied progress and retry/cancel callback. Crop supports position, zoom, rotation, square/original/banner ratio and emits an applied File separately from upload. Feedback is announced; closing a viewer and removing a row restores predictable focus. No package-owned network request or fabricated progress.

Public export: UploadViewer, UploadList, UploadAttachment, UploadRejection and ImageCrop. Viewer accepts an explicit finalFocus target for external trigger restoration, permits HTTP(S), blob and root-relative URL, and leaves PDF download available when browser inline support is absent. Crop emits PNG at 768px width, preserves the chosen aspect ratio and closes decoded bitmap on replacement/unmount. Crop decode/encode failure is announced through caller-owned error copy. List removal focuses the selection target rather than a disappearing row; caller must apply onValueChange output.
