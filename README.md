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
- Vite component catalog with Bun.WebView verification
- Planned private GitLab npm registry publication

## Current Source

- `app/component/shadcn/`: generated Shadcn source; never manually edit.
- `app/component/brand/`: custom TsChart, DropArea and multiselect badge treatment.
- `app/hook/use-mobile.ts`: generated Shadcn support.
- `app/style/component.css`: published font and narrow engine normalization entry.
- `app/style/global.css`: legacy generated/catalog baseline retained during review; no longer packaged as `style.css`.
- `internal/catalog/example/`: real package example and exact copyable source.
- `vite.config.ts`: catalog build/preview; `test/browser/`: Bun.WebView browser verification.
- `cmd/`: private repository build, verification and publication command.
- `test/`: repository verification test.
- `plan/`: active proposal and accepted spec.

The repository builds an importable ESM package with declarations and a stable CSS export. Consumer migration remains blocked by component catalog, StyleX, private registry, and complete quality gates in [ADHD.md](./ADHD.md).

## Command

## GitLab Deployment

Both pipeline contexts include `deployment/concurrency.gitlab-ci.yml` to remove inherited stage resource locks. Validation remains a required stage dependency, and package publication retains its own release lock. Private command implementation lives in `cmd/`; public package output does not include it.

Root CI retains the company runner template and triggers `deployment/.gitlab-ci.yml`. The parent job `verify-and-release` only starts the child; the child validates formatting, lint, type, boundary, test, coverage, browser and packed build. The serialized `release` job then runs only on protected default-branch CI. Package registry access uses `CI_JOB_TOKEN`; branch/MR/tag automation requires a separate protected `GITLAB_TOKEN`.

Changesets maintains a release MR on `changeset-release/main`. Merging that MR approves publication after verification; do not manually bump package.json or create a release tag. RC version publishes under `next`, stable under `latest`. CI verifies an isolated registry install/import before creating and pushing `v<version>`. Tag pipelines validate only. Publication is irreversible; retry skips an existing package version and resumes verification/tag creation. An existing tag pointing elsewhere is never overwritten. Release automation still needs live bot/registry verification.

## Release Process

### Feature

1. Sync `main`, then implement and test directly on `main`. Do not create a development branch.
2. Run `bun changeset`, select `@bridge/ui`, choose patch/minor/major and describe the change.
3. Commit the generated `.changeset/*.md` with the implementation and push `main`.
4. After verification, CI creates or updates one **Release @bridge/ui** MR containing the calculated version and changelog. Further implementation on `main` updates that same release MR.
5. Review and merge the release MR when ready. Its main pipeline verifies and publishes automatically. There is no separate Publish button.

### Release Candidate

Before merging the release MR, enter RC mode directly on synced `main`:

```sh
bun changeset pre enter rc
```

Commit `.changeset/pre.json` and push `main`. Include a pending Changeset for the release. CI updates the release MR to an RC version, for example `0.2.0-rc.0`. Merge the updated release MR to publish it under `next` and test it in an application with `bun add @bridge/ui@0.2.0-rc.0` using the private registry configuration.

For a fix, add a new Changeset and merge it normally. While pre-mode is active, the next release MR produces `0.2.0-rc.1` (or the version calculated from the new change). Do not manually run `changeset version`; the bot owns that step. Do not delete retained Changeset or edit pre-state by hand.

### Stable

After testing and approving the RC, run directly on synced `main`:

```sh
bun changeset pre exit
```

Commit the pre-state change and push `main`. CI prepares the stable release MR, for example `0.2.0`. Review its diff, confirm RC integration proof required by ADHD, and merge it. CI publishes under `latest` and creates `v0.2.0`. Without pre-mode, a normal Changeset release MR is stable directly; use the RC path for the first integration proof. Never reuse a published version.

### Administrator Setup

- Protect main and require successful verification before merging a release MR; merging is release approval.
- Add a masked, protected CI variable `GITLAB_TOKEN`: preferably a project access token for a bot with `api` and `write_repository`, role sufficient to maintain the release branch/MR and push `v*` tags. Set expiry/rotation. Never put the token in source or enable credential debugging.
- Allow the bot to push the `changeset-release/main` branch and protected `v*` tags. The bot does not merge its own MR or push main.
- Keep registry authentication on `CI_JOB_TOKEN`; no npmjs token is required. Registry endpoint is `${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/npm/` (project 872).
- Missing bot credentials fail the release job explicitly. A green verification job alone does not mean publication succeeded; inspect the child `release` log and Package Registry.
- Existing `v0.1.0` published nothing. Leave it alone and release a new Changesets-calculated version; automation will not repoint it.

