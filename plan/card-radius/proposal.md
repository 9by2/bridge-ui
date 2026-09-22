# Card Radius

**Proposal:** `card-radius`
**Status:** in-progress
**Phase:** [Foundation quality](../../ADHD.md#quality)

## Problem

Card geometry is fixed at the default surface radius, so consumers cannot compose square or differently rounded card surfaces through the package API.

## Scope

### In scope

- Add a Card radius prop with four ordered values.
- Keep the default radius unchanged.
- Apply the selected radius to Card compound edges.
- Add catalog coverage for the radius options.

### Out of scope

- Change global shape tokens.
- Add radius variants to other components.

## Success Criteria

- [ ] Card accepts `none`, `sm`, `default`, and `lg` radius values.
- [ ] `none` renders square Card, CardHeader, and CardFooter edges.
- [ ] Catalog presents every radius option.

## Specs

| Spec        | Path                       | Summary                              |
| ----------- | -------------------------- | ------------------------------------ |
| card-radius | `spec/card-radius/spec.md` | Card radius API and visual behavior. |

## References

- [ADHD.md](../../ADHD.md)
