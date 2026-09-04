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
- `app/hook/use-mobile.ts`: generated Shadcn support.
- `app/style/global.css`: canonical primitive theme source during the Tailwind-to-StyleX transition.
- `internal/script/`: private repository verification tool.
- `test/`: repository verification test.
- `plan/`: active proposal and accepted spec.

Phase 1 removed copied application source and obsolete preview commands. The repository still has no importable package build. Consumer migration remains blocked by the foundation gate in [ADHD.md](./ADHD.md).

## Command

```bash
bun install
bun boundary
bun lint
bun fmt
bun test
bun typecheck
```

Build, coverage, Storybook, package verification, and publish commands are added in later foundation phases.

## Policy

- [ADHD.md](./ADHD.md): north star and ideal repository contract.
- [AGENTS.md](./AGENTS.md): agent workflow.
- [oxlint.config.ts](./oxlint.config.ts): enforceable source rule.
- [plan/](./plan/): implementation plan and spec.
