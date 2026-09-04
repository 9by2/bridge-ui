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

The repository builds an importable ESM package with declarations and a stable CSS export. Consumer migration remains blocked by Storybook, StyleX, private registry, and complete quality gates in [ADHD.md](./ADHD.md).

## Command

```bash
bun install
bun boundary
bun run build
bun lint
bun fmt
bun test
bun typecheck
bun verify:package
```

Coverage, Storybook, and publish commands are added in later foundation phases.

## Policy

- [ADHD.md](./ADHD.md): north star and ideal repository contract.
- [AGENTS.md](./AGENTS.md): agent workflow.
- [oxlint.config.ts](./oxlint.config.ts): enforceable source rule.
- [plan/](./plan/): implementation plan and spec.
