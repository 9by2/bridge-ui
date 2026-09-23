import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: 12, color: token.foreground },
  row: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 16,
    alignItems: "baseline",
    paddingBlock: 8
  },
  separator: { borderBottomWidth: 1, borderBottomStyle: "dashed", borderBottomColor: token.border },
  detail: { color: token.mutedForeground, fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: 1.5 }
})
const className = (value: string | undefined, own: string | undefined) => [own, value].filter(Boolean).join(" ")
export function Receipt({ className: value, ...prop }: ComponentProps<"dl">) {
  return (
    <dl
      data-slot="receipt"
      {...prop}
      className={className(value, stylex.props(stylex.defaultMarker(), style.root).className)}
    />
  )
}
export function ReceiptRow({
  className: value,
  separator = true,
  ...prop
}: ComponentProps<"div"> & { separator?: boolean }) {
  return (
    <div
      data-slot="receipt-row"
      {...prop}
      className={className(value, stylex.props(style.row, separator && style.separator).className)}
    />
  )
}
export function ReceiptDetail({ className: value, ...prop }: ComponentProps<"div">) {
  return <div data-slot="receipt-detail" {...prop} className={className(value, stylex.props(style.detail).className)} />
}
