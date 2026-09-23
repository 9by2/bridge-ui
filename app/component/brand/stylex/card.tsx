import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { geometryToken, themeToken, token } from "./token.stylex"

type ValueOf<T> = T[keyof T]

const cardRadius = { none: "none", sm: "sm", default: "default", lg: "lg" } as const

export type CardRadius = ValueOf<typeof cardRadius>

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: geometryToken.layoutGap,
    overflow: "hidden",
    borderRadius: geometryToken.surfaceRadius,
    backgroundColor: themeToken.surface,
    paddingBlock: { default: geometryToken.surfacePadding, ':has([data-slot="card-footer"])': 0 },
    color: themeToken.surfaceForeground,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    boxShadow: `0 0 0 1px color-mix(in oklch, ${token.foreground}, transparent 90%)`
  },
  radiusNone: { borderRadius: 0 },
  radiusSm: { borderRadius: "var(--bridge-radius-8, 0.5em)" },
  radiusLg: { borderRadius: "var(--bridge-radius-18, 1.125em)" },
  ghost: { backgroundColor: "transparent", boxShadow: "none" },
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
    borderTopLeftRadius: {
      default: geometryToken.surfaceRadius,
      [stylex.when.ancestor('[data-radius="none"]')]: 0,
      [stylex.when.ancestor('[data-radius="sm"]')]: 8,
      [stylex.when.ancestor('[data-radius="lg"]')]: 18
    },
    borderTopRightRadius: {
      default: 14,
      [stylex.when.ancestor('[data-radius="none"]')]: 0,
      [stylex.when.ancestor('[data-radius="sm"]')]: 8,
      [stylex.when.ancestor('[data-radius="lg"]')]: 18
    },
    paddingInline: geometryToken.surfacePadding,
    containerType: "inline-size",
    gridTemplateColumns: { default: null, ':has([data-slot="card-action"])': "1fr auto" }
  },
  spacing: { paddingInline: { default: geometryToken.surfacePadding, [stylex.when.ancestor('[data-size="sm"]')]: 12 } },
  title: {
    fontFamily: token.fontHeading,
    fontSize: { default: 16, [stylex.when.ancestor('[data-size="sm"]')]: 14 },
    lineHeight: 1.375,
    fontWeight: 500
  },
  description: { fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: "20px", color: token.mutedForeground },
  action: { gridColumnStart: 2, gridRow: "1 / span 2", alignSelf: "start", justifySelf: "end" },
  footer: {
    display: "flex",
    alignItems: "center",
    borderBottomLeftRadius: {
      default: geometryToken.surfaceRadius,
      [stylex.when.ancestor('[data-radius="none"]')]: 0,
      [stylex.when.ancestor('[data-radius="sm"]')]: 8,
      [stylex.when.ancestor('[data-radius="lg"]')]: 18
    },
    borderBottomRightRadius: {
      default: 14,
      [stylex.when.ancestor('[data-radius="none"]')]: 0,
      [stylex.when.ancestor('[data-radius="sm"]')]: 8,
      [stylex.when.ancestor('[data-radius="lg"]')]: 18
    },
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: themeToken.border,
    backgroundColor: `color-mix(in oklch, ${themeToken.muted}, transparent 50%)`,
    paddingBlock: { default: geometryToken.surfacePadding, [stylex.when.ancestor('[data-size="sm"]')]: 12 }
  }
})
export function Card({
  className,
  size = "default",
  radius = cardRadius.default,
  variant = "default",
  ...props
}: ComponentProps<"div"> & { radius?: CardRadius; size?: "default" | "sm"; variant?: "default" | "ghost" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      data-radius={radius}
      data-variant={variant}
      {...props}
      className={[
        stylex.props(
          stylex.defaultMarker(),
          style.root,
          style.top,
          size === "sm" && style.small,
          radius === cardRadius.none && style.radiusNone,
          radius === cardRadius.sm && style.radiusSm,
          radius === cardRadius.lg && style.radiusLg,
          variant === "ghost" && style.ghost
        ).className,
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
