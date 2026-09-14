import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: token.card,
    paddingBlock: { default: 16, ':has([data-slot="card-footer"])': 0 },
    color: token.cardForeground,
    fontSize: 14,
    lineHeight: "20px",
    boxShadow: `0 0 0 1px color-mix(in oklch, ${token.foreground}, transparent 90%)`
  },
  top: { paddingTop: { default: 16, ":has(> img:first-child)": 0 } },
  small: {
    gap: 12,
    paddingTop: { default: 12, ":has(> img:first-child)": 0 },
    paddingBottom: { default: 12, ':has([data-slot="card-footer"])': 0 }
  },
  header: {
    display: "grid",
    gridAutoRows: "min-content",
    alignItems: "start",
    gap: 4,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingInline: 16,
    containerType: "inline-size",
    gridTemplateColumns: { default: null, ':has([data-slot="card-action"])': "1fr auto" }
  },
  spacing: { paddingInline: { default: 16, [stylex.when.ancestor('[data-size="sm"]')]: 12 } },
  title: {
    fontFamily: token.fontHeading,
    fontSize: { default: 16, [stylex.when.ancestor('[data-size="sm"]')]: 14 },
    lineHeight: 1.375,
    fontWeight: 500
  },
  description: { fontSize: 14, lineHeight: "20px", color: token.mutedForeground },
  action: { gridColumnStart: 2, gridRow: "1 / span 2", alignSelf: "start", justifySelf: "end" },
  footer: {
    display: "flex",
    alignItems: "center",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: token.border,
    backgroundColor: `color-mix(in oklch, ${token.muted}, transparent 50%)`,
    paddingBlock: { default: 16, [stylex.when.ancestor('[data-size="sm"]')]: 12 }
  }
})
export function Card({ className, size = "default", ...props }: ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      {...props}
      className={[
        stylex.props(stylex.defaultMarker(), style.root, style.top, size === "sm" && style.small).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      {...props}
      className={[stylex.props(style.header, style.spacing).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      {...props}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      {...props}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      {...props}
      className={[stylex.props(style.action).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      {...props}
      className={[stylex.props(style.spacing).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      {...props}
      className={[stylex.props(style.footer, style.spacing).className, className].filter(Boolean).join(" ")}
    />
  )
}
