# Resizable Sheet Handle

**Proposal:** `resizable-sheet-handle`
**Status:** in-progress
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

The native resize affordance is hidden at the outer viewport edge of anchored sheets and cannot be discovered or reliably dragged.

## Scope

### In scope

- Replace native sheet resizing with a visible center-edge pointer handle.
- Preserve side-aware resize behavior.
- Keep the resized dimension controlled by the consuming composition.
- Update the catalog example and consumer documentation.

### Out of scope

- Sheet-owned persistence or local storage.
- Keyboard dimension controls.

## Success Criteria

- [ ] Resizable sheets expose a visible center-edge drag handle.
- [ ] Dragging the handle changes the dimension along its valid axis.

## Specs

| Spec            | Path                           | Summary                         |
| --------------- | ------------------------------ | ------------------------------- |
| resizable-sheet | `spec/resizable-sheet/spec.md` | Amended resize handle contract. |

## References

- [Existing spec](../spec/resizable-sheet/spec.md)
