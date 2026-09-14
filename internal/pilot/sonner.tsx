import * as stylex from "@stylexjs/stylex"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
import { useTheme } from "next-themes"
import type { CSSProperties } from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

import { token } from "./token.stylex"

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
export function Toaster(props: ToasterProps) {
  const { theme = "system" } = useTheme()
  const variables: CSSProperties & Record<`--${string}`, string> = {
    "--normal-bg": token.background,
    "--normal-text": token.foreground,
    "--normal-border": token.border,
    "--success-bg": token.brand,
    "--success-text": token.brandForeground,
    "--success-border": token.brand,
    "--warning-bg": token.warning,
    "--warning-text": token.warningForeground,
    "--warning-border": token.warning,
    "--error-bg": token.destructive,
    "--error-text": token.destructiveForeground,
    "--error-border": token.destructive,
    "--border-radius": "14px"
  }
  return (
    <Sonner
      theme={theme === "light" || theme === "dark" ? theme : "system"}
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
