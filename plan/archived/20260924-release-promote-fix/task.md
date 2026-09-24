# Tasks: Release Promote Fix

- [x] Reproduce incident and target behavior with the real Changesets CLI
- [x] Failing tests: stable MR create/update, already-published guard, no-pending skip, step failure abort, repaired state
- [x] Real-engine test: skipped RC, skipped stable, no-RC promote
- [x] Implement `cmd/promote-release.ts`
- [x] Repair `.changeset/pre.json` base 0.9.0, remove shipped `color-picker`, `package.json` 0.9.0
- [x] CI `promote` full clone; README release section; spec amended
- [x] Gates; archive
