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

`main` uses normal Changesets mode. Every package change needs a changeset.

1. Merge a feature MR with a Changeset into `main`.
2. Protected `main` CI automatically opens or updates **Release @bridge/ui** with the next stable version and all pending changesets.
3. Merge the release MR to publish `x.y.z` under `latest` and tag `vx.y.z`. If another feature lands first, CI updates the release MR with its changeset.

Do not run `changeset version`, bump `package.json`, or create a release tag by hand.

### Public npm mirror

GitLab stays the version authority. When the release MR merge is mirrored to GitHub `9by2/bridge-ui`, `.github/workflows/release.yml` verifies it. It then publishes the same version publicly as `@9by2/bridge-ui` on npmjs.org with provenance and creates GitHub Release `vX.Y.Z`. Already-published versions are skipped. Pull requests to GitHub `main` run verification only.

```sh
npm install @9by2/bridge-ui
```

```tsx
import { Button } from "@9by2/bridge-ui/button"
import "@9by2/bridge-ui/style.css"
```

Setup: create the `@9by2` npm organization and add an npm automation (or granular publish) token as the GitHub repository secret `NPM_TOKEN`.

## CI

Root CI triggers `deployment/.gitlab-ci.yml`. Child CI runs source, coverage, static catalog build, and packed-package verification; compact Bun.WebView contracts run locally before push. Release runs only on protected default-branch CI. `CI_JOB_TOKEN` accesses the registry. Protected `GITLAB_TOKEN` maintains the release branch, merge request, and version tag.

`deployment/Dockerfile.catalog` provides Bun, Node, and Chromium for Bun.WebView. CI pins its published runtime image by digest.

## Reference

- [ADHD.md](./ADHD.md): package contract and gate.
- [AGENTS.md](./AGENTS.md): contributor workflow.
- [oxlint.config.ts](./oxlint.config.ts): source restriction.
- [plan/](./plan/): proposal and spec.
