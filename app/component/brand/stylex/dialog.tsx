import { Dialog as Primitive } from "@base-ui/react/dialog"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { Button } from "./button"
import { Theme } from "./theme"
import { dialogToken, themeToken, token } from "./token.stylex"

const enter = stylex.keyframes({ from: { opacity: 0, scale: "0.95" }, to: { opacity: 1, scale: "1" } })
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
const exit = stylex.keyframes({ from: { opacity: 1, scale: "1" }, to: { opacity: 0, scale: "0.95" } })
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } })

const style = stylex.create({
  popupExit: { animationName: exit },
  overlayExit: { animationName: fadeOut },
  overlay: {
    animationName: fade,
    animationDuration: { default: "100ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    animationTimingFunction: "ease",
    position: "fixed",
    inset: 0,
    isolation: "isolate",
    zIndex: 50,
    backgroundColor: "rgb(0 0 0 / 10%)",
    backdropFilter: "blur(4px)"
  },
  popup: {
    animationName: enter,
    animationDuration: { default: "100ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    animationTimingFunction: "ease",
    position: "fixed",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    "@media (min-width: 640px)": { top: "50%", bottom: "auto", transform: "translate(-50%, -50%)" },
    zIndex: 50,
    display: "grid",
    boxSizing: "border-box",
    width: "100%",
    maxWidth: { default: "calc(100% - 2rem)", "@media (min-width: 640px)": "24rem" },
    gap: dialogToken["--bridge-layout-gap"],
    borderRadius: dialogToken["--bridge-overlay-radius"],
    backgroundColor: dialogToken["--bridge-color-dialog"],
    color: dialogToken["--bridge-color-dialog-foreground"],
    padding: dialogToken["--bridge-surface-padding"],
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    boxShadow: `0 0 0 1px color-mix(in oklch, ${token.foreground}, transparent 90%)`,
    outline: "none"
  },
  close: {
    position: "absolute",
    top: 8,
    right: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: themeToken.border,
    borderRadius: token.shapePill
  },
  icon: {
    display: "flex",
    width: 40,
    aspectRatio: "1",
    alignItems: "center",
    justifyContent: "center",
    color: token.highlight
  },
  header: { display: "flex", flexDirection: "column", gap: 8 },
  footer: {
    boxSizing: "border-box",
    display: "flex",
    flexDirection: { default: "column-reverse", "@media (min-width: 640px)": "row" },
    justifyContent: "flex-end",
    gap: 8,
    marginInline: `calc(${dialogToken["--bridge-surface-padding"]} * -1)`,
    marginBottom: `calc(${dialogToken["--bridge-surface-padding"]} * -1)`,
    borderBottomLeftRadius: dialogToken["--bridge-overlay-radius"],
    borderBottomRightRadius: dialogToken["--bridge-overlay-radius"],
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: themeToken.border,
    backgroundColor: `color-mix(in oklch, ${themeToken.muted}, transparent 50%)`,
    padding: dialogToken["--bridge-surface-padding"]
  },
  title: { fontFamily: token.fontHeading, fontSize: "var(--bridge-font-size-lg, 1em)", lineHeight: 1, fontWeight: 500, margin: 0 },
  description: { color: themeToken.mutedForeground, fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: "20px", margin: 0 }
})
export function Dialog(props: Primitive.Root.Props) {
  return <Primitive.Root {...props} />
}
export function DialogTrigger(props: Primitive.Trigger.Props) {
  return <Primitive.Trigger data-slot="dialog-trigger" {...props} />
}
export function DialogClose(props: Primitive.Close.Props) {
  return <Primitive.Close data-slot="dialog-close" {...props} />
}
export function DialogPortal({ children, ...props }: Primitive.Portal.Props) {
  return (
    <Primitive.Portal data-slot="dialog-portal" {...props}>
      <Theme>{children}</Theme>
    </Primitive.Portal>
  )
}
export function DialogOverlay({ className, ...props }: Primitive.Backdrop.Props) {
  return (
    <Primitive.Backdrop
      data-slot="dialog-overlay"
      {...props}
      className={(state) =>
        [
          stylex.props(style.overlay, !state.open && style.overlayExit).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function DialogContent({
  className,
  children,
  showCloseButton = true,
  closeLabel,
  ...props
}: Primitive.Popup.Props & { showCloseButton?: boolean; closeLabel?: string }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <Primitive.Popup
        data-slot="dialog-content"
        {...props}
        className={(state) =>
          [
            stylex.props(style.popup, !state.open && style.popupExit).className,
            typeof className === "function" ? className(state) : className
          ]
            .filter(Boolean)
            .join(" ")
        }>
        {children}
        {showCloseButton && (
          <Primitive.Close
            data-slot="dialog-close"
            render={<Button variant="ghost" size="icon-sm" className={stylex.props(style.close).className} />}
            aria-label={closeLabel ?? "dialog-close"}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </Primitive.Close>
        )}
      </Primitive.Popup>
    </DialogPortal>
  )
}
export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      {...props}
      className={[stylex.props(style.header).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function DialogFooter({
  className,
  children,
  showCloseButton = false,
  closeLabel,
  ...props
}: ComponentProps<"div"> & { showCloseButton?: boolean; closeLabel?: string }) {
  return (
    <div
      data-slot="dialog-footer"
      {...props}
      className={[stylex.props(style.footer).className, className].filter(Boolean).join(" ")}>
      {children}
      {showCloseButton && (
        <DialogClose render={<Button variant="outline" />}>{closeLabel ?? "dialog-close"}</DialogClose>
      )}
    </div>
  )
}
export function DialogTitle({ className, ...props }: Primitive.Title.Props) {
  const base = stylex.props(style.title).className
  return (
    <Primitive.Title
      data-slot="dialog-title"
      {...props}
      className={
        typeof className === "function" ? (state) => `${base} ${className(state)}` : `${base} ${className ?? ""}`
      }
    />
  )
}
export function DialogDescription({ className, ...props }: Primitive.Description.Props) {
  const base = stylex.props(style.description).className
  return (
    <Primitive.Description
      data-slot="dialog-description"
      {...props}
      className={
        typeof className === "function" ? (state) => `${base} ${className(state)}` : `${base} ${className ?? ""}`
      }
    />
  )
}

export function DialogIcon({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-icon"
      {...props}
      className={[stylex.props(style.icon).className, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  )
}
