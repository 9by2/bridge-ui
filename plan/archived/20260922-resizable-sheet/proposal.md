# Resizable Sheet

**Proposal:** `resizable-sheet`
**Status:** in-progress
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

Consumers need a sheet whose dimension can be adjusted without composing a separate resizable panel around the dialog primitive.

## Scope

### In scope

- Add an opt-in resizable `SheetContent` variant.
- Add a catalog example for the variant.
- Document the public API and behavior.

### Out of scope

- Change default sheet sizing.
- Add application-specific persistence for a resized dimension.

## Success Criteria

- [ ] Side sheets expose browser-native resize behavior only when requested.
- [ ] The catalog includes an interactive resizable sheet example.
- [ ] The public behavior is covered by a component test.

## Specs

| Spec            | Path                           | Summary                          |
| --------------- | ------------------------------ | -------------------------------- |
| resizable-sheet | `spec/resizable-sheet/spec.md` | Resizable SheetContent contract. |

## References

- [ADHD.md](../../ADHD.md)
- [Sheet source](../../app/component/brand/stylex/sheet.tsx)
