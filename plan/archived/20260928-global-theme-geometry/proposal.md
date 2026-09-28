# Global Theme Geometry

**Proposal:** `global-theme-geometry`
**Status:** done
**Phase:** ADHD.md foundation quality

## Problem

The existing Theme customizes a small P0 matrix; owned component recipes still hard-code many radii, paddings, and gaps.

## Scope

- Route owned component geometry through inherited public Theme radius and spacing scales.
- Keep intentional zero, circular, and square geometry; preserve defaults and local variants.
- Verify representative computed styles, portals, and published CSS.
- Do not edit generated Shadcn source or consumer applications.

## Success Criteria

- [x] Theme radius and space overrides reach owned component recipes beyond P0.
- [x] Nested themes and portal geometry retain nearest overrides.
- [x] Existing default appearance and build contracts remain intact.

## Specs

| Spec                  | Path                                 | Summary                       |
| --------------------- | ------------------------------------ | ----------------------------- |
| global-theme-geometry | `spec/global-theme-geometry/spec.md` | Geometry inheritance contract |

## References

- ADHD.md
- plan/spec/theme-customization/spec.md
