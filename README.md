# Bridge UI

Private company UI package published as `@bridge/ui`.

Read [ADHD.md](./ADHD.md) for architecture, foundation gate, and migration order. Read [AGENTS.md](./AGENTS.md) for contributor rule.

## Stack

- React 19, Base UI, Shadcn, TypeScript, and Bun
- Static StyleX package build
- Vite catalog with Bun.WebView verification
- GitLab npm registry release through Changesets

## Source

- `app/component/shadcn/`: generated Shadcn source.
- `app/component/brand/`: owned presentation component.
- `app/style/component.css`: published CSS entry.
- `app/style/global.css`: private catalog baseline; not packaged.
- `internal/catalog/`: private catalog source and example.
- `cmd/`: build, verification, and publication command.
- `test/`: repository test.
- `plan/`: active proposal and accepted spec.

The repository publishes ESM, declaration, source map, and `@bridge/ui/style.css`.

## Use

```tsx
import { Button } from "@bridge/ui/button"
import { DropArea } from "@bridge/ui/drop-area"
import { TsChart } from "@bridge/ui/ts-chart"
import "@bridge/ui/style.css"
```

Root import and stable direct entry are supported. Compatible generated entry remains available at `@bridge/ui/component/shadcn/<name>`.

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for scoped custom themes, supported global radius/density overrides, Input icons, and component-specific styling APIs.

## Command

```sh
bun install
bun hooks:install
bun fmt
bun lint
bun typecheck
bun boundary
bun test
bun coverage:runtime
bun run build
bun catalog:build
bun catalog:test
bun catalog:test:visual
bun catalog:test:memory
bun verify:package
bun verify:tree-shaking
```

Run `bun dev` for catalog at http://127.0.0.1:6006. `bun catalog:build` compiles every example. `bun catalog:test` runs compact Bun.WebView contracts for catalog shell, render pipeline, accessibility archetypes, focus, upload and responsive behavior before push. `bun catalog:test:visual` and `bun catalog:test:memory` run explicit diagnostics for relevant visual/lifecycle work and release verification. Run `bun hooks:install` once after cloning; `git push --no-verify` explicitly bypasses the compact browser gate.

## Release

`main` is always in Changesets RC mode (`.changeset/pre.json`).

1. Merge a feature MR with a Changeset into `main`.
2. `main` CI opens or updates **Release @bridge/ui (rc)**. Merge it to publish `x.y.z-rc.N` under `next` and tag it. Skipping an RC is fine: leave the MR open, and later changesets are added to it.
3. When ready for stable, run the manual **`promote`** job on the latest `main` pipeline. It releases every changeset pending on `main`, so skipped RCs (or no RC at all) are fine. It opens or updates **Release @bridge/ui x.y.z (stable)**.
4. Merge the stable MR to publish `x.y.z` under `latest` and tag `vx.y.z`. `main` returns to RC mode with `x.y.z` as the new base. To skip a stable release, close the MR; the next `promote` rebuilds it from current `main`.

Do not run `changeset version`, bump `package.json`, edit `.changeset/pre.json`, or create a release tag by hand.

## CI

Root CI triggers `deployment/.gitlab-ci.yml`. Child CI runs source, coverage, static catalog build, and packed-package verification; compact Bun.WebView contracts run locally before push. Release runs only on protected default-branch CI. `CI_JOB_TOKEN` accesses the registry. Protected `GITLAB_TOKEN` maintains release branch, merge request, and version tag.

`deployment/Dockerfile.catalog` provides Bun, Node, and Chromium for Bun.WebView. CI pins its published runtime image by digest.

## Reference

- [ADHD.md](./ADHD.md): package contract and gate.
- [AGENTS.md](./AGENTS.md): contributor workflow.
- [oxlint.config.ts](./oxlint.config.ts): source restriction.
- [plan/](./plan/): proposal and spec.
