# Tasks: Flip Text

## Setup

- [x] Create proposal, design, decision, and spec.

## Test

- [x] Add component tests for native prop/ref forwarding, accessible content, timing modes, separator behavior, empty content, and Thai/emoji grapheme handling.
- [x] Extend package-contract direct export coverage.

## Core

- [x] Implement owned StyleX `FlipText` with a 3D keyframe and reduced-motion behavior.
- [x] Replace the original brand module with a compatibility re-export.
- [x] Register root and stable direct exports.

## Catalog

- [x] Add default and state examples including Thai and emoji content.

## Verification

- [x] Run focused tests, formatter, lint, typecheck, boundary, package build, catalog build, and packed package verification; record unrelated repository-wide coverage/catalog-browser blockers in `.eval/0921-flip-text/`.
- [x] Replace the equivalent manual Segmenter loop with `Array.from` so V8 does not report an unreachable iterator-control branch against the 100% non-Shadcn gate.
- [x] Review every spec acceptance item.
- [x] Archive proposal and sync canonical spec after all verification passes.
