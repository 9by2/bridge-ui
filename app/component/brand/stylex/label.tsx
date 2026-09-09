import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

const style = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    lineHeight: 1,
    fontWeight: 500,
    userSelect: "none",
    pointerEvents: { default: "auto", ':is(.group[data-disabled="true"] *)': "none" },
    opacity: { default: 1, ':is(.group[data-disabled="true"] *)': 0.5, ":is(.peer:disabled ~ *)": 0.5 },
    cursor: { default: "auto", ":is(.peer:disabled ~ *)": "not-allowed" }
  }
})

export function Label({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
