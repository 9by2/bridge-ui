import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const dataStateVariant = {
  neutral: "neutral",
  loading: "loading",
  error: "error",
  permission: "permission",
  disabled: "disabled"
} as const

type ValueOf<T> = T[keyof T]

export type DataStateVariant = ValueOf<typeof dataStateVariant>

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    minHeight: 192,
    width: "100%",
    minWidth: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: token.border,
    paddingBlock: 40,
    paddingInline: { default: 24, "@media (max-width: 640px)": 16 },
    color: token.foreground,
    textAlign: "center"
  },
  quiet: { backgroundColor: token.muted },
  error: { borderColor: token.destructive },
  disabled: { opacity: 0.6 },
  media: {
    display: "flex",
    minWidth: 24,
    minHeight: 24,
    alignItems: "center",
    justifyContent: "center",
    color: token.mutedForeground
  },
  title: {
    margin: 0,
    maxWidth: 640,
    color: token.foreground,
    fontFamily: token.fontHeading,
    fontSize: "var(--bridge-font-size-xl, 1.125em)",
    fontWeight: 600,
    lineHeight: 1.4,
    overflowWrap: "anywhere"
  },
  description: {
    margin: 0,
    maxWidth: 640,
    color: token.mutedForeground,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: 1.55,
    overflowWrap: "anywhere"
  },
  action: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 8
  }
})

export type DataStateProps = ComponentProps<"section"> & { variant?: DataStateVariant }

export function DataState({ className, role, variant = "neutral", ...prop }: DataStateProps) {
  const alert = variant === "error" || variant === "permission"
  return (
    <section
      data-slot="data-state"
      data-variant={variant}
      role={role ?? (alert ? "alert" : undefined)}
      {...prop}
      className={[
        stylex.props(
          stylex.defaultMarker(),
          style.root,
          variant === "loading" && style.quiet,
          alert && style.error,
          variant === "disabled" && style.disabled
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}

export function DataStateMedia({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="data-state-media"
      {...prop}
      className={[stylex.props(style.media).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function DataStateTitle({ className, ...prop }: ComponentProps<"h2">) {
  return (
    <h2
      data-slot="data-state-title"
      {...prop}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function DataStateDescription({ className, ...prop }: ComponentProps<"p">) {
  return (
    <p
      data-slot="data-state-description"
      {...prop}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function DataStateAction({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="data-state-action"
      {...prop}
      className={[stylex.props(style.action).className, className].filter(Boolean).join(" ")}
    />
  )
}
