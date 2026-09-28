import { MessageScroller as Primitive } from "@shadcn/react/message-scroller"
import * as stylex from "@stylexjs/stylex"
import { ArrowDownIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { Button } from "./button"
import { token } from "./token.stylex"

export {
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility
} from "@shadcn/react/message-scroller"
const style = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%",
    minHeight: 0,
    flexDirection: "column",
    overflow: "hidden"
  },
  viewport: {
    width: "100%",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
    overflowY: "auto",
    overscrollBehavior: "contain",
    contain: "content",
    scrollbarColor: { default: "auto", ":is([data-autoscrolling])": "transparent transparent" },
    visibility: { default: "visible", ":is([data-pending-scroll])": "hidden" }
  },
  content: {
    display: "flex",
    height: "max-content",
    minHeight: "100%",
    flexDirection: "column",
    gap: "var(--bridge-unit-24, 24px)"
  },
  item: { minWidth: 0, flexShrink: 0, containIntrinsicSize: "auto 10rem", contentVisibility: "auto" },
  button: {
    position: "absolute",
    insetInlineStart: "50%",
    translate: { default: "-50% 0", ":dir(rtl)": "50% 0" },
    borderColor: token.border,
    backgroundColor: { default: token.background, ":hover": token.muted },
    color: token.foreground,
    transitionProperty: "translate, scale, opacity",
    transitionDuration: { default: "200ms", ':is([data-active="false"])': "400ms" },
    pointerEvents: { default: "auto", ':is([data-active="false"])': "none" },
    scale: { default: "1", ':is([data-active="false"])': "0.95" },
    opacity: { default: 1, ':is([data-active="false"])': 0 },
    transitionTimingFunction: {
      default: "cubic-bezier(0.23,1,0.32,1)",
      ':is([data-active="false"])': "cubic-bezier(0.7,0,0.84,0)"
    }
  },
  end: { bottom: 16 },
  start: { top: 16 },
  icon: { width: 16, height: 16 },
  reverse: { rotate: "180deg" },
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0
  }
})
export function MessageScrollerProvider(props: ComponentProps<typeof Primitive.Provider>) {
  return <Primitive.Provider {...props} />
}
export function MessageScroller({ className, ...props }: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      data-slot="message-scroller"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function MessageScrollerViewport({ className, ...props }: ComponentProps<typeof Primitive.Viewport>) {
  return (
    <Primitive.Viewport
      data-slot="message-scroller-viewport"
      {...props}
      className={[stylex.props(style.viewport).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function MessageScrollerContent({ className, ...props }: ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Content
      data-slot="message-scroller-content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function MessageScrollerItem({
  className,
  scrollAnchor = false,
  ...props
}: ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item
      data-slot="message-scroller-item"
      scrollAnchor={scrollAnchor}
      {...props}
      className={[stylex.props(style.item).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function MessageScrollerButton({
  direction = "end",
  className,
  children,
  render,
  variant = "secondary",
  size = "icon-sm",
  ...props
}: ComponentProps<typeof Primitive.Button> & Pick<ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Primitive.Button
      data-slot="message-scroller-button"
      data-direction={direction}
      data-variant={variant}
      data-size={size}
      direction={direction}
      render={render ?? <Button variant={variant} size={size} />}
      {...props}
      className={[stylex.props(style.button, direction === "end" ? style.end : style.start).className, className]
        .filter(Boolean)
        .join(" ")}>
      {children ?? (
        <>
          <ArrowDownIcon {...stylex.props(style.icon, direction === "start" && style.reverse)} />
          <span {...stylex.props(style.hidden)}>{direction === "end" ? "Scroll to end" : "Scroll to start"}</span>
        </>
      )}
    </Primitive.Button>
  )
}
