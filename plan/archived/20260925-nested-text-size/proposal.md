# Nested Text Size

**Proposal:** `nested-text-size`
**Status:** done
**Phase:** [ADHD Quality](../../ADHD.md)

## Problem

Measured in bridge-web at 1440px with a 16px root: the em-based `--bridge-font-size-*` tokens compound at every nesting level. Muted inside SwimLaneBoardItem renders at 10.5px, StatusStamp and Badge inside Card at 10.5px, TimelineStepTime at 10.5px, WizardStepDescription at 11.4px, and an H3 inside an item at 15px. SwimLaneBoard counts render at 11px and the corner at 10px. Expanded lanes use `minmax(220px, 1fr)`, so a single lane stretches to 783px.

## Scope

### In scope

- Add rem text tokens `--bridge-text-size-{xs,sm,md,base,lg}` so text never compounds.
- Muted, Small, Large, Body, StatusStamp, Badge, TimelineStep description/time, WizardStep description/counter, and DetailItemLabel resolve to rem, with a 12px floor.
- SwimLaneBoard count badge and corner label render at 12px or larger.
- SwimLaneBoardItem uses the body text size (0.875rem) and lets children choose their own size.
- Add SwimLaneBoard `columnMinWidth` / `columnMaxWidth` props (default `min(18rem, 82vw)` / `20rem`).

### Out of scope

- Changing the em `--bridge-font-size-*` scale or Heading sizing (em-theme-scale spec).
- Consumer migration.

## Success Criteria

- [ ] Muted nested in Card > SwimLaneBoardItem computes to at least 12px in the browser.
- [ ] One expanded lane at 390px fits fully, with about 40px of the next lane visible.
- [ ] An expanded lane never grows wider than `columnMaxWidth`.

## Specs

| Spec             | Path                            | Summary                                          |
| ---------------- | ------------------------------- | ------------------------------------------------ |
| nested-text-size | `spec/nested-text-size/spec.md` | Non-compounding text tokens and lane width props |
