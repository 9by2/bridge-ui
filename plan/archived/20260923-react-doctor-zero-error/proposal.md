# React Doctor Zero Error

**Proposal:** `react-doctor-zero-error`
**Status:** done

## Problem

The complete React Doctor scan has 18 errors: 17 in catalog vendor examples and one in CLI-generated Shadcn carousel. See [ADHD.md](../../ADHD.md) for the source boundary.

## Scope

- Correct confirmed render-phase writes and fresh dependency values in catalog examples.
- Resolve generated carousel only through permitted generation, without manual edits.
- Verify the same full scan and project gates.

## Success Criteria

- [x] Full React Doctor scan has zero errors, without suppressing correctness rules.
- [x] Catalog and package gates pass.

## Outcome

React Doctor 0.9.14 full scan: zero errors, 154 warnings, score 65, complete with no skipped checks. The generated carousel is refreshed through `bun cmd/refresh-shadcn-carousel.ts`; the command fetches the registry item, checks its expected source, applies the missing `reInit` unsubscribe, and passes the result to `shadcn add`. The CLI remains the writer of the generated file.

## Specs

| Spec                  | Path                                 | Summary                                       |
| --------------------- | ------------------------------------ | --------------------------------------------- |
| catalog-render-purity | `spec/catalog-render-purity/spec.md` | Catalog example refs reflect committed state. |
