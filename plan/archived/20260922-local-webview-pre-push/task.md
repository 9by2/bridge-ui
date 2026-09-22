# Tasks: Local WebView Pre-Push

Implementation order matters - complete top to bottom.

## Setup

- [x] Record local and CI catalog gate ownership.

## Core

- [x] Add failing contract coverage for hook installation, hook execution, and CI static build.
- [x] Add the repository pre-push hook and installer command.
- [x] Replace CI WebView execution with static catalog compilation.

## Integration

- [x] Update contributor and quality-gate documentation.
- [x] Configure the current checkout to use repository hooks.

## Verification

- [x] Run focused tests and required repository gates. Full WebView gate blocks on existing BridgeCalendar accessibility defects; static build and a focused dynamic-port WebView case pass.
- [x] All specs in `spec/` reviewed against implementation.
- [x] Archive proposal per the archive-plan workflow.
