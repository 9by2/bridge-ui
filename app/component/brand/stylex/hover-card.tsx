import { PreviewCard as Primitive } from "@base-ui/react/preview-card"
import * as stylex from "@stylexjs/stylex"

import { Theme } from "./theme"
import { effectToken, token } from "./token.stylex"

const enter = stylex.keyframes({ from: { opacity: 0, scale: "0.95" }, to: { opacity: 1, scale: "1" } })
const exit = stylex.keyframes({ from: { opacity: 1, scale: "1" }, to: { opacity: 0, scale: "0.95" } })
const style = stylex.create({
  positioner: { isolation: "isolate", zIndex: 50 },
  popup: {
    boxSizing: "border-box",
    zIndex: 50,
    width: 256,
    transformOrigin: "var(--transform-origin)",
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    backgroundColor: token.background,
    padding: "var(--bridge-unit-10, 10px)",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    color: token.foreground,
    boxShadow: `0 0 0 1px color-mix(in oklch, ${token.foreground}, transparent 90%), ${effectToken.shadowMd}`,
    outline: "none",
    animationName: enter,
    animationDuration: { default: "100ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  closed: { animationName: exit }
})
export function HoverCard(props: Primitive.Root.Props) {
  return <Primitive.Root {...props} />
}
export function HoverCardTrigger(props: Primitive.Trigger.Props) {
  return <Primitive.Trigger data-slot="hover-card-trigger" {...props} />
}
export function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  ...props
}: Primitive.Popup.Props & Pick<Primitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <Primitive.Portal data-slot="hover-card-portal">
      <Theme>
        <Primitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          {...stylex.props(style.positioner)}>
          <Primitive.Popup
            data-slot="hover-card-content"
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
