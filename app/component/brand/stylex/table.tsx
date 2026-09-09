import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  container: { position: "relative", width: "100%", overflowX: "auto" },
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
export function Table({ className, ...props }: ComponentProps<"table">) {
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
