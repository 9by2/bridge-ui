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
  the immutable artifact as `0.6.0`; it is published and verified below.

### Passing Immutable Consumer Proof

- Bridge Web installed exact registry `@bridge/ui@0.6.0` with its shared
  Recharts v3 runtime and reran `bun cmd/spike-ui-rc.tsx`.
- The bounded fixture passes: two mixed bars render in every theme/viewport
  scenario, document width is at most 390px at the 390px viewport, and
  production SSR has no browser error or unexpected network request.

Foundation-build is complete. Consumer migration is approved.
