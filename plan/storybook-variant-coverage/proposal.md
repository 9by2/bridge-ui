# Storybook Variant Coverage

**Proposal:** `storybook-variant-coverage`
**Status:** draft
**Phase:** Amendment to [Storybook contract](../spec/storybook-contract/spec.md)

## Problem

The Storybook catalog covers every generated module and executes every story, but most files expose only one default composition. Explicit generated visual and state variants are not all visible, so the catalog cannot support complete design review.

## Scope

### In scope

- Inventory every explicit finite variant axis in generated Shadcn source.
- Add named stories or variant galleries covering every axis value at least once.
- Cover relevant disabled, invalid, checked, selected, open, loading, and destructive states.
- Extend inventory verification to enforce the canonical variant matrix.
- Run all added stories through Chromium and accessibility checks.

### Out of scope

- Cartesian products of every variant axis.
- Arbitrary data values such as progress percentages or chart datasets.
- Responsive screenshots for every variant.
- Editing generated Shadcn source.
- StyleX integration.

## Success Criteria

- [ ] A canonical matrix records every finite generated variant axis and value.
- [ ] Every matrix value is rendered in Storybook.
- [ ] Story inventory test fails when a required variant story is missing.
- [ ] Core state stories include disabled, invalid, checked/selected, open, loading, and destructive examples where supported.
- [ ] Static Storybook build passes.
- [ ] Every default and variant story passes Chromium and accessibility execution.

## Specs

| Spec               | Path                              | Summary                                                                             |
| ------------------ | --------------------------------- | ----------------------------------------------------------------------------------- |
| storybook-contract | `spec/storybook-contract/spec.md` | Amends the canonical catalog contract with exhaustive finite variant-axis coverage. |

## References

- [Canonical Storybook contract](../spec/storybook-contract/spec.md)
- [Archived Phase 3](../archived/20260904-phase-3-testable-storybook/)
