# Tasks: Effect Color Token

## Setup

- [x] Add failing component test for Theme `backdrop`/`shadow` override and browser test for host CSS override.

## Core

- [x] Add `effectToken` and public defaults.
- [x] Migrate owned StyleX backdrop and shadow literals.
- [x] Migrate adapter.css sidebar inset shadow and Cue scrollbar.
- [x] Calendar colored all-day text contrast.

- [x] Patch generated Shadcn backdrop/slider through the guarded CLI refresh; map catalog Tailwind overlay/shadow to effect tokens.

## Integration

- [x] CUSTOMIZATION.md variables + exception list.
- [x] Changeset (minor).

## Verification

- [x] fmt, lint, typecheck, test, coverage, build, catalog build, browser gate.
- [x] Bun.WebView evidence in `.eval/0925-effect-color-token/`.
- [x] Artifact published: https://artifact.9by2.workers.dev/artifact/01a0d782-6510-7a15-b9e9-f61235258c19/
- [x] All specs in `spec/` reviewed against implementation
