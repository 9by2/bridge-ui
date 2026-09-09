import * as stylex from "@stylexjs/stylex"
import { Loader2Icon } from "lucide-react"
import type { ComponentProps } from "react"

const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } })
const style = stylex.create({
  root: {
    width: 16,
    height: 16,
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationPlayState: { default: "running", "@media (prefers-reduced-motion: reduce)": "paused" }
  }
})
export function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
