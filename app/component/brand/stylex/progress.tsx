import { Progress as Primitive } from "@base-ui/react/progress"
import * as stylex from "@stylexjs/stylex"

import { token } from "./token.stylex"

const style = stylex.create({
  root: { display: "flex", flexWrap: "wrap", gap: 12 },
  track: {
    position: "relative",
    display: "flex",
    height: 4,
    width: "100%",
    alignItems: "center",
    overflowX: "hidden",
    borderRadius: "var(--bridge-radius-9999, 9999em)",
    backgroundColor: token.muted
  },
  indicator: { height: "100%", backgroundColor: token.primary, transitionProperty: "all", transitionDuration: "150ms" },
  label: { fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: "20px", fontWeight: 500 },
  value: {
    marginLeft: "auto",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    color: token.mutedForeground,
    fontVariantNumeric: "tabular-nums"
  }
})
export function Progress({ className, children, ...props }: Primitive.Root.Props) {
  return (
    <Primitive.Root
      data-slot="progress"
      {...props}
      className={(state) =>
        [stylex.props(style.root).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }>
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Primitive.Root>
  )
}
export function ProgressTrack({ className, ...props }: Primitive.Track.Props) {
  return (
    <Primitive.Track
      data-slot="progress-track"
      {...props}
      className={(state) =>
        [stylex.props(style.track).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ProgressIndicator({ className, ...props }: Primitive.Indicator.Props) {
  return (
    <Primitive.Indicator
      data-slot="progress-indicator"
      {...props}
      className={(state) =>
        [stylex.props(style.indicator).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ProgressLabel({ className, ...props }: Primitive.Label.Props) {
  return (
    <Primitive.Label
      data-slot="progress-label"
      {...props}
      className={(state) =>
        [stylex.props(style.label).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ProgressValue({ className, ...props }: Primitive.Value.Props) {
  return (
    <Primitive.Value
      data-slot="progress-value"
      {...props}
      className={(state) =>
        [stylex.props(style.value).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
