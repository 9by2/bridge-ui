# Decisions: Fractal Glass

| ID      | Title                                                                    | Status   |
| ------- | ------------------------------------------------------------------------ | -------- |
| DEC-001 | Promote shared WebGL surface helper to `stylex-support`, not `internal/` | accepted |
| DEC-002 | Remove ObsidianUI branding; `imageSrc` becomes a required caller prop    | accepted |
| DEC-003 | Component lives directly under `stylex/`, matching `wizard-step`         | accepted |
| DEC-004 | Coverage targets the React-facing seam, not the WebGL render loop        | accepted |

---

### DEC-001: Promote shared WebGL surface helper to `stylex-support`, not `internal/`

**GIVEN** `internal/catalog/lib-webgl-surface.tsx` implements
`useEffectReducedMotion` and `WebGLSurface` (WebGL-availability detection,
10|error-boundary fallback, `Theme`-scoped root) that only `fractal-glass.tsx`
consumes, and `README.md` documents `internal/` as non-published,
development-only source
**WHEN** productionizing `FractalGlass` as a real package export
**THEN** move this helper to
`app/component/brand/stylex-support/webgl-surface.tsx`, mirroring the
existing `stylex-support/use-mobile.ts` precedent — a non-StyleX support
module imported by a `stylex/` component but not itself a public build
entrypoint — and delete the `internal/catalog/` duplicate.

---

### DEC-002: Remove ObsidianUI branding; `imageSrc` becomes a required caller prop

    20|**GIVEN** the original source hardcoded the accessible label

`"ObsidianUI visual effect"` / `"ObsidianUI refracted glass image"` and
defaulted `imageSrc` to a hot-linked `https://www.obsidianui.dev/...` asset
— a third-party vendor's branding and hosted image baked into package
source
**WHEN** implementing `FractalGlass` as Bridge UI's own component
**THEN** the fallback `role="img"` label defaults to Bridge UI copy
(`"Bridge UI refracted glass image"`) and is caller-overridable through a
`label` prop; `imageSrc` has no default and is a required prop, so no
external vendor URL ships in package source. The catalog example supplies
a `placehold.co` URL, matching `internal/catalog/example/responsive-image`.
30|
---

### DEC-003: Component lives directly under `stylex/`, matching `wizard-step`

**GIVEN** every other reusable presentation family added to this package
(`wizard-step.tsx`, `timeline-step.tsx`, `table-frame.tsx`) lives directly
at `app/component/brand/stylex/<name>.tsx` with a thin re-export at
`app/component/brand/<name>.tsx` only when the original also has a legacy
non-StyleX path (e.g. `drop-area`, `upload-preview`) — and `fractal-glass`
has no such legacy path to preserve
**WHEN** placing the new component source
**THEN** `FractalGlass` lives at
40|`app/component/brand/stylex/fractal-glass.tsx` only, exported from
`app/index.ts` and `package.json` `./fractal-glass` the same way
`wizard-step` is, with no separate `app/component/brand/fractal-glass.tsx`
wrapper.

---

### DEC-004: Full coverage through a mocked `three` module, not a real WebGL context

**GIVEN** `ADHD.md`'s Quality gate requires 100% statement/branch/
function/line coverage on every non-Shadcn component, jsdom has no real
WebGL context, and mocking only `getContext("webgl2")` to `null` would
leave the entire Three.js render path (image texture load, video texture,
pointer parallax, resize, reduced-motion skip, cleanup/dispose) permanently
uncovered
**WHEN** testing `FractalGlass`
50|**THEN** the test suite (a) mocks `getContext("webgl2")` truthy so
`WebGLSurface` mounts the Three.js branch, and separately falsy to cover
the accessible-fallback branch, and (b) `vi.mock("three", ...)` with a
minimal fake implementing only the subset this component uses
(`WebGLRenderer`, `Scene`, `OrthographicCamera`, `Vector2`, `Texture`,
`TextureLoader`, `VideoTexture`, `ShaderMaterial`, `PlaneGeometry`, `Mesh`,
filter/wrap constants) so the full render/resize/pointer/cleanup branches
execute deterministically without a real GPU context — consistent with
how `image-crop.test.tsx` mocks `HTMLCanvasElement.prototype.getContext`
and `createImageBitmap` rather than exercising real canvas/image decoding.
