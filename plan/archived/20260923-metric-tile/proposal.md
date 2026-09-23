# Metric tile

**Proposal:** `metric-tile`
**Status:** done

## Problem

The approved dashboard proposal needs a reusable presentation tile without importing reporting business logic into the package. See [ADHD.md](../../ADHD.md).

## Scope

- Required explicit visual variants and a complete catalog example.
- Theme-aware presentation, accessible loading state, stable direct and root exports.
- Documentation, behavior tests and package verification.

Out of scope: product grid, querying, formatting, migration and business data.

## Success Criteria

- [x] Every variant is demonstrated explicitly.
- [x] Package and browser quality gates pass.

## Specs

| Spec        | Path                       | Summary              |
| ----------- | -------------------------- | -------------------- |
| metric-tile | `spec/metric-tile/spec.md` | Public tile contract |
