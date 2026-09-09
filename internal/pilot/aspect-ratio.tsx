import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

const style = stylex.create({ root: { position: "relative" } })
export function AspectRatio({
  ratio,
  className,
  style: callerStyle,
  ...props
}: ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
      style={{ aspectRatio: ratio, ...callerStyle }}
    />
  )
}
