# Catalog Runner Parallel

**Proposal:** `catalog-runner-parallel`
**Status:** in-progress
**Phase:** [Quality](../../ADHD.md#quality)

## Problem

The catalog browser runner schedules test files independently, while its largest generated test file remains serial. Vite preview returns intermittent HTTP failures when concurrent browser cases load heavyweight catalog assets.

## Scope

### In scope

- Run catalog browser cases with bounded test-level concurrency.
- Serve the built catalog through Bun's in-process static server.
- Retain every catalog example, accessibility, visual, interaction, and memory check.

### Out of scope

- Retrying failed tests or extending assertion deadlines.
- Changing catalog examples or package behavior.

## Success Criteria

- [ ] Catalog cases run in parallel with a bounded concurrency of four.
- [ ] Concurrent catalog asset requests do not depend on Vite preview.
- [ ] Catalog runner regression tests pass.

## Specs

| Spec                    | Path                                   | Summary                                            |
| ----------------------- | -------------------------------------- | -------------------------------------------------- |
| catalog-runner-parallel | `spec/catalog-runner-parallel/spec.md` | Browser scheduling and preview lifecycle contract. |

## References

- [Catalog CI stability](../spec/catalog-ci-stability/spec.md)
