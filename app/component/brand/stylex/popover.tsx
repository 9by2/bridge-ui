import { Popover as Primitive } from "@base-ui/react/popover"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { Theme } from "./theme"
import { effectToken, geometryToken, themeToken, token } from "./token.stylex"

const enter = stylex.keyframes({ from: { opacity: 0, scale: "0.95" }, to: { opacity: 1, scale: "1" } })
const exit = stylex.keyframes({ from: { opacity: 1, scale: "1" }, to: { opacity: 0, scale: "0.95" } })
const style = stylex.create({
  positioner: { isolation: "isolate", zIndex: 50 },
  popup: {
    boxSizing: "border-box",
    zIndex: 50,
    display: "flex",
    width: 288,
    transformOrigin: "var(--transform-origin)",
    flexDirection: "column",
    gap: geometryToken.layoutGap,
    borderRadius: geometryToken.overlayRadius,
    backgroundColor: themeToken.popover,
    padding: geometryToken.surfacePadding,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    color: themeToken.popoverForeground,
    boxShadow: `0 0 0 1px color-mix(in oklch, ${themeToken.foreground}, transparent 90%), ${effectToken.shadowMd}`,
    outline: "none",
    animationName: enter,
    animationDuration: { default: "100ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  closed: { animationName: exit },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px"
  },
  title: { fontFamily: token.fontHeading, fontWeight: 500, margin: 0 },
  description: { color: themeToken.mutedForeground, margin: 0 }
})
export function Popover(props: Primitive.Root.Props) {
  return <Primitive.Root {...props} />
}
export function PopoverTrigger(props: Primitive.Trigger.Props) {
  return <Primitive.Trigger data-slot="popover-trigger" {...props} />
}
export function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: Primitive.Popup.Props & Pick<Primitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <Primitive.Portal>
      <Theme>
        <Primitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          {...stylex.props(style.positioner)}>
          <Primitive.Popup
            data-slot="popover-content"
            {...props}
            className={(state) =>
              [
                stylex.props(style.popup, !state.open && style.closed).className,
                typeof className === "function" ? className(state) : className
              ]
                .filter(Boolean)
                .join(" ")
            }
          />
        </Primitive.Positioner>
      </Theme>
    </Primitive.Portal>
  )
}
export function PopoverHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      {...props}
      className={[stylex.props(style.header).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function PopoverTitle({ className, ...props }: Primitive.Title.Props) {
  return (
    <Primitive.Title
      data-slot="popover-title"
      {...props}
      className={(state) =>
        [stylex.props(style.title).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function PopoverDescription({ className, ...props }: Primitive.Description.Props) {
  return (
    <Primitive.Description
      data-slot="popover-description"
      {...props}
      className={(state) =>
        [stylex.props(style.description).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
