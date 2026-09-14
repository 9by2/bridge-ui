import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
    minWidth: 0,
    height: 64,
    flexShrink: 0,
    alignItems: "center",
    gap: 12,
    paddingInline: { default: 24, "@media (max-width: 640px)": 16 },
    backgroundColor: token.background,
    borderBottomColor: token.border,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    color: token.foreground
  },
  title: {
    minWidth: 0,
    flex: 1,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
    fontSize: 20,
    lineHeight: "28px",
    fontWeight: 600,
    color: token.foreground
  },
  action: {
    display: "flex",
    minWidth: 0,
    maxWidth: "50%",
    flex: "0 1 auto",
    alignItems: "center",
    gap: 8,
    marginInlineStart: "auto"
  }
})

export function ShellHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      data-slot="shell-header"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function ShellHeaderTitle({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      data-slot="shell-header-title"
      {...props}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function ShellHeaderAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="shell-header-action"
      {...props}
      className={[stylex.props(style.action).className, className].filter(Boolean).join(" ")}
    />
  )
}
