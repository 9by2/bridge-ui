import { Tooltip as Primitive } from "@base-ui/react/tooltip"
import * as stylex from "@stylexjs/stylex"

import { Theme } from "./theme"
import { token } from "./token.stylex"

const enter = stylex.keyframes({ from: { opacity: 0, scale: "0.95" }, to: { opacity: 1, scale: "1" } })
const exit = stylex.keyframes({ from: { opacity: 1, scale: "1" }, to: { opacity: 0, scale: "0.95" } })
const style = stylex.create({
  positioner: { isolation: "isolate", zIndex: 50 },
  popup: {
    boxSizing: "border-box",
    zIndex: 50,
    display: "inline-flex",
    width: "fit-content",
    maxWidth: 320,
    transformOrigin: "var(--transform-origin)",
    alignItems: "center",
    gap: "var(--bridge-unit-6, 6px)",
    borderRadius: "var(--bridge-radius-8, 0.5em)",
    backgroundColor: token.foreground,
    paddingInline: "var(--bridge-unit-12, 12px)",
    paddingBlock: "var(--bridge-unit-6, 6px)",
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px",
    color: token.background,
    animationName: enter,
    animationDuration: { default: "150ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  closed: { animationName: exit },
  arrow: {
    zIndex: 50,
    width: 10,
    height: 10,
    rotate: "45deg",
    borderRadius: "var(--bridge-radius-2, 0.125em)",
    backgroundColor: token.foreground,
    fill: token.foreground,
    translate: "0 calc(-50% - 2px)"
  },
  bottom: { top: 4 },
  top: { bottom: -10 },
  left: { top: "50%", right: -4, translate: "0 -50%" },
  right: { top: "50%", left: -4, translate: "0 -50%" }
})
export function TooltipProvider({ delay = 0, ...props }: Primitive.Provider.Props) {
  return <Primitive.Provider delay={delay} {...props} />
}
export function Tooltip(props: Primitive.Root.Props) {
  return <Primitive.Root {...props} />
}
export function TooltipTrigger(props: Primitive.Trigger.Props) {
  return <Primitive.Trigger data-slot="tooltip-trigger" {...props} />
}
export function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: Primitive.Popup.Props & Pick<Primitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <Primitive.Portal>
      <Theme>
        <Primitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          {...stylex.props(style.positioner)}>
          <Primitive.Popup
            data-slot="tooltip-content"
            {...props}
            className={(state) =>
              [
                stylex.props(style.popup, !state.open && style.closed).className,
                typeof className === "function" ? className(state) : className
              ]
                .filter(Boolean)
                .join(" ")
            }>
            {children}
            <Primitive.Arrow
              className={(state) =>
                stylex.props(
                  style.arrow,
                  state.side === "top" && style.top,
                  state.side === "bottom" && style.bottom,
                  (state.side === "left" || state.side === "inline-start") && style.left,
                  (state.side === "right" || state.side === "inline-end") && style.right
                ).className
              }
            />
          </Primitive.Popup>
        </Primitive.Positioner>
      </Theme>
    </Primitive.Portal>
  )
}
