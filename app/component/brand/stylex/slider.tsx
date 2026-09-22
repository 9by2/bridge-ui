import { Slider as Primitive } from "@base-ui/react/slider"
import * as stylex from "@stylexjs/stylex"
import type { CSSProperties, ReactNode } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: { width: "100%" },
  verticalRoot: { width: "auto", height: "100%" },
  control: {
    position: "relative",
    display: "flex",
    width: "100%",
    touchAction: "none",
    alignItems: "center",
    userSelect: "none",
    opacity: { default: 1, ":is([data-disabled])": 0.5 }
  },
  verticalControl: { height: "100%", minHeight: 160, width: "auto", flexDirection: "column" },
  track: {
    position: "relative",
    flexGrow: 1,
    overflow: "hidden",
    borderRadius: 9999,
    backgroundColor: token.muted,
    userSelect: "none",
    height: 4,
    width: "100%"
  },
  verticalTrack: { height: "100%", width: 4 },
  range: {
    backgroundColor: "var(--bridge-slider-range-color, var(--bridge-color-primary, currentColor))",
    userSelect: "none",
    height: "100%"
  },
  verticalRange: { height: "auto", width: "100%" },
  thumb: {
    position: "relative",
    display: "block",
    boxSizing: "border-box",
    width: 12,
    height: 12,
    flexShrink: 0,
    borderRadius: 9999,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "var(--bridge-slider-thumb-color, var(--bridge-color-ring, currentColor))",
    backgroundColor: "var(--bridge-slider-thumb-background, white)",
    transitionProperty: "color, box-shadow",
    transitionDuration: "150ms",
    userSelect: "none",
    boxShadow: {
      default: "none",
      ":hover": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)`,
      ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)`,
      ":active": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)`
    },
    pointerEvents: { default: "auto", ":disabled": "none" },
    opacity: { default: 1, ":disabled": 0.5 }
  }
})
export function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  rangeColor,
  thumbColor,
  thumbContent,
  ...props
}: Primitive.Root.Props & { rangeColor?: string; thumbColor?: string; thumbContent?: ReactNode }) {
  const values = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]
  const vertical = props.orientation === "vertical"
  const inlineStyle: CSSProperties &
    Record<"--bridge-slider-range-color" | "--bridge-slider-thumb-color", string | undefined> = {
    "--bridge-slider-range-color": rangeColor,
    "--bridge-slider-thumb-color": thumbColor,
    ...props.style
  }
  return (
    <Primitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      style={inlineStyle}
      thumbAlignment="edge"
      {...props}
      className={(state) =>
        [
          stylex.props(style.root, vertical && style.verticalRoot).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <Primitive.Control {...stylex.props(style.control, vertical && style.verticalControl)}>
        <Primitive.Track data-slot="slider-track" {...stylex.props(style.track, vertical && style.verticalTrack)}>
          <Primitive.Indicator
            data-slot="slider-range"
            {...stylex.props(style.range, vertical && style.verticalRange)}
          />
        </Primitive.Track>
        {values.map((_, index) => (
          <Primitive.Thumb key={index} data-slot="slider-thumb" {...stylex.props(style.thumb)}>
            {thumbContent}
          </Primitive.Thumb>
        ))}
      </Primitive.Control>
    </Primitive.Root>
  )
}
