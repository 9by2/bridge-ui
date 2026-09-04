# Bridge UI

Private company UI package published as `@bridge/ui`.

Read [ADHD.md](./ADHD.md) for the north star, architecture boundary, foundation gate, and implementation order.

## Current Stack

- React 19
- Base UI
- Shadcn
- Bun
- TypeScript
- Tailwind 4 during current transition
- Planned StyleX package build
- Planned Storybook catalog
- Planned private GitLab npm registry publication

## Current Source

- `app/component/shadcn/`: generated Shadcn source; never manually edit.
- `app/component/global/`: copied presentation/domain source under cleanup.
- `app/style/`: current Cue-derived theme source.
- `cmd/`: current preview/build command.
- `plan/`: active proposal and accepted spec.

Current build is a preview application, not an importable package. Consumer migration is blocked by the foundation gate in [ADHD.md](./ADHD.md).

## Command

```bash
bun install
bun run dev
bun run build
bun lint
bun fmt
```

Additional typecheck, test, coverage, Storybook, package verification, and publish command must be added by the foundation implementation.

## Policy

- [ADHD.md](./ADHD.md): north star and ideal repository contract.
- [AGENTS.md](./AGENTS.md): agent workflow.
- [oxlint.config.ts](./oxlint.config.ts): enforceable source rule.
- [plan/](./plan/): implementation plan and spec.
