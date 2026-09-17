import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const tableFrameDensity = {
  compact: "compact",
  standard: "standard"
} as const

type ValueOf<T> = T[keyof T]

export type TableFrameDensity = ValueOf<typeof tableFrameDensity>

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
    overflow: "hidden",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    backgroundColor: token.background,
    color: token.foreground
  },
  compact: { "--table-frame-cell-block-padding": "8px", "--table-frame-head-height": "32px" },
  standard: { "--table-frame-cell-block-padding": "12px", "--table-frame-head-height": "36px" },
  hint: {
    boxSizing: "border-box",
    display: { default: "none", "@media (max-width: 640px)": "block" },
    width: "100%",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border,
    paddingBlock: 8,
    paddingInline: 12,
    color: token.mutedForeground,
    fontSize: 12,
    lineHeight: 1.5,
    overflowWrap: "anywhere"
  },
  viewport: {
    width: "100%",
    minWidth: 0,
    overflowX: "auto",
    overscrollBehaviorInline: "contain"
  }
})

export type TableFrameProps = ComponentProps<"section"> & { density?: TableFrameDensity }

export function TableFrame({ className, density = "standard", ...prop }: TableFrameProps) {
  return (
    <section
      data-slot="table-frame"
      data-density={density}
      {...prop}
      className={[
        stylex.props(stylex.defaultMarker(), style.root, density === "compact" ? style.compact : style.standard)
          .className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}

export function TableFrameHint({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="table-frame-hint"
      {...prop}
      className={[stylex.props(style.hint).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function TableFrameViewport({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="table-frame-viewport"
      {...prop}
      className={[stylex.props(style.viewport).className, className].filter(Boolean).join(" ")}
    />
  )
}
