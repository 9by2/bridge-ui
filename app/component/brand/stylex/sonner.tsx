import * as stylex from "@stylexjs/stylex"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
import type { CSSProperties } from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { themeMode, useBridgeTheme, useThemeMode } from "./theme"
import { geometryToken, themeToken, token } from "./token.stylex"

/**
 * DEC-009: Sonner reads the nearest Bridge `Theme` mode instead of an external
 * provider. `light` maps to Sonner light; `dark`, `cue`, and `future` map to Sonner
 * dark, since all three are dark-scheme semantic layers.
 */
function sonnerTheme(mode: ReturnType<typeof useThemeMode>): "light" | "dark" {
  return mode === themeMode.light ? "light" : "dark"
}

const spin = stylex.keyframes({ to: { rotate: "360deg" } })
const style = stylex.create({
  icon: { width: 16, height: 16 },
  loading: {
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationPlayState: { default: "running", "@media (prefers-reduced-motion: reduce)": "paused" }
  }
})
export function Toaster({ theme, ...props }: ToasterProps) {
  const mode = useThemeMode()
  const bridgeTheme = useBridgeTheme()
  const resolvedTheme = theme ?? sonnerTheme(mode)
  const variables: CSSProperties & Record<`--${string}`, string> = {
    "--normal-bg": themeToken.surface,
    "--normal-text": themeToken.surfaceForeground,
    "--normal-border": themeToken.border,
    "--success-bg": token.brand,
    "--success-text": token.brandForeground,
    "--success-border": token.brand,
    "--warning-bg": token.warning,
    "--warning-text": token.warningForeground,
    "--warning-border": token.warning,
    "--error-bg": token.destructive,
    "--error-text": token.destructiveForeground,
    "--error-border": token.destructive,
    "--border-radius": bridgeTheme.theme.radius?.overlay ?? geometryToken.overlayRadius
  }
  return (
    <Sonner
      theme={resolvedTheme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon {...stylex.props(style.icon)} />,
        info: <InfoIcon {...stylex.props(style.icon)} />,
        warning: <TriangleAlertIcon {...stylex.props(style.icon)} />,
        error: <OctagonXIcon {...stylex.props(style.icon)} />,
        loading: <Loader2Icon {...stylex.props(style.icon, style.loading)} />
      }}
      style={variables}
      toastOptions={{ classNames: { toast: "cn-toast" } }}
      {...props}
    />
  )
}
