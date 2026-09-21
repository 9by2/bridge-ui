# Tasks: Fractal Glass

Implementation order matters — complete top to bottom.

## Setup

- [x] Create proposal, design, decision, and spec.
- [x] Recreate `app/component/brand/stylex-support/webgl-surface.tsx` from
      the captured `internal/catalog/lib-webgl-surface.tsx` source, with
      ObsidianUI branding removed (DEC-001, DEC-002).

## Test

- [x] Add failing `test/component/fractal-glass.test.tsx`: accessible
      10| fallback renders with default/overridden `label`; WebGL-unavailable
      path renders only the fallback; WebGL-available path (mocked `three`,
      DEC-004) mounts the mesh, exercises pointer/resize/cleanup, and
      respects reduced motion; error inside the mesh falls back to the
      static image via `SurfaceBoundary`.
- [x] Add failing package-contract assertions in
      `test/internal/package-contract.test.ts` for `fractal-glass` root +
      direct export.
- [x] Confirm `test/internal/catalog.test.ts` fails until
      `internal/catalog/example/fractal-glass/default.tsx` exists.
      20|

## Core

- [x] Recreate `app/component/brand/stylex/fractal-glass.tsx` from the
      captured source: shader strings, `GlassStripParallax`, and the
      public `FractalGlass` wrapper, importing the promoted
      `stylex-support/webgl-surface`. Remove the `obsidianui.dev` default
      `imageSrc` and make `imageSrc` a required prop; default `label` to
      Bridge UI copy (DEC-002, DEC-003).
- [x] Delete `internal/catalog/lib-webgl-surface.tsx` (superseded by
      `stylex-support/webgl-surface.tsx`).
      30|- [x] Register root export in `app/index.ts`.
- [x] Register stable direct export `./fractal-glass` in `package.json`
      `exports`.
- [x] Run test suite; confirm the failing tests from the Test phase now
      pass.

## Catalog

- [x] Add `internal/catalog/example/fractal-glass/default.tsx` using the
      supplied Sean Sinclair image asset through Vite's `?url` handling,
      satisfying `test/internal/catalog.test.ts`.
      40|

## Integration

- [x] Add a package Changeset (`bun changeset`) describing the new
      `FractalGlass` reusable presentation family as a minor release.

## Verification

- [x] Run formatter (`bun fmt`), `bun lint`, `bun run typecheck`,
      `bun run boundary`, `bun test`, `bun run coverage:brand`,
      `bun run coverage:runtime`, catalog build (`bun catalog:build`) +
      50| `bun catalog:test`, package build (`bun run build`),
      `bun run verify:package`, `bun run verify:tree-shaking`.
- [x] Confirm 100% statement/branch/function/line coverage on the public `fractal-glass.tsx` non-Shadcn component gate; keep GPU lifecycle in tested `stylex-support/fractal-glass-runtime.ts`.
- [x] Cover the promoted WebGL support module and remove the Vitest teardown handle leak from the StyleX Vite server hook.
- [x] Replace the catalog image's restricted deep traversal with a Vite alias and confirm `bun lint` passes.
- [x] Harden the two reported catalog readiness waits and rerun both focused failures together twice.
- [x] Repository-wide grep confirms zero `ObsidianUI`/`obsidianui.dev`
      occurrences in package source.
- [x] Review every spec acceptance item in
      `spec/fractal-glass/spec.md` against the implementation.
- [x] Archive proposal per `plan/PROPOSAL.md` /
      60| `.agents/skills/archive-plan/SKILL.md` and sync
      `spec/fractal-glass/spec.md` to `plan/spec/fractal-glass/spec.md`.
- [x] Commit directly on `main` with repository title format
      (`feat(fractal-glass): add FractalGlass reusable presentation family`).
