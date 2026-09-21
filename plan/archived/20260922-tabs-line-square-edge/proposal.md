# Tabs Line Square Edge

**Proposal:** `tabs-line-square-edge`
**Status:** done
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

Horizontal line Tabs triggers retain the default rounded corner radius rather than matching the square-edged line treatment.

## Scope

### In scope

- Set horizontal line Tabs triggers to a zero border radius.
- Verify the rendered browser contract.

### Out of scope

- Changes to default, capsule, link, or vertical Tab presentations.

## Success Criteria

- [x] A horizontal line Tab trigger has a computed `0px` border radius.

## Specs

| Spec                  | Path                                 | Summary                              |
| --------------------- | ------------------------------------ | ------------------------------------ |
| tabs-line-square-edge | `spec/tabs-line-square-edge/spec.md` | Horizontal line Tab radius contract. |
