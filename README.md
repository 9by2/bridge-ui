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

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for scoped custom themes, supported global radius/density overrides, and component-specific styling APIs.

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for supported component customization, including Input icons.

## Command

```sh
bun install
bun fmt
bun lint
bun typecheck
bun boundary
bun test
bun coverage:runtime
bun run build
bun catalog:build
bun catalog:test
bun verify:package
bun verify:tree-shaking
```

Run `bun dev` for catalog at http://127.0.0.1:6006. `bun catalog:test` builds the static catalog and runs Bun.WebView render, accessibility, visual, interaction, and memory verification.

## Release

1. Implement on `main`, add a Changeset, and push.
2. CI creates or updates **Release @bridge/ui**.
3. Merge the release MR to verify, publish, and create the version tag.

Use `bun changeset pre enter rc` for RC release under `next`; use `bun changeset pre exit` before stable release under `latest`. Do not run `changeset version`, manually bump `package.json`, or create a release tag.

## CI

Root CI triggers `deployment/.gitlab-ci.yml`. Child CI runs source, coverage, catalog, and packed-package verification; release runs only on protected default-branch CI. `CI_JOB_TOKEN` accesses the registry. Protected `GITLAB_TOKEN` maintains release branch, merge request, and version tag.

`deployment/Dockerfile.catalog` provides Bun, Node, and Chromium for Bun.WebView. CI pins its published runtime image by digest.

## Reference

- [ADHD.md](./ADHD.md): package contract and gate.
- [AGENTS.md](./AGENTS.md): contributor workflow.
- [oxlint.config.ts](./oxlint.config.ts): source restriction.
- [plan/](./plan/): proposal and spec.