Changesets CLI is pinned to 2.29.8 with changesets-gitlab 0.14.0: this integration reads the v2 prerelease state, not the v3 archived-note layout. Upgrade together only after the RC/exit regression passes.

CI gates package runtime coverage separately from command and catalog verification. Local runtime coverage reaches 100% in every metric. V8 coverage uses real Node 22.22.0 from the prebuilt catalog runtime rather than Bun's Node fallback. Historical Linux amd64 Docker proof used upstream `oven/bun:1.4.0` and passed the source sequence and 375 browser check; current Linux arm64 proof passes all 431 browser checks in the prebuilt runtime. Private registry publication remains unproven.

`deployment/Dockerfile.catalog` provides Bun 1.4.1, Node 22.22.0 and a system Chromium package that `Bun.WebView`'s `backend: { type: "chrome" }` auto-detects. Child verification pins the published amd64/arm64 service image by OCI index digest; repository CI does not build or push it. Build locally with `docker buildx build --platform linux/amd64,linux/arm64 -f deployment/Dockerfile.catalog -t registry.fountain.sellsuki.com/service/bridge-ui-catalog-runner:latest --push .`, then update the digest pin only after both platforms pass runtime verification. Use an isolated source copy and fresh `bun install --frozen-lockfile`; never reuse macOS `node_modules`. Browser binary and system dependency are prebuilt, so normal verification installs nothing extra. Normal CI never updates screenshot baselines.

## Package Command

`bun cmd/verify-pilot-budget.ts` records historical baseline/candidate Button measurements. The promoted package tree-shaking gate now measures root and direct StyleX Button at about 6.1 KB gzip with no chart/upload retention. Published `style.css` is about 77 KB raw / 16 KB gzip and contains fonts, narrow focus-guard normalization, extracted StyleX and the scoped engine adapter.

Promotion preserves recorded accessibility deviations DEC-010/011/012/018 and the scoped descendant adapter approved in DEC-013/017. `app/component/brand/stylex/adapter.css` is included in public `style.css` and applies only under `[data-pilot-theme]` or the documented Button compatibility class.

After package build, `bun cmd/build-pilot-catalog.ts` creates the isolated private A/B page at `.eval/0908-stylex-foundation/catalog/index.html`. `bun cmd/verify-pilot-catalog.ts` verifies both frame render through Bun.WebView and captures the comparison. Theme/width controls use identical copy; the candidate frame loads no baseline stylesheet. This review page is not published package source.

Private StyleX pilot verification (no export promotion): `NODE_ENV=production bun cmd/verify-pilot-browser.ts` runs Bun.WebView production hydration, form/dialog, scroll cleanup and WCAG A/AA checks. `bun cmd/verify-stylex-browser.ts` verifies compiler computed-style output. After package build, `NODE_ENV=production bun cmd/verify-pilot-style.ts` compares Button against generated output; set `PILOT_COMPONENT=input|field|dialog`, `PILOT_STATE=hover|active|focus-visible`, or `PILOT_PSEUDO=::placeholder|::file-selector-button` for the targeted matrix. Chrome and Bun.WebView are required. Evidence is written under `.eval/0908-stylex-foundation/`. The self-contained browser fixture avoids the host loopback issue; HTTP/CSP integration and full compound-state parity remain separate work.

`bun cmd/verify-component-inventory.ts` checks the StyleX migration matrix against the current component source and emits its named export inventory. It fails on missing, extra or duplicate entries, invalid TSX and unresolved wildcard/default export. Babel parses TypeScript/JSX because TypeScript 7 does not expose the former JavaScript compiler AST API. The private verifier uses Effect v4; no Effect runtime is added to React/Base UI or published component imports. The completed private candidate record lives in `plan/archived/20260909-stylex-component-foundation/`; public promotion continues in `plan/stylex-public-promotion/`.

Package build explicitly emits production JSX, independent of the build process environment. `bun test test/internal/production-jsx.test.ts` renders root/direct component output under production React and rejects development JSX runtime imports. `bun verify:package` also executes the installed tarball's Vite SSR bundle under production React. This fixes the `jsxDEV is not a function` failure found in `0.1.1-rc.0`; a new RC and consumer spike rerun are required before claiming integration success.

Package output is split ESM with declarations. Root named import is tree-shakeable; direct entry avoids loading unrelated module for an unbundled consumer:

