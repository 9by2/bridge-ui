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
- `app/component/brand/`: custom TsChart, DropArea and multiselect badge treatment.
- `app/hook/use-mobile.ts`: generated Shadcn support.
- `app/style/global.css`: canonical primitive theme source during the Tailwind-to-StyleX transition.
- `internal/catalog/example/`: real package example and exact copyable source.
- `vite.config.ts` and `playwright.config.ts`: catalog and browser verification.
- `internal/script/`: private repository verification tool.
- `test/`: repository verification test.
- `plan/`: active proposal and accepted spec.

The repository builds an importable ESM package with declarations and a stable CSS export. Consumer migration remains blocked by component catalog, StyleX, private registry, and complete quality gates in [ADHD.md](./ADHD.md).

## Command

Package output is split ESM with declarations. Root named import is tree-shakeable; direct entry avoids loading unrelated module for an unbundled consumer:

```tsx
import { Button } from "@bridge/ui/button"
import { TsChart } from "@bridge/ui/ts-chart"
import { DropArea } from "@bridge/ui/drop-area"
import "@bridge/ui/style.css"
```

Other generated/brand entry is available as `@bridge/ui/component/shadcn/<name>` or `@bridge/ui/component/brand/<name>`. CSS is a shared stylesheet, not per-component tree-shaken CSS. `bun verify:tree-shaking` checks a Button-only root and direct-entry bundle. Private registry publication remains a separate unfinished foundation gate.

`bun catalog:test` builds and serves an isolated static catalog on port 6007. Long pages mount nearby preview only; leaving a preview resets its transient state. All example sections and source remain inline.

Private `internal/catalog/preview.tsx` owns creation/destruction of nearby iframe; offscreen placeholder has no browsing context. Private `source.tsx` fetches raw source only on disclosure. This catalog lifecycle does not affect application-owned TsChart state or force viewport resets on package consumers.

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

Run `bun dev` to open the entire catalog at http://127.0.0.1:6006. Each component page displays every available example inline, with a heading, description, isolated preview and source disclosure. No variant dropdown is required. Theme and mobile controls remain available.

Dark is the default theme; the theme toggle and `?theme=light` support light mode. Chart includes 16 inline examples. TsChart includes the 188-entry upstream v0.16.0 catalog plus two small Bridge compositions. Vendored source, supporting module, license and dataset attribution live under `internal/catalog/vendor/tanstack/`; this development-only source is not published with the package.

Known foundation gap: the open dropdown-menu example has a tracked expected accessibility failure for Base UI focus guards and portal landmarks. Earlier fixture contrast overrides remain visible in example source; the browser result is not proof of unmodified package accessibility. Exhaustive state, visual and numerical coverage, StyleX and registry publication remain unfinished.

## Policy

`TsChart` is a separate public wrapper for TanStack SVG, tooltip and custom renderer support. Core and React adapter remain pinned to alpha `0.16.0`. `DropArea` adapts Bridge Web's Dropzone interaction through react-dropzone, with caller-owned copy, constraint and callback; no consumer migration was performed. Brand MultiSelectValue uses primary badge styling without modifying generated source. Calendar includes two- and four-month range selection. Empty, menu, navigation, conversation, pagination and Sonner have expanded demonstration.

- [ADHD.md](./ADHD.md): north star and ideal repository contract.
- [AGENTS.md](./AGENTS.md): agent workflow.
- [oxlint.config.ts](./oxlint.config.ts): enforceable source rule.
- [plan/](./plan/): implementation plan and spec.
