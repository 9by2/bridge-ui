# Catalog Bundle Splitting

**Proposal:** `catalog-bundle-splitting`
**Status:** completed
**Phase:** [Foundation First](../../ADHD.md#foundation-first)

## Problem

The static component catalog emits JavaScript chunks above Vite's 500 kB warning threshold, slowing initial catalog delivery and obscuring bundle regressions.

## Scope

### In scope

- Split catalog-only heavyweight dependency families into cacheable chunks.
- Keep initial catalog chunks below 500 kB and reject lazy catalog assets above 900 kB.

### Out of scope

- Changes to published package output or runtime imports.
- Dependency removal and chart example redesign.

## Success Criteria

- [x] Catalog entry chunk remains below 500 kB and no lazy asset exceeds 900 kB.
- [x] Catalog build completes without chunk-size warnings.
- [x] Published package behavior remains unchanged.

## Specs

| Spec                     | Path                                    | Summary                      |
| ------------------------ | --------------------------------------- | ---------------------------- |
| catalog-bundle-splitting | `spec/catalog-bundle-splitting/spec.md` | Catalog chunk-size contract. |

## References

- [ADHD.md](../../ADHD.md)
- [Vite manual code splitting](https://vite.dev/guide/build.html)
