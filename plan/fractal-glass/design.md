# Design: Fractal Glass

## Overview

Port the existing untracked `fractal-glass.tsx` + `lib-webgl-surface.tsx`
prototype into a real `@bridge/ui` reusable presentation component:
package-owned Bridge branding, promoted shared helper, and full
package-contract wiring. The Three.js shader logic itself (vertex/fragment
shader, uniform wiring, pointer parallax, resize, image/video texture load)
is preserved verbatim from the captured source — this is a productionization
pass, not a redesign of the visual effect.

## Architecture

    10|```mermaid

flowchart LR
Consumer["Application container"] --> Contract["FractalGlass prop (imageSrc, videoSrc, label, tuning)"]
Contract --> Component["FractalGlass (app/component/brand/stylex/fractal-glass.tsx)"]
Component --> Support["WebGLSurface + useEffectReducedMotion (stylex-support/webgl-surface.tsx)"]
Support -->|WebGL unavailable or SSR| Fallback["role=img background-image fallback"]
Support -->|WebGL available| ThreeScene["Three.js shader parallax scene"]
Consumer --> Business["Media selection, caption/i18n, layout sizing"]

````

## Components

    20|| Component | Responsibility | Location |
| --- | --- | --- |
| `FractalGlass` | Public component: composes `WebGLSurface` + the shader-driven parallax mesh | `app/component/brand/stylex/fractal-glass.tsx` |
| `WebGLSurface` | WebGL-availability detection, error boundary, accessible `role="img"` fallback, `Theme`-scoped container | `app/component/brand/stylex-support/webgl-surface.tsx` |
| `useEffectReducedMotion` | `useSyncExternalStore`-based `prefers-reduced-motion` read | same file |

## Data Flow

1. Consumer renders `<FractalGlass imageSrc={url} />` (or `videoSrc` +
   `mediaType="video"`), optionally overriding `label`, shader tuning
   30|(`stripesFrequency`, `glassStrength`, etc.), `className`, `style`.
2. `WebGLSurface` synchronously checks `supportsWebGL()`; if unsupported,
   only the accessible `role="img"` background-image fallback renders.
3. If supported, `WebGLSurface` also renders the fallback (as
   `aria-hidden` background layer) plus an `SurfaceBoundary`-wrapped
   Three.js mesh on top; any render error inside the boundary falls back
   to the same static image.
4. Inside the mesh, `useEffectReducedMotion` gates the animation loop and
   pointer-driven parallax; reduced motion renders one static frame.
5. Consumer owns media selection, caption/alt copy translation, and
   40|container sizing (`className`/`style` passthrough); the package owns
   shader math, WebGL lifecycle, and the accessible fallback contract.

## Example Code

```tsx
// app/component/brand/stylex-support/webgl-surface.tsx (excerpt — ported,
// ObsidianUI branding removed)
import { Component, useSyncExternalStore, type CSSProperties, type ReactNode } from "react"

import { cn } from "cn"

    50|const subscribeMotion = (notify: () => void): (() => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", notify)
  return () => query.removeEventListener("change", notify)
}

export function useEffectReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    60|    () => true
  )
}

let webglAvailable: boolean | undefined
function supportsWebGL(): boolean {
  if (webglAvailable !== undefined) return webglAvailable
  try {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("webgl2")
    webglAvailable = Boolean(context)
    70|    context?.getExtension("WEBGL_lose_context")?.loseContext()
  } catch {
    webglAvailable = false
  }
  return webglAvailable
}

export function WebGLSurface({
  children,
  className,
  style,
    80|  imageSrc,
  label = "Bridge UI visual effect"
}: {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  imageSrc?: string
  label?: string
}) {
  const supported = useSyncExternalStore(
    90|    () => () => {},
    supportsWebGL,
    () => false
  )
  const fallback = (
    <div
      role="img"
      aria-label={label}
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: imageSrc ? `url(${JSON.stringify(imageSrc)})` : undefined }}
   100|    />
  )
  return (
    <div className={cn("relative isolate h-[28rem] w-full overflow-hidden bg-black", className)} style={{ containerType: "size", ...style }}>
      {fallback}
      {supported && <SurfaceBoundary fallback={fallback}>{children}</SurfaceBoundary>}
    </div>
  )
}
````

```tsx
   110|// app/component/brand/stylex/fractal-glass.tsx (excerpt — public seam)
import { WebGLSurface } from "../stylex-support/webgl-surface"

export type FractalGlassProps = GlassStripParallaxProps & { className?: string; style?: CSSProperties; label?: string }

export function FractalGlass({ imageSrc, className, style, label, ...props }: FractalGlassProps) {
  return (
    <WebGLSurface className={className} style={style} imageSrc={imageSrc} label={label}>
      <GlassStripParallax imageSrc={imageSrc} {...props} />
   120|    </WebGLSurface>
  )
}
```

## Risk & Mitigation

| Risk                                                                                                                    | Mitigation                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Three.js render loop is unreachable/untestable under jsdom, risking a coverage gate failure                             | `vi.mock("three", ...)` with a minimal fake covering every constructor/method this component calls (DEC-004); assert the mesh mounts and the animation frame/cleanup path executes. |
| Deleting `internal/catalog/lib-webgl-surface.tsx` breaks nothing else importing it                                      | Confirmed via repository-wide grep: only `fractal-glass.tsx` imports it; safe to delete after the move.                                                                             |
| 130                                                                                                                     |                                                                                                                                                                                     | Removing the `obsidianui.dev` default image regresses the catalog example if left unset | Catalog example explicitly supplies a `placehold.co` URL (existing convention); `imageSrc` becomes required at the type level so no caller can silently omit it. |
| `three` and `@types/three` were added to `package.json` as real runtime/dev dependencies already (see prior `git diff`) | No package.json dependency change needed for this proposal — already present.                                                                                                       |
