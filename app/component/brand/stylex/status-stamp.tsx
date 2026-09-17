import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const tone = { neutral: "neutral", success: "success", warning: "warning", destructive: "destructive" } as const
export type StatusStampTone = (typeof tone)[keyof typeof tone]
const style = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: token.shapePill,
    paddingInline: 10,
    paddingBlock: 4,
    fontFamily: token.fontHeading,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },
  neutral: { borderColor: token.border, color: token.foreground },
  success: { borderColor: token.brand, backgroundColor: token.brand, color: token.brandForeground },
  warning: { borderColor: token.warning, color: token.warning },
  destructive: { borderColor: token.destructive, color: token.destructive }
})
export function StatusStamp({
  className,
  tone: value = "neutral",
  ...prop
}: ComponentProps<"span"> & { tone?: StatusStampTone }) {
  return (
    <span
      data-slot="status-stamp"
      data-tone={value}
      {...prop}
      className={[stylex.props(style.root, style[value]).className, className].filter(Boolean).join(" ")}
    />
  )
}
