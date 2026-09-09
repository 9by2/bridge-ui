import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const pulse = stylex.keyframes({ "50%": { opacity: 0.5 } })
const style = stylex.create({
  root: {
    borderRadius: 8,
    backgroundColor: token.muted,
    animationName: pulse,
    animationDuration: "2s",
    animationTimingFunction: "cubic-bezier(0.4, 0, 0.6, 1)",
    animationIterationCount: "infinite",
    animationPlayState: { default: "running", "@media (prefers-reduced-motion: reduce)": "paused" }
  }
})
export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
