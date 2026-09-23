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
    borderRadius: "var(--bridge-radius-6, 0.375em)",
    backgroundColor: token.muted,
    paddingInline: 4,
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
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
