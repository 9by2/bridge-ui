import { ScrollArea as Primitive } from "@base-ui/react/scroll-area"
import * as stylex from "@stylexjs/stylex"

import { token } from "./token.stylex"

const style = stylex.create({
  root: { position: "relative" },
  viewport: {
    width: "100%",
    height: "100%",
    borderRadius: "inherit",
    transitionProperty: "color, box-shadow",
    transitionDuration: "150ms",
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` }
  },
  bar: {
    boxSizing: "border-box",
    display: "flex",
    touchAction: "none",
    padding: 1,
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    userSelect: "none"
  },
  horizontal: {
    height: 10,
    flexDirection: "column",
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: "transparent"
  },
  vertical: { height: "100%", width: 10, borderLeftWidth: 1, borderLeftStyle: "solid", borderLeftColor: "transparent" },
  thumb: {
    position: "relative",
    flex: 1,
    borderRadius: "var(--bridge-radius-9999, 9999em)",
    backgroundColor: token.border
  }
})
export function ScrollArea({ className, children, ...props }: Primitive.Root.Props) {
  return (
    <Primitive.Root
      data-slot="scroll-area"
      {...props}
      className={(state) =>
        [stylex.props(style.root).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }>
      <Primitive.Viewport data-slot="scroll-area-viewport" {...stylex.props(style.viewport)}>
        {children}
      </Primitive.Viewport>
      <ScrollBar />
      <Primitive.Corner />
    </Primitive.Root>
  )
}
export function ScrollBar({ className, orientation = "vertical", ...props }: Primitive.Scrollbar.Props) {
  return (
    <Primitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      {...props}
      className={(state) =>
        [
          stylex.props(style.bar, orientation === "horizontal" ? style.horizontal : style.vertical).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <Primitive.Thumb data-slot="scroll-area-thumb" {...stylex.props(style.thumb)} />
    </Primitive.Scrollbar>
  )
}
