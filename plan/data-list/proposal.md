# Generic Data List

**Proposal:** `data-list`
**Status:** in-progress
**Phase:** ADHD foundation-ready reusable presentation

## Problem

Consumers hand-build list frames, loading/error/empty states, table rows, and narrow-screen adaptations. Add an owned generic composition without moving fetching, domain semantics, formatting, translations, or routing into Bridge UI.

## Scope

### In scope

- DataList status composition with optional heading and caller-owned content.
- Generic table/card responsive layouts and reusable cell presentation parts.
- Public tests, catalog examples, docs, exports, and minor changeset.

### Out of scope

- Consumer migration, fetching, retry logic, pagination, sorting, filtering, selection, and domain copy.

## Success Criteria

- [ ] Public API supports all four states and responsive labelled rows.
- [ ] Required behavior and accessibility tests pass with runtime coverage at least 90%.
- [ ] Catalog, docs, package exports, Bun.WebView evidence and quality gates pass.

## Specs

| Spec      | Path                     | Summary                                |
| --------- | ------------------------ | -------------------------------------- |
| data-list | `spec/data-list/spec.md` | DataList and cell composition contract |

## References

- `ADHD.md`
- `CUSTOMIZATION.md`
- Read-only source: bridge-web event organizer proposal list