```tsx
import { Button } from "@bridge/ui/button"
import { TsChart } from "@bridge/ui/ts-chart"
import { DropArea } from "@bridge/ui/drop-area"
import { UploadPreview } from "@bridge/ui/upload-preview"
import "@bridge/ui/style.css"
```

Other generated-compatible and brand entry remains available as `@bridge/ui/component/shadcn/<name>` or `@bridge/ui/component/brand/<name>`, but resolves to owned StyleX source where presentation was promoted. `@bridge/ui/theme` exposes the scoped `Theme`. CSS is shared, not per-component tree-shaken. Private registry publication remains unfinished.

Reusable application-neutral presentation is available from the root or stable direct entry:

- `@bridge/ui/page` provides page breadcrumb, heading, action, toolbar, and content slot.
- `@bridge/ui/data-state` provides caller-controlled neutral, loading, error, permission, and disabled state presentation. Applications own copy, icon, retry callback, and side effect.
- `@bridge/ui/table-frame` contains a caller-owned semantic table and optional mobile hint without owning column or row behavior.
- `@bridge/ui/timeline-step` provides vertical and horizontal progress presentation with caller-owned icon and copy.

Bridge Web density policy, route integration, authorization, query state, translated default copy, and workflow action remain consumer responsibilities.

`bun catalog:test` builds and serves an isolated static catalog on port 6007. Long pages mount nearby preview only; leaving a preview resets its transient state. All example sections and source remain inline.

Catalog verification runs the full `test/browser/*.test.ts` suite under `bun test` against the built catalog through `Bun.WebView`'s Chrome backend, orchestrated by `cmd/run-catalog-test.ts` (build catalog, start Vite preview on port 6007, poll readiness, run `bun test --timeout 30000 test/browser`, tear the preview server down). `bun catalog:test` reproduces the CI run locally. Bun.WebView is the sole required browser-verification gate, covering render, computed-style, accessibility (axe), screenshot diff, upload, permission, focus, keyboard and memory contracts — there is no separate Playwright gate.

Private `internal/catalog/preview.tsx` owns creation/destruction of nearby iframe; offscreen placeholder has no browsing context. Private `source.tsx` fetches raw source only on disclosure. This catalog lifecycle does not affect application-owned TsChart state or force viewport resets on package consumers.

The complete StyleX implementation covers all 70 component modules and all 69 catalog families. Public root/direct/generated-compatible paths now resolve owned StyleX source, with Direction and TsChart retaining documented identity. Validation includes 100% owned runtime coverage, slot/state/geometry parity, reduced motion, RTL, open-overlay Axe, adapter isolation, packed package and 206 chart cases. Publication and consumer migration remain separate gates.

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

Open http://127.0.0.1:6006/style-x for the retained comparison route. Both regular and StyleX routes now exercise the promoted owned source; `/style-x` keeps historical source disclosure and parity evidence. Example layout still uses utility CSS, but published component runtime does not.

Dark is the default theme; the theme toggle and `?theme=light` support light mode. Chart includes 16 inline examples. TsChart includes the 188-entry upstream v0.16.0 catalog plus two small Bridge compositions. Vendored source, supporting module, license and dataset attribution live under `internal/catalog/vendor/tanstack/`; this development-only source is not published with the package.

The open dropdown-menu example passes the unfiltered accessibility scan. Package CSS makes aria-hidden Base UI focus guards zero-area and pointer-inert without removing their tab stop. Keyboard regression verifies arrow navigation, Escape focus restoration and modal Tab redirection without retained focus on a hidden guard. Registry publication remains unfinished.

`bun coverage:brand` enforces 100% statement, branch, function and line coverage per brand component using Vitest/V8. It includes upload acceptance, rejection, extraction error, drag, disabled and cleanup behavior plus chart renderer/height and selection badge behavior. This scoped gate is not repository-wide coverage. `bun verify:tree-shaking` inspects retained module contribution and enforces an 18,000-byte gzip budget; Button measures about 16,280 gzip bytes with no chart/upload dependency retained.

## Policy

`bun coverage:runtime` measures `app/` and `shared/` at a 90% statement, branch, function and line floor, with brand coverage at 100%. Generated `app/component/shadcn/**` and the export-only `app/index.ts` barrel are excluded; hook code remains in scope. Command and catalog verification remain mandatory through Bun test, boundary, packed client/SSR, tree-shaking and Bun.WebView. This is package runtime coverage, not repository-wide coverage.

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
