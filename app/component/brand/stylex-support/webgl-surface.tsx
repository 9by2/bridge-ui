import * as stylex from "@stylexjs/stylex"
import { Component, useSyncExternalStore, type CSSProperties, type ReactNode } from "react"

const subscribeMotion = (notify: () => void): (() => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)")
  query.addEventListener("change", notify)
  return () => query.removeEventListener("change", notify)
}

export function useEffectReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true
  )
}

let webglAvailable: boolean | undefined
export function supportsWebGL(): boolean {
  if (webglAvailable !== undefined) return webglAvailable
  try {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("webgl2")
    webglAvailable = Boolean(context)
    context?.getExtension("WEBGL_lose_context")?.loseContext()
  } catch {
    webglAvailable = false
  }
  return webglAvailable
}
const subscribeAvailability = (): (() => void) => () => {}

/** Resets the cached feature probe for deterministic test isolation. */
export function resetWebGLAvailability(): void {
  webglAvailable = undefined
}

type SurfaceBoundaryProps = {
  children?: ReactNode
  fallback: ReactNode
}

type SurfaceBoundaryState = {
  failed: boolean
}

class SurfaceBoundary extends Component<SurfaceBoundaryProps, SurfaceBoundaryState> {
  override state: SurfaceBoundaryState = { failed: false }

  static getDerivedStateFromError(): SurfaceBoundaryState {
    return { failed: true }
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

const style = stylex.create({
  root: {
    position: "relative",
    isolation: "isolate",
    boxSizing: "border-box",
    height: "28rem",
    width: "100%",
    overflow: "hidden",
    backgroundColor: "black"
  },
  fallback: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center"
  }
})

export type WebGLSurfaceProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  imageSrc?: string
  label?: string
}

/**
 * WebGL-availability boundary for Bridge UI's shader-driven presentation
 * component (`FractalGlass`). Always renders an accessible `role="img"`
 * static fallback; when a WebGL2 context is available, also mounts the
 * caller-supplied Three.js scene wrapped in an error boundary that falls
 * back to the same static image on render failure.
 */
export function WebGLSurface({
  children,
  className,
  style: styleProp,
  imageSrc,
  label = "Bridge UI visual effect"
}: WebGLSurfaceProps) {
  const supported = useSyncExternalStore(subscribeAvailability, supportsWebGL, () => false)
  const fallbackStyle = { backgroundImage: imageSrc ? `url(${JSON.stringify(imageSrc)})` : undefined }
  const fallbackClassName = stylex.props(style.fallback).className
  const fallback = (
    <div
      role="img"
      aria-label={label}
      data-slot="webgl-surface-fallback"
      className={fallbackClassName}
      style={fallbackStyle}
    />
  )
  const errorFallback = (
    <div
      aria-hidden="true"
      data-slot="webgl-surface-error-fallback"
      className={fallbackClassName}
      style={fallbackStyle}
    />
  )

  return (
    <div
      data-slot="webgl-surface"
      data-supported={supported}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
      style={{ containerType: "size", ...styleProp }}>
      {fallback}
      {supported && <SurfaceBoundary fallback={errorFallback}>{children}</SurfaceBoundary>}
    </div>
  )
}
