import type { CSSProperties } from "react"

import {
  FractalGlassRuntime,
  type FractalGlassMediaType,
  type FractalGlassRuntimeProps
} from "../stylex-support/fractal-glass-runtime"
import { WebGLSurface } from "../stylex-support/webgl-surface"

export type { FractalGlassMediaType }

export type FractalGlassProps = FractalGlassRuntimeProps & {
  className?: string
  style?: CSSProperties
  label?: string
}

/**
 * A shader-driven refracted-glass image/video surface. `imageSrc` supplies
 * both the WebGL texture for image media and the always-available accessible
 * static fallback; caller media selection, copy, and layout remain external.
 */
export function FractalGlass({
  imageSrc,
  className,
  style,
  label = "Bridge UI refracted glass image",
  ...prop
}: FractalGlassProps) {
  return (
    <WebGLSurface className={className} style={style} imageSrc={imageSrc} label={label}>
      <FractalGlassRuntime imageSrc={imageSrc} {...prop} />
    </WebGLSurface>
  )
}
