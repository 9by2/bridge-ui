import { AlertDialog as Primitive } from "@base-ui/react/alert-dialog"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { Button } from "./button"
import { Theme } from "./theme"
import { token } from "./token.stylex"

const enter = stylex.keyframes({ from: { opacity: 0, scale: "0.95" }, to: { opacity: 1, scale: "1" } })
const exit = stylex.keyframes({ from: { opacity: 1, scale: "1" }, to: { opacity: 0, scale: "0.95" } })
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } })
const style = stylex.create({
  headerRelation: {
    placeItems: {
      default: "center",
      "@media (min-width: 640px)": { default: "center", [stylex.when.ancestor('[data-size="default"]')]: "start" }
    },
    textAlign: {
      default: "center",
      "@media (min-width: 640px)": { default: "center", [stylex.when.ancestor('[data-size="default"]')]: "left" }
    },
    gridTemplateRows: {
      default: "auto 1fr",
      ':has([data-slot="alert-dialog-media"])': {
        default: "auto auto 1fr",
        "@media (min-width: 640px)": {
          default: "auto auto 1fr",
          [stylex.when.ancestor('[data-size="default"]')]: "auto 1fr"
        }
      }
    }
  },
  footerRelation: {
    display: { default: "flex", [stylex.when.ancestor('[data-size="sm"]')]: "grid" },
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))"
  },
  mediaRelation: {
    gridRow: {
      default: "auto",
      "@media (min-width: 640px)": {
        default: "auto",
        [stylex.when.ancestor('[data-size="default"]')]: "span 2 / span 2"
      }
    }
  },
  titleRelation: {
    gridColumnStart: {
      default: "auto",
      "@media (min-width: 640px)": {
        default: "auto",
        [stylex.when.ancestor(':is([data-size="default"]):has([data-slot="alert-dialog-media"])')]: 2
      }
    }
  },
  overlay: {
    position: "fixed",
    inset: 0,
    isolation: "isolate",
    zIndex: 50,
    backgroundColor: "rgb(0 0 0 / 10%)",
    backdropFilter: "blur(4px)",
    animationName: fade,
    animationDuration: { default: "100ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  overlayExit: { animationName: fadeOut },
  popup: {
    position: "fixed",
    top: "50%",
    left: "50%",
    zIndex: 50,
    display: "grid",
    boxSizing: "border-box",
    width: "100%",
    translate: "-50% -50%",
    gap: 16,
    borderRadius: 14,
    backgroundColor: token.background,
    color: token.foreground,
    padding: 16,
    boxShadow: `0 0 0 1px color-mix(in oklch, ${token.foreground}, transparent 90%)`,
    outline: "none",
    maxWidth: 320,
    animationName: enter,
    animationDuration: { default: "100ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  popupExit: { animationName: exit },
  normal: { maxWidth: { default: 320, "@media (min-width: 640px)": 384 } },
  header: {
    display: "grid",
    gridTemplateRows: { default: "auto 1fr", ':has([data-slot="alert-dialog-media"])': "auto auto 1fr" },
    placeItems: "center",
    gap: 6,
    textAlign: "center",
    columnGap: { default: 6, ':has([data-slot="alert-dialog-media"])': 16 }
  },
  desktopHeader: {
    placeItems: { default: "center", "@media (min-width: 640px)": "start" },
    textAlign: { default: "center", "@media (min-width: 640px)": "left" },
    gridTemplateRows: {
      default: "auto 1fr",
      ':has([data-slot="alert-dialog-media"])': { default: "auto auto 1fr", "@media (min-width: 640px)": "auto 1fr" }
    }
  },
  footer: {
    boxSizing: "border-box",
    marginInline: -16,
    marginBottom: -16,
    display: "flex",
    flexDirection: { default: "column-reverse", "@media (min-width: 640px)": "row" },
    justifyContent: { default: "normal", "@media (min-width: 640px)": "flex-end" },
    gap: 8,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: token.footerBorder,
    backgroundColor: `color-mix(in oklch, ${token.muted}, transparent 50%)`,
    padding: 16
  },
  smallFooter: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  media: {
    marginBottom: 8,
    display: "inline-flex",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: token.muted
  },
  desktopMedia: { gridRow: { default: "auto", "@media (min-width: 640px)": "span 2 / span 2" } },
  title: {
    margin: 0,
    fontFamily: "inherit",
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 500,
    letterSpacing: "0.0094em"
  },
  description: {
    margin: 0,
    fontSize: 14,
    lineHeight: "20px",
    textWrap: { default: "balance", "@media (min-width: 768px)": "pretty" },
    color: token.mutedForeground
  }
})
export function AlertDialog(props: Primitive.Root.Props) {
  return <Primitive.Root {...props} />
}
export function AlertDialogTrigger(props: Primitive.Trigger.Props) {
  return <Primitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}
export function AlertDialogPortal({ children, ...props }: Primitive.Portal.Props) {
  return (
    <Primitive.Portal data-slot="alert-dialog-portal" {...props}>
      <Theme>{children}</Theme>
    </Primitive.Portal>
  )
}
export function AlertDialogOverlay({ className, ...props }: Primitive.Backdrop.Props) {
  return (
    <Primitive.Backdrop
      data-slot="alert-dialog-overlay"
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
export function AlertDialogContent({
  className,
  size = "default",
  ...props
}: Primitive.Popup.Props & { size?: "default" | "sm" }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <Primitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        {...props}
        className={(state) =>
          [
            stylex.props(
              stylex.defaultMarker(),
              style.popup,
              size === "default" && style.normal,
              !state.open && style.popupExit
            ).className,
            typeof className === "function" ? className(state) : className
          ]
            .filter(Boolean)
            .join(" ")
        }
      />
    </AlertDialogPortal>
  )
}
export function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      {...props}
      className={[stylex.props(style.header, style.headerRelation).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      {...props}
      className={[stylex.props(style.footer, style.footerRelation).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AlertDialogMedia({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      {...props}
      className={[stylex.props(style.media, style.mediaRelation).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AlertDialogTitle({ className, ...props }: Primitive.Title.Props) {
  return (
    <Primitive.Title
      data-slot="alert-dialog-title"
      {...props}
      className={(state) =>
        [
          stylex.props(style.title, style.titleRelation).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function AlertDialogDescription({ className, ...props }: Primitive.Description.Props) {
  return (
    <Primitive.Description
      data-slot="alert-dialog-description"
      {...props}
      className={(state) =>
        [stylex.props(style.description).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function AlertDialogAction(props: ComponentProps<typeof Button>) {
  return <Button data-slot="alert-dialog-action" {...props} />
}
export function AlertDialogCancel({
  variant = "outline",
  size = "default",
  ...props
}: Primitive.Close.Props & Pick<ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <Primitive.Close data-slot="alert-dialog-cancel" render={<Button variant={variant} size={size} />} {...props} />
  )
}
