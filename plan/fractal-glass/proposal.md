# Fractal Glass

**Proposal:** `fractal-glass`
**Status:** in-progress
**Phase:** [ADHD.md](../../ADHD.md) — StyleX Bundle / reusable presentation family (same tier as `TimelineStep`, `WizardStep`)

## Problem

An untracked `app/component/brand/fractal-glass.tsx` and its dev-only helper
`internal/catalog/lib-webgl-surface.tsx` were added ad hoc outside the
package pattern: third-party ObsidianUI branding baked into the `aria-label`
and a hot-linked `obsidianui.dev` default image, a duplicated WebGL/reduced
motion helper living under `internal/catalog/` (a non-published,
development-only path per `README.md`), no StyleX styling, no root/direct
package export, no catalog example, and no test. Per `ADHD.md`'s Source
Boundary, published component source belongs in `app/component/`, and
"primitive implementation must not fork" duplicated helper logic across
`internal/` and `app/`.

    10|"Make it ours" means productionizing this into a real `@bridge/ui`

reusable presentation component: owned StyleX styling, Bridge UI branding
(no ObsidianUI name/URL), the shared WebGL-surface/reduced-motion helper
promoted to package source, and full package-contract wiring — the same
treatment `WizardStep` just received.

## Scope

### In scope

- New `FractalGlass` StyleX-styled component at
  `app/component/brand/stylex/fractal-glass.tsx`: a Three.js shader-driven
  20| glass-stripe parallax image/video surface with a WebGL-unavailable and
  `prefers-reduced-motion` fallback.
- Promote the shared WebGL-surface boundary and reduced-motion hook from
  `internal/catalog/lib-webgl-surface.tsx` to
  `app/component/brand/stylex-support/webgl-surface.tsx`, matching the
  `stylex-support/use-mobile.ts` precedent (package source, excluded from
  the public root/direct StyleX build entrypoint list the same way
  `use-mobile.ts` is).
- Remove all ObsidianUI branding: rename the accessible fallback label to
  Bridge UI copy, and replace the hardcoded `obsidianui.dev` default image
  30| URL with a `placehold.co` demo URL (existing catalog convention, see
  `internal/catalog/example/responsive-image/default.tsx`) or make
  `imageSrc` a required caller prop — decided in `decision.md`.
- Root (`app/index.ts`) and stable direct package export
  (`./fractal-glass` in `package.json`), mirroring `wizard-step`.
- Component catalog example at
  `internal/catalog/example/fractal-glass/default.tsx` satisfying the
  catalog inventory contract (`test/internal/catalog.test.ts`).
- Component test at `test/component/fractal-glass.test.tsx` covering
  native prop/ref pass-through, the WebGL-unavailable fallback path, and
  40| the reduced-motion hook contract, following the `use-mobile.test.tsx`
  mocking pattern.
- Package contract test updates
  (`test/internal/package-contract.test.ts`) asserting the new root/direct
  export.
- Changeset for a minor release.

### Out of scope

- Any consumer (Bridge Web / Cue) migration or adoption — package-only,
  per ADHD's foundation-first rule.
  50|- Video media path correctness beyond what the original source already
  implements — ported as-is, not redesigned.
- Full 100% branch coverage of the internal WebGL/Three.js render loop
  (jsdom has no real WebGL context); coverage targets the React-facing
  seam (props, fallback, reduced motion, cleanup), consistent with how
  `internal/pilot/*` WebGL-adjacent surfaces are treated elsewhere in this
  repository.

## Success Criteria

- [ ] `FractalGlass` renders the accessible fallback (`role="img"`,
      60| Bridge UI label, no ObsidianUI text) when WebGL is unavailable.
- [ ] No `obsidianui.dev` URL or "ObsidianUI" string remains anywhere in
      package source.
- [ ] `useEffectReducedMotion` and `supportsWebGL`/`WebGLSurface` live only
      in `app/component/brand/stylex-support/webgl-surface.tsx`; the
      `internal/catalog/lib-webgl-surface.tsx` duplicate is deleted.
- [ ] Root and stable direct (`@bridge/ui/fractal-glass`) export resolve
      in packed client/SSR fixtures.
- [ ] `internal/catalog/example/fractal-glass/default.tsx` exists and
      satisfies the catalog inventory test.
      70|- [ ] Formatter, lint, typecheck, boundary, `bun test`, brand/runtime
      coverage, catalog build + `catalog:test`, package build, packed
      client/SSR, and tree-shaking all pass.

## Specs

| Spec          | Path                         | Summary                                                            |
| ------------- | ---------------------------- | ------------------------------------------------------------------ |
| fractal-glass | `spec/fractal-glass/spec.md` | API contract, fallback behavior, and acceptance for `FractalGlass` |

## References

    80|- `app/component/brand/stylex/wizard-step.tsx` — immediate precedent for adding a new reusable presentation family with package-contract wiring

- `app/component/brand/stylex-support/use-mobile.ts` — precedent for a non-StyleX support module excluded from the public build-entrypoint glob
- `internal/catalog/example/responsive-image/default.tsx` — precedent for `placehold.co` demo imagery instead of vendor-hosted assets
