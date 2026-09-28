import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

type ValueOf<T> = T[keyof T]

/** Empty surface: `default` is borderless, `outline` adds the dashed frame, `muted` fills a quiet surface. */
export const EmptyVariant = { default: "default", outline: "outline", muted: "muted" } as const
export type EmptyVariant = ValueOf<typeof EmptyVariant>

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
    minWidth: 0,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--bridge-unit-16, 16px)",
    borderRadius: "var(--bridge-radius-14, 0.875em)",
    borderStyle: "dashed",
    borderWidth: 0,
    padding: "var(--bridge-unit-24, 24px)",
    textAlign: "center",
    textWrap: "balance"
  },
  outline: { borderWidth: 1, borderColor: token.border },
  muted: { backgroundColor: `color-mix(in oklch, ${token.muted}, transparent 50%)` },
  header: {
    display: "flex",
    maxWidth: 384,
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--bridge-unit-8, 8px)"
  },
  media: { marginBottom: 8, display: "flex", flexShrink: 0, alignItems: "center", justifyContent: "center" },
  default: { backgroundColor: "transparent" },
  icon: {
    width: 32,
    height: 32,
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    backgroundColor: token.muted,
    color: token.foreground
  },
  title: {
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    fontWeight: 500,
    letterSpacing: "-0.025em"
  },
  description: { fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: 1.625, color: token.mutedForeground },
  content: {
    display: "flex",
    width: "100%",
    maxWidth: 384,
    minWidth: 0,
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--bridge-unit-10, 10px)",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    textWrap: "balance"
  }
})
export function Empty({
  className,
  variant = EmptyVariant.default,
  ...props
}: ComponentProps<"div"> & { variant?: EmptyVariant }) {
  return (
    <div
      data-slot="empty"
      data-variant={variant}
      {...props}
      className={[
        stylex.props(
          style.root,
          variant === EmptyVariant.outline && style.outline,
          variant === EmptyVariant.muted && style.muted
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function EmptyHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-header"
      {...props}
      className={[stylex.props(style.header).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function EmptyMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & { variant?: "default" | "icon" | null }) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      {...props}
      className={[stylex.props(style.media, variant && style[variant]).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function EmptyTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-title"
      {...props}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function EmptyDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      {...props}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function EmptyContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
