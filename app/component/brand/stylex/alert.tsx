import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    position: "relative",
    display: "grid",
    width: "100%",
    gap: "var(--bridge-unit-2, 2px)",
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    paddingInline: "var(--bridge-unit-10, 10px)",
    paddingBlock: "var(--bridge-unit-8, 8px)",
    textAlign: "left",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    gridTemplateColumns: { default: null, ":has(> svg)": "auto 1fr" },
    columnGap: { default: "var(--bridge-unit-2, 2px)", ":has(> svg)": "var(--bridge-unit-8, 8px)" },
    paddingRight: {
      default: "var(--bridge-unit-10, 10px)",
      ':has([data-slot="alert-action"])': "var(--bridge-unit-72, 72px)"
    }
  },
  default: { backgroundColor: token.background, color: token.foreground },
  destructive: { backgroundColor: token.background, color: token.errorText },
  info: {
    borderColor: token.primary,
    backgroundColor: `color-mix(in oklch, ${token.primary}, transparent 92%)`,
    color: token.primary
  },
  success: {
    borderColor: `var(--bridge-color-brand, ${token.brand})`,
    backgroundColor: `color-mix(in oklch, var(--bridge-color-brand, ${token.brand}), transparent 90%)`,
    color: token.foreground
  },
  warning: {
    borderColor: token.warning,
    backgroundColor: `color-mix(in oklch, ${token.warning}, transparent 88%)`,
    color: token.foreground
  },
  title: { fontWeight: 500, gridColumnStart: { default: null, [stylex.when.ancestor(":has(> svg)")]: 2 } },
  description: {
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    color: {
      default: token.mutedForeground,
      [stylex.when.ancestor(
        ':is([data-variant="destructive"], [data-variant="info"], [data-variant="success"], [data-variant="warning"])'
      )]: "currentColor"
    },
    textWrap: { default: "balance", "@media (min-width: 768px)": "pretty" }
  },
  action: { position: "absolute", top: 8, right: 8 }
})
export function Alert({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & { variant?: "default" | "destructive" | "info" | "success" | "warning" | null }) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role="alert"
      {...props}
      className={[stylex.props(stylex.defaultMarker(), style.root, variant && style[variant]).className, className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function AlertTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      {...props}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      {...props}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AlertAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      {...props}
      className={[stylex.props(style.action).className, className].filter(Boolean).join(" ")}
    />
  )
}
