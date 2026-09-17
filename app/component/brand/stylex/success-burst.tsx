import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    backgroundImage: `conic-gradient(from 0deg, transparent, ${token.brand}, transparent, ${token.brandAccent}, transparent)`,
    transform: "scale(.9)",
    transitionProperty: "transform",
    transitionDuration: "350ms",
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0ms" }
  }
})
export function SuccessBurst({ className, ...prop }: ComponentProps<"span">) {
  return (
    <span
      data-slot="success-burst"
      aria-hidden="true"
      {...prop}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
