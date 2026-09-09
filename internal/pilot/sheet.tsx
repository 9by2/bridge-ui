import { Dialog as Primitive } from "@base-ui/react/dialog"
import * as stylex from "@stylexjs/stylex"
import { XIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { Button } from "./button"
import { Theme } from "./theme"
import { token } from "./token.stylex"

const style = stylex.create({
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 50,
    backgroundColor: "rgb(0 0 0 / 10%)",
    transitionProperty: "opacity",
    transitionDuration: { default: "150ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    opacity: { default: 1, ":is([data-starting-style], [data-ending-style])": 0 },
    backdropFilter: "blur(4px)"
  },
  popup: {
    position: "fixed",
    boxSizing: "border-box",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    backgroundColor: token.background,
    backgroundClip: "padding-box",
    fontSize: 14,
    lineHeight: "20px",
    color: token.foreground,
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)",
    transitionProperty: "opacity, translate",
    transitionDuration: { default: "200ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    transitionTimingFunction: "ease-in-out",
    opacity: { default: 1, ":is([data-starting-style], [data-ending-style])": 0 },
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: token.border
  },
  right: {
    top: 0,
    bottom: 0,
    right: 0,
    height: "100%",
    width: "75%",
    maxWidth: { default: "none", "@media (min-width: 640px)": 384 },
    borderLeftWidth: 1,
    translate: { default: "none", ":is([data-starting-style], [data-ending-style])": "40px 0" }
  },
  left: {
    top: 0,
    bottom: 0,
    left: 0,
    height: "100%",
    width: "75%",
    maxWidth: { default: "none", "@media (min-width: 640px)": 384 },
    borderRightWidth: 1,
    translate: { default: "none", ":is([data-starting-style], [data-ending-style])": "-40px 0" }
  },
  top: {
    left: 0,
    right: 0,
    top: 0,
    height: "auto",
    borderBottomWidth: 1,
    translate: { default: "none", ":is([data-starting-style], [data-ending-style])": "0 -40px" }
  },
  bottom: {
    left: 0,
    right: 0,
    bottom: 0,
    height: "auto",
    borderTopWidth: 1,
    translate: { default: "none", ":is([data-starting-style], [data-ending-style])": "0 40px" }
  },
  close: { position: "absolute", top: 12, right: 12 },
  icon: { width: 16, height: 16 },
  header: { display: "flex", flexDirection: "column", gap: 2, padding: 16 },
  footer: { marginTop: "auto", display: "flex", flexDirection: "column", gap: 8, padding: 16 },
  title: {
    margin: 0,
    fontFamily: "inherit",
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 500,
    color: token.foreground
  },
  description: { margin: 0, fontSize: 14, lineHeight: "20px", color: token.mutedForeground }
})
export function Sheet(props: Primitive.Root.Props) {
  return <Primitive.Root {...props} />
}
export function SheetTrigger(props: Primitive.Trigger.Props) {
  return <Primitive.Trigger data-slot="sheet-trigger" {...props} />
}
export function SheetClose(props: Primitive.Close.Props) {
  return <Primitive.Close data-slot="sheet-close" {...props} />
}
export function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: Primitive.Popup.Props & { side?: "top" | "right" | "bottom" | "left"; showCloseButton?: boolean }) {
  return (
    <Primitive.Portal data-slot="sheet-portal">
      <Theme>
        <Primitive.Backdrop data-slot="sheet-overlay" {...stylex.props(style.overlay)} />
        <Primitive.Popup
          data-slot="sheet-content"
          data-side={side}
          {...props}
          className={(state) =>
            [
              stylex.props(style.popup, style[side]).className,
              typeof className === "function" ? className(state) : className
            ]
              .filter(Boolean)
              .join(" ")
          }>
          {children}
          {showCloseButton && (
            <Primitive.Close
              data-slot="sheet-close"
              aria-label="Close"
              render={<Button variant="ghost" size="icon-sm" className={stylex.props(style.close).className} />}>
              <XIcon {...stylex.props(style.icon)} />
            </Primitive.Close>
          )}
        </Primitive.Popup>
      </Theme>
    </Primitive.Portal>
  )
}
export function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      {...props}
      className={[stylex.props(style.header).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      {...props}
      className={[stylex.props(style.footer).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SheetTitle({ className, ...props }: Primitive.Title.Props) {
  return (
    <Primitive.Title
      data-slot="sheet-title"
      {...props}
      className={(state) =>
        [stylex.props(style.title).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function SheetDescription({ className, ...props }: Primitive.Description.Props) {
  return (
    <Primitive.Description
      data-slot="sheet-description"
      {...props}
      className={(state) =>
        [stylex.props(style.description).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
