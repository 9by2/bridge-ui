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
- Vite component catalog with Playwright verification
- Planned private GitLab npm registry publication

## Current Source

- `app/component/shadcn/`: generated Shadcn source; never manually edit.
- `app/hook/use-mobile.ts`: generated Shadcn support.
- `app/style/global.css`: canonical primitive theme source during the Tailwind-to-StyleX transition.
- `internal/catalog/example/`: real package example and exact copyable source.
- `vite.config.ts` and `playwright.config.ts`: catalog and browser verification.
- `internal/script/`: private repository verification tool.
- `test/`: repository verification test.
- `plan/`: active proposal and accepted spec.

The repository builds an importable ESM package with declarations and a stable CSS export. Consumer migration remains blocked by component catalog, StyleX, private registry, and complete quality gates in [ADHD.md](./ADHD.md).

## Command

```bash
bun install
bun boundary
bun run build
bun lint
bun fmt
bun test
bun typecheck
bun dev
bun catalog:build
bun catalog:test
bun verify:package
```

Run `bun dev` to open the entire catalog at http://127.0.0.1:6006. It includes 63 component entries and 105 selectable examples, isolated preview, comparison, code copying, theme and mobile controls.

Known foundation gap: the open dropdown-menu example has a tracked expected accessibility failure for Base UI focus guards and portal landmarks. Earlier fixture contrast overrides remain visible in example source; the browser result is not proof of unmodified package accessibility. Exhaustive state, visual and numerical coverage, StyleX and registry publication remain unfinished.

## Policy

- [ADHD.md](./ADHD.md): north star and ideal repository contract.
- [AGENTS.md](./AGENTS.md): agent workflow.
- [oxlint.config.ts](./oxlint.config.ts): enforceable source rule.
- [plan/](./plan/): implementation plan and spec.
