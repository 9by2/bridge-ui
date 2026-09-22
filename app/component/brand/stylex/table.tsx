import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  container: { position: "relative", width: "100%", overflowX: "auto" },
  frame: {
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
    flexShrink: 0,
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
  viewport: { width: "100%", minWidth: 0, overflowX: "auto", overscrollBehaviorInline: "contain" },
  table: {
    width: "100%",
    captionSide: "bottom",
    fontSize: 14,
    lineHeight: "20px",
    borderCollapse: "collapse",
    textIndent: 0
  },
  footer: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: token.border,
    backgroundColor: `color-mix(in oklch, ${token.muted}, transparent 50%)`,
    fontWeight: 500
  },
  row: {
    borderBottomWidth: { default: 1, ":last-child:is(tbody > tr, tfoot > tr)": 0 },
    borderBottomStyle: "solid",
    borderBottomColor: token.border,
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    backgroundColor: {
      default: "transparent",
      ":hover": `color-mix(in oklch, ${token.muted}, transparent 50%)`,
      ':has([aria-expanded="true"])': `color-mix(in oklch, ${token.muted}, transparent 50%)`,
      ':is([data-state="selected"])': token.muted
    }
  },
  head: {
    height: 40,
    paddingInline: 8,
    textAlign: "left",
    verticalAlign: "middle",
    fontWeight: 500,
    whiteSpace: "nowrap",
    color: token.foreground,
    paddingRight: { default: 8, ':has([role="checkbox"])': 0 }
  },
  cell: {
    padding: 8,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    paddingRight: { default: 8, ':has([role="checkbox"])': 0 }
  },
  caption: { marginTop: 16, fontSize: 14, lineHeight: "20px", color: token.mutedForeground }
})
const tableDensity = { compact: "compact", standard: "standard" } as const
type ValueOf<T> = T[keyof T]
export type TableDensity = ValueOf<typeof tableDensity>
export type TableFrameOptions = ComponentProps<"section"> & { density?: TableDensity; variant: "frame" }
type PlainTableProps = ComponentProps<"table">

export function Table(props: TableFrameOptions): React.JSX.Element
export function Table(props: PlainTableProps): React.JSX.Element
export function Table(props: PlainTableProps | TableFrameOptions) {
  if ("variant" in props)
    return (
      <section
        data-slot="table-frame"
        data-density={props.density ?? "standard"}
        data-fill="width"
        {...props}
        className={[
          stylex.props(
            stylex.defaultMarker(),
            style.frame,
            props.density === "compact" ? style.compact : style.standard
          ).className,
          props.className
        ]
          .filter(Boolean)
          .join(" ")}
      />
    )
  return <PlainTable {...props} />
}
function PlainTable({ className, ...props }: PlainTableProps) {
  return (
    <div data-slot="table-container" {...stylex.props(style.container)}>
      <table
        data-slot="table"
        {...props}
        className={[stylex.props(style.table).className, className].filter(Boolean).join(" ")}
      />
    </div>
  )
}
export function TableHint({
  className,
  dataSlot = "table-hint",
  ...props
}: ComponentProps<"div"> & { dataSlot?: string }) {
  return (
    <div
      data-slot={dataSlot}
      {...props}
      className={[stylex.props(style.hint).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function TableViewport({
  className,
  dataSlot = "table-viewport",
  ...props
}: ComponentProps<"div"> & { dataSlot?: string }) {
  return (
    <div
      data-slot={dataSlot}
      {...props}
      className={[stylex.props(style.viewport).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function TableHeader(props: ComponentProps<"thead">) {
  return <thead data-slot="table-header" {...props} />
}
export function TableBody(props: ComponentProps<"tbody">) {
  return <tbody data-slot="table-body" {...props} />
}
export function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      {...props}
      className={[stylex.props(style.footer).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      {...props}
      className={[stylex.props(style.row).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function TableHead({ className, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      {...props}
      className={[stylex.props(style.head).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      {...props}
      className={[stylex.props(style.cell).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function TableCaption({ className, ...props }: ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      {...props}
      className={[stylex.props(style.caption).className, className].filter(Boolean).join(" ")}
    />
  )
}
