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

Run `bun dev` to open the entire catalog at http://127.0.0.1:6006. Each of the 63 component pages displays every available example inline, with a heading, description, isolated preview and exact-source code disclosure. The 105 examples require no variant dropdown. Theme and mobile controls remain available.

Dark is the default theme; the theme toggle and `?theme=light` support light mode. Chart includes 16 inline examples and a wrapper option reference with a link to the complete Recharts API. Attachment includes image, video and file icon examples. The catalog now contains 121 example modules.

Known foundation gap: the open dropdown-menu example has a tracked expected accessibility failure for Base UI focus guards and portal landmarks. Earlier fixture contrast overrides remain visible in example source; the browser result is not proof of unmodified package accessibility. Exhaustive state, visual and numerical coverage, StyleX and registry publication remain unfinished.

## Policy

- [ADHD.md](./ADHD.md): north star and ideal repository contract.
- [AGENTS.md](./AGENTS.md): agent workflow.
- [oxlint.config.ts](./oxlint.config.ts): enforceable source rule.
- [plan/](./plan/): implementation plan and spec.
