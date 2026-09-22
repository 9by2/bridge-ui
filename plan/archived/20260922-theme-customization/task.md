# Tasks: Theme Customization

Implementation order matters — complete top to bottom.

## Setup

- [x] Create proposal, design, decisions, and public contract spec.
- [x] Add failing public Theme and portal customization tests.

## Core

- [x] Add typed override, density, resolved context, and scoped public variables to Theme.
- [x] Migrate P0 recipes to semantic public color, radius, and spacing variables.
- [x] Preserve package portal inheritance and Sonner surface radius.

## Integration

- [x] Document setup, variable contract, P0 coverage, and limitations in CUSTOMIZATION.md.
- [x] Link customization documentation from README.md.
- [x] Add a minor Changeset.
- [x] Add catalog coverage for default, compact, and custom Theme setup.

## Verification

- [x] Run formatting, lint, typecheck, tests, runtime coverage, package build, compact catalog contracts, visual/memory diagnostics, package verification, and tree-shaking.
- [x] Retain Bun.WebView evidence under `.eval/`.
- [x] All specs in `spec/` reviewed against implementation.
- [x] Archive proposal per plan/PROPOSAL.md.
