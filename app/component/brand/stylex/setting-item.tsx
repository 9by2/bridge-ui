import * as stylex from "@stylexjs/stylex"
import { createContext, useContext, type ComponentProps } from "react"

import { token } from "./token.stylex"

type ValueOf<T> = T[keyof T]

const settingItemVariant = { default: "default", inline: "inline" } as const

export type SettingItemVariant = ValueOf<typeof settingItemVariant>

const SettingItemContext = createContext<SettingItemVariant>(settingItemVariant.default)

const style = stylex.create({
  root: {
    display: "grid",
    width: "100%",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 12,
    alignItems: "center",
    paddingBlock: 16,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border
  },
  inline: { gap: 16, paddingBlock: 14 },
  title: { margin: 0, color: token.foreground, fontFamily: token.fontHeading, fontSize: "var(--bridge-font-size-lg, 1em)", fontWeight: 600 },
  inlineTitle: { fontWeight: 400 },
  description: { margin: 0, color: token.mutedForeground, fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: 1.5 },
  action: { gridColumn: 2, gridRow: "1 / span 2", minWidth: 0, overflowWrap: "anywhere", textAlign: "right" }
})
const classes = (own: string | undefined, value?: string) => [own, value].filter(Boolean).join(" ")
export function SettingItem({
  className,
  variant = settingItemVariant.default,
  ...prop
}: ComponentProps<"section"> & { variant?: SettingItemVariant | null }) {
  return (
    <SettingItemContext value={variant ?? settingItemVariant.default}>
      <section
        data-slot="setting-item"
        data-variant={variant}
        {...prop}
        className={classes(
          stylex.props(style.root, variant === settingItemVariant.inline && style.inline).className,
          className
        )}
      />
    </SettingItemContext>
  )
}
export function SettingItemTitle({ className, ...prop }: ComponentProps<"h3">) {
  const variant = useContext(SettingItemContext)
  return (
    <h3
      data-slot="setting-item-title"
      {...prop}
      className={classes(
        stylex.props(style.title, variant === settingItemVariant.inline && style.inlineTitle).className,
        className
      )}
    />
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
