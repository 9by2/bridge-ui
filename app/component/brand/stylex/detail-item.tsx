import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(8rem, 1fr) minmax(0, 2fr)", "@media (max-width: 640px)": "1fr" },
    gap: 8,
    paddingBlock: 12,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border
  },
  label: { color: token.mutedForeground, fontSize: "var(--bridge-font-size-base, 0.875em)" },
  content: { minWidth: 0, color: token.foreground, overflowWrap: "anywhere" }
})
const classes = (own: string | undefined, value?: string) => [own, value].filter(Boolean).join(" ")
export function DetailItem({ className, ...prop }: ComponentProps<"div">) {
  return <div data-slot="detail-item" {...prop} className={classes(stylex.props(style.root).className, className)} />
}
export function DetailItemLabel({ className, ...prop }: ComponentProps<"dt">) {
  return (
    <dt data-slot="detail-item-label" {...prop} className={classes(stylex.props(style.label).className, className)} />
  )
}
export function DetailItemContent({ className, ...prop }: ComponentProps<"dd">) {
  return (
    <dd
      data-slot="detail-item-content"
      {...prop}
      className={classes(stylex.props(style.content).className, className)}
    />
  )
}
