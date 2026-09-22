# Tasks: Settings Composition

Implementation order matters — complete top to bottom.

## Setup

- [x] Define the responsive composition contract and public test seams.

## Core

- [x] Add failing public-contract tests for semantic slots and dialog navigation activation.
- [x] Implement the settings composition and export it from root and direct entry points.
- [x] Add a failing public-contract test for the optional sidebar identity header.
- [x] Implement `SettingsSidebarHeader` in desktop and compact navigation layouts.

## Integration

- [x] Add the settings catalog example using `SettingItem`.
- [x] Add avatar and supporting detail to the settings catalog sidebar header.
- [x] Add catalog examples for dialog-backed configuration and inline setting edits.
- [x] Add inline dropdown editing and alert-dialog confirmation examples.
- [x] Replace time-zone text entry with command search selection.

## Verification

- [x] Run focused test, format, lint, typecheck, catalog build, and package build.
- [x] Review all specs in `spec/` against implementation.
- [x] Archive proposal per plan/PROPOSAL.md.
