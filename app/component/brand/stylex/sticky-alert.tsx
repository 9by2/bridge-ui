import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const tone = { neutral: "neutral", warning: "warning", destructive: "destructive", success: "success" } as const
export type StickyAlertTone = (typeof tone)[keyof typeof tone]
const style = stylex.create({
  root: {
    position: "sticky",
    top: "var(--sticky-alert-offset, 0px)",
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    gap: "var(--bridge-unit-12, 12px)",
    borderRadius: token.shapeSurface,
    padding: "var(--bridge-unit-12, 12px)",
    borderWidth: 1,
    borderStyle: "solid",
    backgroundColor: token.background
  },
  neutral: { borderColor: token.border, color: token.foreground },
  warning: { borderColor: token.warning, color: token.warning },
  destructive: { borderColor: token.destructive, color: token.destructive },
  success: { borderColor: `var(--bridge-color-brand, ${token.brand})`, color: token.foreground }
})
export function StickyAlert({
  className,
  offset,
  style: inlineStyle,
  tone: value = "neutral",
  ...prop
}: ComponentProps<"aside"> & { offset?: string; tone?: StickyAlertTone }) {
  return (
    <aside
      data-slot="sticky-alert"
      data-tone={value}
      {...prop}
      style={{ ...inlineStyle, top: offset ?? inlineStyle?.top }}
      className={[stylex.props(style.root, style[value]).className, className].filter(Boolean).join(" ")}
    />
  )
}
