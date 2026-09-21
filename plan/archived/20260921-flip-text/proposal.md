# Flip Text

**Proposal:** `flip-text`
**Status:** complete
**Phase:** [ADHD.md](../../ADHD.md) — reusable package presentation component

## Problem

The added `app/component/brand/flip-text.tsx` was an incomplete external-style snippet: it used utility classes, had no package or catalog contract, and assigned animation variables without defining a keyframe animation. Its UTF-16 character splitting also breaks Thai grapheme clusters and emoji.

## Scope

### In scope

- Make `FlipText` a StyleX-owned `@bridge/ui` presentation component with a root and stable direct export.
- Provide actual rotate-X animation, a reduced-motion stop, caller-controlled timing, loop, separator, and synchronized/staggered modes.
- Segment text by `Intl.Segmenter` grapheme clusters.
- Add accessible source text, test coverage, component catalog examples, and package contract verification.

### Out of scope

- Application copy, workflow behavior, click state, or consumer migration.
- Exposing visual animation internals beyond the existing timing controls.

## Success Criteria

- [x] `FlipText` exposes an accessible native span and decorative animated grapheme layer.
- [x] Thai grapheme clusters and emoji remain individual animation units.
- [x] Motion uses a StyleX keyframe and stops for reduced motion.
- [x] Root/direct exports, catalog inventory, package test, and focused tests pass.

## Specs

| Spec      | Path                     | Summary                                         |
| --------- | ------------------------ | ----------------------------------------------- |
| flip-text | `spec/flip-text/spec.md` | Public presentation and accessibility contract. |
