# Cue Typography

**Proposal:** `cue-typography`
**Status:** in-progress
**Phase:** [Foundation First](../../ADHD.md#foundation-first)

## Problem

Cue defines a small semantic typography API, but Bridge UI exposes only the underlying font families. Consumers cannot reuse Cue's heading scale and body rhythm through the package contract.

## Scope

### In scope

- Export Cue-compatible `Heading`, `Label`, and `Body` components from Bridge UI.
- Preserve the Cue semantic heading elements, sizes, heading family, highlight color, and body line height.
- Add catalog, documentation, package export, regression test, and patch changeset coverage.

### Out of scope

- Copying Cue application CSS, Tailwind configuration, or product content.
- Adding product-specific typography tokens or consumer migration.

## Success Criteria

- [x] Root and direct package imports expose the typography API.
- [x] Components preserve Cue semantic tags and documented typography behavior.
- [x] Catalog, documentation, and package release metadata describe the API.

## Specs

| Spec           | Path                          | Summary                             |
| -------------- | ----------------------------- | ----------------------------------- |
| cue-typography | `spec/cue-typography/spec.md` | Public typography API and behavior. |

## References

- [ADHD.md](../../ADHD.md)
- `/Users/h/dev/@talent-tech/cueeee/cue/app/component/global/typography.component.tsx`
- `/Users/h/dev/@talent-tech/cueeee/cue/app/globals.css`
