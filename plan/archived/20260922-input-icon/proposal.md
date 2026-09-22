# Input Icon

**Proposal:** `input-icon`
**Status:** in-progress
**Phase:** [ADHD quality gate](../../ADHD.md)

## Problem

Consumers need a concise way to display a decorative leading icon in an Input without manually composing an InputGroup.

## Scope

### In scope

- Add a leading `icon` prop to the owned Input component.
- Document Input and InputGroup icon setup in CUSTOMIZATION.md.
- Add a catalog example and public-contract regression test.

### Out of scope

- Trailing or interactive input controls.
- Changes to generated Shadcn source.

## Success Criteria

- [ ] Input icon renders as decorative content without changing native input behavior.
- [ ] Customization guide and README document the supported setup.
- [ ] Catalog, test, typecheck, and package build pass.

## Specs

| Spec       | Path                      | Summary                          |
| ---------- | ------------------------- | -------------------------------- |
| input-icon | `spec/input-icon/spec.md` | Leading Input icon API contract. |

## References

- [ADHD.md](../../ADHD.md)
- [InputGroup](../../app/component/brand/stylex/input-group.tsx)
