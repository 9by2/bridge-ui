# Dialog Density Padding Verification

1. Build the catalog with `bun catalog:build`.
2. Run `bun .eval/0922-dialog-density-padding/run.ts`.
3. The runner opens each density dialog at a 390px viewport, compares content and footer padding, verifies the flush footer margin, and captures a screenshot.
