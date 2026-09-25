# Tasks: Package Blockers for Consumer Replacement

Build in the shaped order: G5, G4, G1, G2. Write behaviour tests first. Check presentation variants in the catalog and browser, not with CSS assertions in unit tests. Each gap ships with its catalog example, CUSTOMIZATION.md entry and changeset. If a gap overruns its share of the 3-day appetite, cut it and ship the rest.

## Setup

- [x] Classify audit items against existing package exports and ADHD boundary.
- [x] Confirm no existing viewer, list, multi-select or combobox public props conflict with the planned additions.

## G5 · ComboboxChip removeLabel

- [x] Write a failing component test: two chips have different remove names, and removing one leaves the other selected. Then add `removeLabel` to `app/component/brand/stylex/combobox.tsx`.
- [x] Browser: keyboard removal keeps focus usable, and the accessibility archetype passes. Add a catalog example and document the fix that hides an unnamed remove button.

## G4 · MultiSelectTrigger width

- [x] Add `width="full"` to `app/component/brand/stylex/multi-select.tsx`, for both the regular and `asChild` trigger.
- [x] Catalog/browser: full width fills a form row, the default stays intrinsic, and both open and select by keyboard.

## G1 · UploadViewer status and action

- [x] Write failing component tests for: loading without a URL, moving to ready, media failure, error and PDF fallback, safe download, and the action slot. Then extend `app/component/brand/stylex/upload-viewer.tsx`.
- [x] Browser: `finalFocus` restore and PDF ready/error states. Add a catalog example for each state.

## G2 · UploadList preview and recipes

- [x] Write failing component tests for: default preview compatibility, `none` still selecting and removing, and `thumbnail` controls being named. Then extend `app/component/brand/stylex/upload-list.tsx`.
- [x] Browser: keyboard, disabled state and single callback delivery for both recipes. Add catalog examples for raw `DropArea` and controlled `UploadList`, and document both in CUSTOMIZATION.md.

## Verification

- [x] Verify root and stable subpath types, and confirm the changeset covers every gap.
- [x] Run `bun fmt`, `bun lint`, `bun typecheck`, `bun boundary`, `bun test`, `bun coverage:runtime`, `bun run build`, `bun catalog:build`, `bun catalog:test`, relevant `bun catalog:test:visual`, `bun verify:package` and `bun verify:tree-shaking`.
- [x] Run react-doctor and save Bun.WebView evidence in `.eval/MMDD-consumer-replacement/`.
- [x] Review all specs against the implementation, then archive through archive-plan.
