# Tasks: Color picker

Implementation order matters — complete top to bottom.

## Core

- [x] Write failing behavior tests (selection, controlled value, custom hex, disabled, background helper).
- [x] Implement `ColorPicker`, presets and `colorPickerBackground`.

## Integration

- [x] Export from `app/index.ts` and `@bridge/ui/color-picker` subpath.
- [x] Catalog examples: default, variants (size x layout), fill/custom preset, states.
- [x] Document in CUSTOMIZATION.md; add minor changeset.

## Verification

- [x] `bun fmt`, `bun lint`, `bun typecheck`, `bun test`, `bun coverage:runtime`.
- [x] `bun run build`, `bun catalog:build`, `bun catalog:test`, `bun verify:package`, `bun verify:tree-shaking`.
- [x] react-doctor clean for new files.
- [x] Bun.WebView evidence in `.eval/0924-color-picker/`.
- [x] All specs in `spec/` reviewed against implementation
- [x] Archive proposal
