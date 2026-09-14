# Tabs Line Cleanup

**Proposal:** `tabs-line-cleanup`
**Status:** done
**Phase:** [ADHD component catalog](../../ADHD.md#2-shadcn-component-catalog)

## Problem

Tabs triggers reserve a full border and the new navigation treatment uses the wrong `border-bottom` name. This produces visible rectangles, especially in dark mode, and lets icon dimensions follow source defaults.

## Scope

- Replace `border-bottom` with `line` as the navigation treatment.
- Remove every border from the default trigger.
- Give line triggers only a bottom border and primary active text.
- Fix direct trigger icon size independently from text.

## Success Criteria

- [x] Default trigger has zero border width.
- [x] Line trigger has only a bottom border.
- [x] Active line text and underline use primary color.
- [x] Direct trigger icon renders at 16px.

## Spec

`spec/tabs-variant/spec.md` amends the canonical Tabs variant contract.
