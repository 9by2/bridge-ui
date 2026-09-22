# StyleX-Only Example

**Proposal:** `stylex-only-example`
**Status:** in-progress
**Phase:** [StyleX Bundle](../../ADHD.md#3-stylex-bundle)

## Problem

The catalog still models regular and StyleX example modes even though public package exports are StyleX. This preserves a misleading dual implementation path.

## Scope

### In scope

- Use one public StyleX module inventory for every catalog example route.
- Remove normal/candidate mode branching and implementation-switch copy.
- Keep `/style-x` as a compatibility URL that renders the same catalog implementation.

### Out of scope

- Remove existing `/style-x` verification URLs from every historical command.
- Change package component APIs.

## Success Criteria

- [ ] Root and `/style-x` example URLs use the same public StyleX modules.
- [ ] Catalog UI exposes no normal/StyleX implementation mode.
- [ ] Browser regression verifies the single mode.

## Specs

| Spec           | Path                          | Summary                                         |
| -------------- | ----------------------------- | ----------------------------------------------- |
| stylex-preview | `spec/stylex-preview/spec.md` | Defines the single StyleX catalog example mode. |

## References

- [ADHD.md](../../ADHD.md)
- [Current accepted spec](../spec/stylex-preview/spec.md)
