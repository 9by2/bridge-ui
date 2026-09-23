# React Doctor Warning Triage

**Proposal:** `react-doctor-warning`
**Status:** done

## Problem

React Doctor 0.9.14 reports 153 warnings after the error cleanup. Many concern generated, pilot, and vendored examples, while some identify concrete accessibility defects. See [ADHD.md](../../ADHD.md) for source ownership.

## Scope

- Fix verified accessible semantics and stable list identity in owned source and catalog examples.
- Preserve published contracts and generated Shadcn ownership.
- Record deferred and rejected findings with evidence rather than suppressing rules.

## Success Criteria

- [x] No new errors; verified warnings decrease on the same full scan.
- [x] All required gates pass and one commit contains the completed work.

## Triage Outcome

React Doctor 0.9.14 full scan: 153 to 140 warnings, zero errors, score 65 to 66. Confirmed fixes include stable error/weekday keys, semantic catalog summary, decorative attachment icons, native navigation, native output roles, and a named dialog in the test fixture. No rule was disabled or suppressed.

Remaining warnings are not claimed fixed. Examples: `app/component/brand/stylex/breadcrumb.tsx` intentionally uses a non-navigable current-page span (`role=link`, `aria-disabled`); `app/component/brand/stylex/slider.tsx` uses positional keys for a fixed sequence of identical thumbs; carousel `setApi` is a public callback; `internal/catalog/preview.tsx` embeds same-origin interactive previews and requires scripts and origin access, so a sandbox policy needs a separate browser contract; `catalog-dist/**` and `playwright-report/**` security warnings target generated bundles, not author source; `app/component/shadcn/**` is CLI-owned. Performance and refactor suggestions remain unverified without runtime measurements or design review. Avoid changing these solely for a numeric score.

## Specs

| Spec           | Path                          | Summary                                               |
| -------------- | ----------------------------- | ----------------------------------------------------- |
| warning-triage | `spec/warning-triage/spec.md` | Fix confirmed behavior; retain intentional contracts. |
