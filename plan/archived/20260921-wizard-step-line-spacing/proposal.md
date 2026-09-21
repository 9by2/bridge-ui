# Wizard Step Line Spacing

**Proposal:** `wizard-step-line-spacing`
**Status:** done
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

The WizardStep segmented line variant is visually too thick and its segments touch, unlike the supplied reference.

## Scope

### In scope

- Reduce horizontal line-segment height.
- Add space between adjacent horizontal line segments.
- Verify rendered geometry through Bun.WebView.

### Out of scope

- Changes to number, dot, or vertical presentations.

## Success Criteria

- [x] Line segments are 6px high.
- [x] Adjacent horizontal line segments have an 8px gap.

## Specs

| Spec                     | Path                                    | Summary                                   |
| ------------------------ | --------------------------------------- | ----------------------------------------- |
| wizard-step-line-spacing | `spec/wizard-step-line-spacing/spec.md` | Line variant sizing and spacing contract. |

## References

- Supplied segmented progress reference.
