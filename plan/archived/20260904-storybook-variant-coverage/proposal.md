# Storybook Variant Coverage

**Proposal:** `storybook-variant-coverage`
**Status:** done
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

- [x] A canonical matrix records every finite generated variant axis and value.
- [x] Every matrix value is rendered in Storybook across 27 named galleries.
- [x] Story inventory test fails when a required variant story or fixture is missing.
- [x] Core state stories include disabled, invalid, checked/selected, open, loading, and destructive examples where supported.
- [x] Static Storybook build passes.
- [x] All 90 default and variant stories pass Chromium and accessibility execution.

## Specs

| Spec               | Path                              | Summary                                                                             |
| ------------------ | --------------------------------- | ----------------------------------------------------------------------------------- |
| storybook-contract | `spec/storybook-contract/spec.md` | Amends the canonical catalog contract with exhaustive finite variant-axis coverage. |

## References

- [Canonical Storybook contract](../spec/storybook-contract/spec.md)
- [Archived Phase 3](../archived/20260904-phase-3-testable-storybook/)
