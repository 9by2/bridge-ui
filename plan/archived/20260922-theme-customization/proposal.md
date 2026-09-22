# Theme Customization

**Proposal:** `theme-customization`
**Status:** in-progress
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

Bridge UI themes currently select package-owned palettes but do not offer a supported consumer contract for custom brand colors, global radius, or density. Most shared geometry is fixed in component recipes.

## Scope

### In scope

- Add typed, scoped color, radius, spacing, and density customization to `Theme`.
- Migrate P0 owned controls and surfaces to public semantic CSS variables.
- Preserve nested-theme and package portal behavior.
- Document setup and supported P0 coverage in `CUSTOMIZATION.md`, linked from `README.md`.

### Out of scope

- Consumer application migration.
- Manual edits to generated Shadcn source.
- Customization coverage for every component family in this release.

## Success Criteria

- [x] `Theme` exposes scoped `theme` and `density` public APIs.
- [x] P0 components respond to documented color, radius, and spacing overrides.
- [x] Nested and portalled components retain the nearest resolved customization.
- [x] Customization setup and coverage are documented and linked from README.
- [x] Required package, catalog, coverage, and Bun.WebView gates pass.

## Specs

| Spec                | Path                               | Summary                                    |
| ------------------- | ---------------------------------- | ------------------------------------------ |
| theme-customization | `spec/theme-customization/spec.md` | Public custom theme and geometry contract. |

## References

- [ADHD.md](../../ADHD.md)
- [Customization proposal](https://artifact.9by2.workers.dev/artifact/01a0c726-e50f-7585-a436-be4bfe15e6a5/)
