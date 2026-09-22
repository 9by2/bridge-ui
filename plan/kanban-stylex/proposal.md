# Kanban StyleX

**Proposal:** `kanban-stylex`
**Status:** in-progress
**Phase:** Foundation-ready reusable presentation component

## Problem

The supplied generic Kanban is outside the package StyleX, export, catalog, documentation, and verification contract.

## Scope

### In scope

- Move the reusable controlled Kanban compound component into the StyleX source boundary.
- Add public exports, catalog coverage, behavior tests, documentation, and a minor changeset.

### Out of scope

- Product persistence, domain transition policy, or consumer migration.
- Replacing the existing `SwimLaneBoard` contract.

## Success Criteria

- [ ] Kanban styling uses Bridge semantic tokens through StyleX.
- [ ] Controlled reordering and optional move intent remain package-owned behavior.
- [ ] Public export, catalog example, tests, and documentation exist.

## Specs

| Spec   | Path                  | Summary                                                |
| ------ | --------------------- | ------------------------------------------------------ |
| kanban | `spec/kanban/spec.md` | Generic controlled Kanban compound component contract. |

## References

- `ADHD.md`
- `app/component/brand/stylex/swim-lane-board.tsx`
