# Foundation Evidence

## 2026-09-21 Reconciliation

### Passing Local Package Gates

- `bun lint`: passes with ten pre-existing generated Shadcn warnings and zero errors.
- `bun run typecheck`, `bun run boundary`, `bun test`, `bun run build`,
  `bun verify:package`, and `bun run verify:tree-shaking`: pass.
- `bun run coverage:brand`: 100% for owned component gate.
- `bun run coverage:runtime`: 99.84% aggregate and 100% for the owned
  component threshold.
- `bun catalog:build`: passes.
- `bun catalog:test`: 534 Bun.WebView browser checks pass with zero failures
  in 613.91 seconds.

### Consumer Fixture Execution

- Bridge Web ran `bun cmd/spike-ui-rc.tsx` against installed registry
  `@bridge/ui@0.4.0`. This fulfills the fixture execution task but fails its
  acceptance criteria, so it is not consumer approval.
- A locally packed source tarball, installed with one shared Recharts v3
  runtime, passes the same fixture: two mixed bars, no browser error or
  unexpected network request, and no overflow at 390px. Changesets calculates
  the next immutable artifact as `0.6.0`; registry publication and an
  exact-artifact rerun remain required for approval.

### Remaining Foundation Gaps

- Bridge Web exact registry artifact proof is failing. The bounded fixture ran
  `@bridge/ui@0.4.0` and passed production SSR with no browser error or
  unexpected network request, but the matching Recharts probe found zero bars
  in all four theme/viewport scenarios. Its 390px scenarios also overflowed to
  451px. Evidence: `../bridge-web/.eval/0908-bridge-ui-rc/report.json`.
- The exact current registry artifact remains different from the passing local
  source tarball. Publish `@bridge/ui@0.6.0`, install that immutable version in
  Bridge Web with the shared Recharts v3 runtime, regenerate Bridge Web's
  lockfile, and rerun the bounded probe before approving consumer migration.

Foundation-build remains active. No consumer migration is approved.
