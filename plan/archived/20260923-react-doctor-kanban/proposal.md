# React Doctor Kanban Correctness

**Proposal:** `react-doctor-kanban`
**Status:** done

## Problem

The full React Doctor 0.9.14 scan finds conditional Hooks and render-time ref writes in the owned Kanban component. See [ADHD.md](../../ADHD.md) for package ownership and quality gates.

## Scope

- Fix confirmed Kanban correctness errors without changing the public drag contract.
- Re-scan and run the repository verification gates.
- Leave generated Shadcn and vendored catalog sources untouched.

## Success Criteria

- [x] Kanban has stable Hook order and no render-phase ref writes.
- [x] Existing drag and overlay contracts pass; full scan has no new diagnostics.

## Scan Outcome

React Doctor 0.9.14 full Vite project scan covered 1,141 files without skipped checks. Score improved 54 to 62; errors 27 to 18; warnings 160 to 158. Nine owned Kanban errors disappeared. Remaining errors are in generated Shadcn source and vendored catalog examples; the generated component is CLI-owned, while vendored examples are not package runtime. Other warnings need separate evidence or design review, not mechanical edits.

The React Doctor CLI must run under Node here: launching through Bun fails on `child.channel?.unref`. The first parallel `bun test` collided with the package build removing `dist`; sequential rerun passed.

## Specs

| Spec                   | Path                                  | Summary                                  |
| ---------------------- | ------------------------------------- | ---------------------------------------- |
| kanban-render-contract | `spec/kanban-render-contract/spec.md` | Render and drag behavior remains stable. |
