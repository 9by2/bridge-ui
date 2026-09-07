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
- `cmd/`: private repository build, verification and publication command.
- `test/`: repository verification test.
- `plan/`: active proposal and accepted spec.

The repository builds an importable ESM package with declarations and a stable CSS export. Consumer migration remains blocked by component catalog, StyleX, private registry, and complete quality gates in [ADHD.md](./ADHD.md).

## Command

## GitLab Deployment

Both pipeline contexts include `deployment/concurrency.gitlab-ci.yml` to remove inherited stage resource locks. Validation remains a required stage dependency, and package publication retains its own release lock. Private command implementation lives in `cmd/`; public package output does not include it.

Root CI retains the company runner template and triggers `deployment/.gitlab-ci.yml`. The full company Bun pipeline includes service Docker/Kubernetes jobs, so this package uses its runner-only template instead. The child validates formatting, lint, type, boundary, test, coverage, browser and packed build. Package deployment uses runner-provided `CI_JOB_TOKEN` against `${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/npm/` (this project: 872); no personal token is needed.

Publication requires a protected prerelease tag matching package.json (for example version `0.1.1-rc.1` and tag `v0.1.1-rc.1`), passing validation and manual approval of `publish`. It publishes under `next`, then installs/imports the registry package in an isolated fixture. Configure protected `v*` tags in GitLab before release. No `latest` path exists. A failed post-publish install does not undo publication.

Repository coverage currently blocks publication. Linux amd64 Docker reproduction passes the source job and all 375 browser checks with the Linux screenshot baseline. V8 coverage requires real Node: `cmd/install-ci-node.sh` installs checksum-verified Node 22.22.0 before Bun dependency installation. The original Bun-only image falls back to Bun for Node tooling and crashes during coverage merging. Repository coverage now executes but remains below 90%. These fixes still need a remote rerun; private mirror access was unavailable locally, so Docker verification used upstream `oven/bun:1.4.0`.

`deployment/Dockerfile.verify` provides Bun 1.4.1 plus Node 22.22.0 for local Linux verification. CI uses the same Bun version. Build with `docker build --platform linux/amd64 -f deployment/Dockerfile.verify -t bridge-ui-verify .`. Use an isolated source copy and fresh `bun install --frozen-lockfile`; never reuse macOS node_modules. Install Chromium with `bunx playwright install --with-deps chromium`, then run the command sequence in the child CI file. Normal CI never updates screenshot expectations.

## Package Command

Package output is split ESM with declarations. Root named import is tree-shakeable; direct entry avoids loading unrelated module for an unbundled consumer:

```tsx
import { Button } from "@bridge/ui/button"
import { TsChart } from "@bridge/ui/ts-chart"
import { DropArea } from "@bridge/ui/drop-area"
import { UploadPreview } from "@bridge/ui/upload-preview"
import "@bridge/ui/style.css"
```

Other generated/brand entry is available as `@bridge/ui/component/shadcn/<name>` or `@bridge/ui/component/brand/<name>`. CSS is a shared stylesheet, not per-component tree-shaken CSS. `bun verify:tree-shaking` checks a Button-only root and direct-entry bundle. Private registry publication remains a separate unfinished foundation gate.

`bun catalog:test` builds and serves an isolated static catalog on port 6007. Long pages mount nearby preview only; leaving a preview resets its transient state. All example sections and source remain inline.

Private `internal/catalog/preview.tsx` owns creation/destruction of nearby iframe; offscreen placeholder has no browsing context. Private `source.tsx` fetches raw source only on disclosure. This catalog lifecycle does not affect application-owned TsChart state or force viewport resets on package consumers.

`bun verify:package` checks all 71 public entry paths from an isolated Bun-installed tarball with declaration checking enabled, then builds the Vite client and SSR fixture. Emitted declaration uses relative package-local import, not private source alias. The Chromium memory regression repeats chart navigation eight times without page reload and checks post-GC heap/DOM growth after warmup; it does not measure total browser process memory.

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

The open dropdown-menu example passes the unfiltered accessibility scan. Package CSS makes aria-hidden Base UI focus guards zero-area and pointer-inert without removing their tab stop; the example places its portaled menu inside a named region using the supported render prop. Axe incomplete output is retained as review evidence, not claimed as a clean manual accessibility audit. A separate keyboard regression verifies arrow navigation, Escape focus restoration and modal Tab redirection without retained focus on a hidden guard. Earlier fixture contrast overrides remain visible in example source; exhaustive state, visual and repository coverage, StyleX and registry publication remain unfinished.

`bun coverage:brand` enforces 100% statement, branch, function and line coverage per brand component using Vitest/V8. It includes upload acceptance, rejection, extraction error, drag, disabled and cleanup behavior plus chart renderer/height and selection badge behavior. This scoped gate is not repository-wide coverage. `bun verify:tree-shaking` inspects retained module contribution and enforces an 18,000-byte gzip budget; Button measures about 16,280 gzip bytes with no chart/upload dependency retained.

## Policy

`bun coverage:repository` excludes generated `app/component/shadcn/**` from the percentage, not catalog, accessibility or integration verification. The owned repository floor remains 90%, with brand coverage at 100%. Owned command and catalog source remain in scope; excluding generated source alone does not establish a passing gate.

Upload composition is available from root import or `@bridge/ui/upload-viewer`, `@bridge/ui/upload-list` and `@bridge/ui/image-crop`:

- `UploadViewer`: controlled dialog for image/video/audio/PDF, with metadata/download fallback, caller-owned URL and optional `finalFocus` target. PDF inline support depends on the browser; download remains available. Only HTTP(S), blob and root-relative URL are linked.
- `UploadPreview`: caller-owned queued/uploading/success/error/cancelled state, actual progress and retry/cancel callback. No automatic transfer or fabricated progress.
- `UploadList`: controlled local File or remote URL metadata, cumulative count/byte limit, per-file rejection callback and feedback announcement. Removal returns focus to the selection trigger. Caller supplies translated copy and size formatting.
- `ImageCrop`: drag or keyboard position, zoom, 90-degree rotation and square/original/3:1 banner ratio. Apply emits a PNG with width 768px; upload remains a separate caller action. Bitmap cleanup occurs on replacement/unmount.

The catalog demonstrates existing attachment, preview focus restoration, static transfer state and separate crop/apply/upload. Packed verification now resolves 79 public entry. These additions do not complete the repository-wide foundation gate.

`UploadPreview` packages an Item row with MIME-specific image/video/audio/PDF/file icon, optional thumbnail, filename, caller-formatted size/status and accessible preview/remove callback buttons. Compose it beside DropArea; the caller owns file selection, preview URL and actual upload. The catalog uses this public component rather than a private filename row.

`TsChart` is a separate public wrapper for TanStack SVG, tooltip and custom renderer support. Core and React adapter remain pinned to alpha `0.16.0`. `DropArea` adapts Bridge Web's Dropzone interaction through react-dropzone, with caller-owned copy, constraint and callback; no consumer migration was performed. Brand MultiSelectValue uses primary badge styling without modifying generated source. Calendar includes two- and four-month range selection. Empty, menu, navigation, conversation, pagination and Sonner have expanded demonstration.

- [ADHD.md](./ADHD.md): north star and ideal repository contract.
- [AGENTS.md](./AGENTS.md): agent workflow.
- [oxlint.config.ts](./oxlint.config.ts): enforceable source rule.
- [plan/](./plan/): implementation plan and spec.
