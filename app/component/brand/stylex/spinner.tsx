import * as stylex from "@stylexjs/stylex"
import { Loader2Icon } from "lucide-react"
import type { ComponentProps } from "react"

type ValueOf<T> = T[keyof T]

export const SpinnerSize = { sm: "sm", default: "default", lg: "lg" } as const
export type SpinnerSize = ValueOf<typeof SpinnerSize>

export type SpinnerProps = ComponentProps<"svg"> & { size?: SpinnerSize }

const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } })
const style = stylex.create({
  root: {
    flexShrink: 0,
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationPlayState: { default: "running", "@media (prefers-reduced-motion: reduce)": "paused" }
  },
  sm: { width: 12, height: 12 },
  default: { width: 16, height: 16 },
  lg: { width: 24, height: 24 }
})

/**
 * Container icon rules (Button, Badge, …) size descendant SVGs unless they carry a `size-*` class.
 * An explicit `size` opts out through that contract so the caller's size wins inside any container;
 * omitting `size` keeps the container-driven icon size.
 */
export function Spinner({ size, className, ...props }: SpinnerProps) {
  const resolved = size ?? SpinnerSize.default
  return (
    <Loader2Icon
      data-slot="spinner"
      data-size={resolved}
      role="status"
      aria-label="Loading"
      {...props}
      className={[stylex.props(style.root, style[resolved]).className, size && `size-spinner-${size}`, className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
