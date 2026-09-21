# Spec: Fractal Glass

**Spec ID:** `fractal-glass`
**Proposal:** `fractal-glass`
**Status:** accepted

## Summary

`FractalGlass` is a reusable presentation component that renders a
WebGL shader-driven "fractal glass" refraction/parallax effect over a
caller-supplied image or video, with an accessible static-image fallback
when WebGL is unavailable, script fails, or the user prefers reduced
motion.

## Requirements

    10|### REQ-001: Accessible fallback always renders

**Acceptance:**

- [x] A `role="img"` element with an `aria-label` (default `"Bridge UI
refracted glass image"`, overridable via `label`) is present in the
      DOM on every render, regardless of WebGL support.
- [x] The fallback element's `background-image` resolves to the supplied
      `imageSrc`.

### REQ-002: WebGL-gated enhancement

**Acceptance:**

    20|- [x] When `getContext("webgl2")` returns a context, the Three.js mesh
      mounts inside a `SurfaceBoundary` alongside the fallback.

- [x] When `getContext("webgl2")` returns `null`/throws, only the static
      fallback renders; no Three.js renderer is constructed.
- [x] A render error inside the Three.js mesh is caught by
      `SurfaceBoundary` and the static fallback remains visible.

### REQ-003: No third-party branding in package source

**Acceptance:**

- [x] No occurrence of the string `ObsidianUI` (case-insensitive) exists
      30| in `app/component/brand/stylex/fractal-glass.tsx` or
      `app/component/brand/stylex-support/webgl-surface.tsx`.
- [x] No occurrence of `obsidianui.dev` exists in package source.
- [x] `imageSrc` has no default value; TypeScript requires callers to
      supply it.

### REQ-004: Reduced motion disables animation

**Acceptance:**

- [x] When `prefers-reduced-motion: reduce` matches, the pointer-parallax
      animation frame loop does not start (no `requestAnimationFrame`
      40| call beyond the initial static render) and, for `mediaType="video"`,
      the video element does not autoplay.

### REQ-005: Cleanup on unmount

**Acceptance:**

- [x] Unmounting cancels any pending animation frame, removes the pointer
      listener, disconnects the `ResizeObserver`, disposes the Three.js
      texture/material/geometry/renderer, and (for video) pauses and
      clears the video element source.

### REQ-006: Package export parity

**Acceptance:**

    50|- [x] `FractalGlass` is exported from the package root (`app/index.ts`).

- [x] `FractalGlass` is exported from the stable direct path
      `@bridge/ui/fractal-glass` (`package.json` `exports["./fractal-glass"]`).
- [x] `internal/catalog/example/fractal-glass/default.tsx` exists,
      imports from `"@bridge/ui"`, and exports a default `Example`
      function, satisfying `test/internal/catalog.test.ts`.

## Schema / API

```ts
type FractalGlassMediaType = "image" | "video"

    60|type FractalGlassProps = {
  imageSrc: string
  videoSrc?: string | null
  mediaType?: FractalGlassMediaType // default "image"
  stripesFrequency?: number // default 8.0
  glassStrength?: number // default 0.8
  glassSmoothness?: number // default 0.5
  parallaxStrength?: number // default 0.6
  distortionMultiplier?: number // default 8.0
  edgePadding?: number // default 0.12
    70|  label?: string // default "Bridge UI refracted glass image"
  className?: string
  style?: CSSProperties
}

function FractalGlass(props: FractalGlassProps): React.JSX.Element
```

## Examples

### Default catalog example

**Input:**
80|```tsx
<UI.FractalGlass imageSrc="https://placehold.co/1200x800" />

```

**Output:**

A full-bleed black-background panel; a static cover-fit image is visible
immediately (fallback), and where WebGL is supported, the same image
renders through the shader mesh with mouse-driven parallax distortion.

## Non-Goals

- Redesigning the shader math, uniform set, or visual effect itself.
    90|- Server-driven or app-specific media selection logic (stays with the
  consumer container).
- Full pixel-level Three.js render verification under jsdom (see
  `decision.md` DEC-004 for the accepted coverage approach).
```
