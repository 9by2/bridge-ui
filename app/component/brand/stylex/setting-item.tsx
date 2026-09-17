import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 12,
    alignItems: "center",
    paddingBlock: 16,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border
  },
  title: { margin: 0, color: token.foreground, fontFamily: token.fontHeading, fontSize: 16, fontWeight: 600 },
  description: { margin: 0, color: token.mutedForeground, fontSize: 14, lineHeight: 1.5 },
  action: { gridColumn: 2, gridRow: "1 / span 2" }
})
const classes = (own: string | undefined, value?: string) => [own, value].filter(Boolean).join(" ")
export function SettingItem({ className, ...prop }: ComponentProps<"section">) {
  return (
    <section data-slot="setting-item" {...prop} className={classes(stylex.props(style.root).className, className)} />
  )
}
export function SettingItemTitle({ className, ...prop }: ComponentProps<"h3">) {
  return (
    <h3 data-slot="setting-item-title" {...prop} className={classes(stylex.props(style.title).className, className)} />
  )
}
export function SettingItemDescription({ className, ...prop }: ComponentProps<"p">) {
  return (
    <p
      data-slot="setting-item-description"
      {...prop}
      className={classes(stylex.props(style.description).className, className)}
    />
  )
}
export function SettingItemAction({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="setting-item-action"
      {...prop}
      className={classes(stylex.props(style.action).className, className)}
    />
  )
}
