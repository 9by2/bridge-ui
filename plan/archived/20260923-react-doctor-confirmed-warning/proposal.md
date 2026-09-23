# Confirmed React Doctor Warning

**Status:** complete

## Problem

The full scan reports 140 warnings, including confirmed stale catalog state and missing texture failure handling. The prior warning triage records intentional and generated findings.

## Scope

Fix demonstrable behavior at public seams without scanner suppression, generated Shadcn edits, or public API breaks. Preserve pre-existing uncommitted files.

## Success

- Confirmed failures have regression coverage.
- Full scan has no new errors and fewer confirmed warnings.
- Required verification passes; report residual warnings accurately.

## Outcome

Full React Doctor 0.9.14 scan: 0 errors, 138 warnings (down from 140), 66 score, 1,143 analyzed files, no skipped checks. Texture-load errors retain the accessible static fallback, and preview document metadata tracks embedded settings. Remaining findings include generated Shadcn source, copied pilots, vendored demos, generated bundles, and advisory refactor/performance rules. They were not suppressed or claimed fixed. The user's selected scope was confirmed defects rather than a zero-warning report at the cost of compatibility or scanner exclusions.
