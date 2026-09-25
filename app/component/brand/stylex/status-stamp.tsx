import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const tone = {
  neutral: "neutral",
  info: "info",
  pending: "pending",
  inactive: "inactive",
  partialSuccess: "partial-success",
  success: "success",
  warning: "warning",
  destructive: "destructive"
} as const
type ValueOf<T> = T[keyof T]
export type StatusStampTone = ValueOf<typeof tone>
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
    fontSize: "var(--bridge-text-size-sm, 0.75rem)",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },
  neutral: { borderColor: token.border, color: token.foreground },
  info: {
    borderColor: token.primary,
    backgroundColor: `color-mix(in oklch, ${token.primary}, transparent 90%)`,
    color: token.primary
  },
  pending: {
    borderColor: token.warning,
    backgroundColor: `color-mix(in oklch, ${token.warning}, transparent 88%)`,
    color: token.foreground
  },
  inactive: { borderColor: token.border, backgroundColor: token.muted, color: token.foreground },
  partialSuccess: {
    borderColor: `var(--bridge-color-brand-accent, ${token.brandAccent})`,
    backgroundColor: `var(--bridge-color-brand-accent, ${token.brandAccent})`,
    color: `var(--bridge-color-brand-accent-foreground, ${token.brandAccentForeground})`
  },
  success: {
    borderColor: `var(--bridge-color-brand, ${token.brand})`,
    backgroundColor: `var(--bridge-color-brand, ${token.brand})`,
    color: `var(--bridge-color-brand-foreground, ${token.brandForeground})`
  },
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
      className={[
        stylex.props(style.root, style[value === tone.partialSuccess ? "partialSuccess" : value]).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
