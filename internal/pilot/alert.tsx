import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    position: "relative",
    display: "grid",
    width: "100%",
    gap: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    paddingInline: 10,
    paddingBlock: 8,
    textAlign: "left",
    fontSize: 14,
    lineHeight: "20px",
    gridTemplateColumns: { default: null, ":has(> svg)": "auto 1fr" },
    columnGap: { default: 2, ":has(> svg)": 8 },
    paddingRight: { default: 10, ':has([data-slot="alert-action"])': 72 }
  },
  default: { backgroundColor: token.background, color: token.foreground },
  destructive: { backgroundColor: token.background, color: token.errorText },
  title: { fontWeight: 500, gridColumnStart: { default: null, [stylex.when.ancestor(":has(> svg)")]: 2 } },
  description: {
    fontSize: 14,
    lineHeight: "20px",
    color: { default: token.mutedForeground, [stylex.when.ancestor('[data-variant="destructive"]')]: token.errorText },
    textWrap: { default: "balance", "@media (min-width: 768px)": "pretty" }
  },
  action: { position: "absolute", top: 8, right: 8 }
})
export function Alert({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & { variant?: "default" | "destructive" | null }) {
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
