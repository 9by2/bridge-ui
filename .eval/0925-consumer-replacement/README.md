# Consumer Replacement Verification

Plan: `plan/consumer-replacement-requirement/`. Captured with Bun.WebView (Chrome) against the static catalog build.

| Capture | Shows |
| --- | --- |
| `viewer-loading.png` | `status="loading"`: `statusLabel` in `role="status"`, no media, no download, no action |
| `viewer-error.png` | `status="error"`: fallback in `role="alert"`, no download, no action |
| `viewer-ready.png` | `status="ready"`: media, Download, caller `action`, Close; no failure copy |
| `combobox-chip.png` | Each chip has a named remove button (`Remove Jazz`, `Remove Soul`) |
| `multi-select-full-width.png` | `width="full"` fills the row; the default trigger stays intrinsic |
| `upload-list-preview.png`, `upload-list-thumbnail.png`, `upload-list-none.png` | `preview` row, thumbnail tiles in the grid track, and none (items hidden) |
| `drop-area-surface.png` | Raw `DropArea` recipe with a custom compound surface |
| `mobile-*.png` | 390px viewport: no document overflow |

Defect found during capture and fixed: `preview="thumbnail"` in list layout rendered one full-width square tile per row. Thumbnail tiles now always use the grid track. The regression is covered in `test/browser/consumer-replacement.test.ts`.

The first ready capture used a `.txt` source, which showed the unsupported-type fallback. The catalog example now uses an SVG so the ready state shows real media.

## Reproduce

```sh
bun catalog:build
bun .eval/0925-consumer-replacement/serve.ts &   # http://127.0.0.1:6033
bun .eval/0925-consumer-replacement/capture.ts   # asserts viewer state and mobile overflow, writes PNGs
CATALOG_PORT=0 bun cmd/run-catalog-test.ts ./test/browser/consumer-replacement.test.ts
```
