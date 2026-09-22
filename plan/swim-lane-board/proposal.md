# Swim Lane Board

**Proposal:** `swim-lane-board`
**Status:** in-progress
**Phase:** Foundation-ready reusable presentation component

## Problem

Bridge applications need a Linear-inspired Kanban/Scrum board without copying product workflow, CRM policy, or Event Proposal rules into `@bridge/ui`.

## Scope

### In scope

- Theme-token-driven board with optional row lanes and no-lane mode.
- Controlled and uncontrolled column collapse; lanes remain static.
- Default auto-collapse for zero-count columns.
- Row-local overflow with a configurable `rowMaxHeight` defaulting to `66vh`.
- Sticky column and lane headers while their scroll axis moves.
- Cross-coordinate drag intent callback without persistence.
- Catalog, behavioral tests, documentation, direct export, and minor changeset.

### Out of scope

- Data querying, virtualisation, filter controls, mutation, authorization, or a drag-and-drop dependency.
- Bridge Web or CRM consumer migration.

## Success Criteria

- [x] Board follows `Theme` semantic colors in light and dark modes.
- [x] Empty columns collapse by default and user toggles report controlled state.
- [x] Lane content scrolls within `rowMaxHeight` while column and lane headers remain sticky.
- [x] Dragging an item to another lane/status reports a coordinate move intent.
- [ ] Package, catalog, browser, coverage, and quality gates pass.

## Specs

| Spec            | Path                           | Summary                             |
| --------------- | ------------------------------ | ----------------------------------- |
| swim-lane-board | `spec/swim-lane-board/spec.md` | Public compound component contract. |

## References

- `ADHD.md`
- Swim Lane Board artifact: `01a0c7c3-c457-789c-ab07-d2096ff24561`
