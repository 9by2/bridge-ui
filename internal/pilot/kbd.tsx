import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    pointerEvents: "none",
    display: "inline-flex",
    boxSizing: "border-box",
    height: 20,
    width: "fit-content",
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 6,
    backgroundColor: token.muted,
    paddingInline: 4,
    fontFamily: "inherit",
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: 500,
    color: token.mutedForeground,
    userSelect: "none"
  },
  group: { display: "inline-flex", alignItems: "center", gap: 4 }
})
export function Kbd({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function KbdGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      {...props}
      className={[stylex.props(style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
