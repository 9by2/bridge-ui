import { Drawer as Primitive } from "@base-ui/react/drawer"
import * as stylex from "@stylexjs/stylex"
import { createContext, useContext, useMemo, type ComponentProps } from "react"

import { Theme } from "./theme"
import { token } from "./token.stylex"

type Option = {
  hasSnapPoints: boolean
  modal: Primitive.Root.Props["modal"]
  showSwipeHandle: boolean
  swipeDirection: NonNullable<Primitive.Root.Props["swipeDirection"]>
}
const Context = createContext<Option | null>(null)
const stackProgress = "clamp(0, var(--drawer-swipe-progress), 1)"
const scale = `clamp(0, calc(max(0, calc(1 - var(--nested-drawers) * 0.05)) + 0.05 * ${stackProgress}), 1)`
const peek = `max(0px, calc((var(--nested-drawers) - ${stackProgress}) * 1rem))`
const stackHeight = "var(--drawer-frontmost-height, var(--drawer-height, 0px))"
const style = stylex.create({
  bleed: {
    content: { "::after": '""' },
    position: { default: "fixed", "::after": "absolute" },
    pointerEvents: { default: "auto", "::after": "none" },
    backgroundColor: { default: token.background, "::after": `var(--drawer-bleed-background, ${token.background})` }
  },
  bleedDown: {
    left: { default: 0, "::after": 0 },
    right: { default: 0, "::after": 0 },
    top: { default: "auto", "::after": "100%" },
    height: {
      default: "var(--drawer-height, auto)",
      ":is([data-snap-points])": "100dvh",
      ":is([data-nested-drawer-open])": stackHeight,
      "::after": "3rem"
    }
  },
  bleedUp: {
    left: { default: 0, "::after": 0 },
    right: { default: 0, "::after": 0 },
    bottom: { default: "auto", "::after": "100%" },
    height: {
      default: "var(--drawer-height, auto)",
      ":is([data-snap-points])": "100dvh",
      ":is([data-nested-drawer-open])": stackHeight,
      "::after": "3rem"
    }
  },
  bleedLeft: {
    top: { default: 0, "::after": 0 },
    bottom: { default: 0, "::after": 0 },
    right: { default: "auto", "::after": "100%" },
    width: { default: "75%", "@media (min-width: 640px)": "24rem", "::after": "3rem" }
  },
  bleedRight: {
    top: { default: 0, "::after": 0 },
    bottom: { default: 0, "::after": 0 },
    left: { default: "auto", "::after": "100%" },
    width: { default: "75%", "@media (min-width: 640px)": "24rem", "::after": "3rem" }
  },
  handleRelation: {
    transitionProperty: "opacity",
    transitionDuration: "200ms",
    opacity: {
      default: 1,
      [stylex.when.ancestor("[data-nested-drawer-open]")]: 0,
      [stylex.when.ancestor("[data-nested-drawer-swiping]")]: 1
    },
    height: { default: 12, [stylex.when.ancestor('[data-swipe-axis="x"]')]: "100%" },
    width: { default: "100%", [stylex.when.ancestor('[data-swipe-axis="x"]')]: 12 },
    alignItems: {
      default: "end",
      [stylex.when.ancestor('[data-swipe-axis="x"]')]: "center",
      [stylex.when.ancestor('[data-swipe-direction="up"]')]: "start"
    },
    justifyContent: {
      default: "center",
      [stylex.when.ancestor('[data-swipe-direction="left"]')]: "start",
      [stylex.when.ancestor('[data-swipe-direction="right"]')]: "end"
    },
    order: {
      default: 0,
      [stylex.when.ancestor(':is([data-swipe-direction="left"], [data-swipe-direction="up"])')]: 9999
    }
  },
  gripRelation: {
    height: { default: 4, [stylex.when.ancestor('[data-swipe-axis="x"]')]: 96 },
    width: { default: 96, [stylex.when.ancestor('[data-swipe-axis="x"]')]: 4 }
  },
  overlay: {
    position: { default: "fixed", "@supports (-webkit-touch-callout: none)": "absolute" },
    inset: 0,
    zIndex: 50,
    minHeight: "100dvh",
    backgroundColor: "rgb(0 0 0 / 10%)",
    opacity: {
      default: "max(var(--drawer-overlay-min-opacity, 0), calc(1 - var(--drawer-swipe-progress)))",
      ":is([data-starting-style], [data-ending-style])": 0
    },
    transitionProperty: "opacity",
    transitionDuration: {
      default: "450ms",
      ":is([data-ending-style])": "calc(var(--drawer-swipe-strength) * 400ms)",
      ":is([data-swiping])": "0s",
      "@media (prefers-reduced-motion: reduce)": "0s"
    },
    transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
    userSelect: "none",
    pointerEvents: { default: "auto", ":is([data-ending-style])": "none" },
    backdropFilter: "blur(4px)"
  },
  snapOverlay: {
    opacity: {
      default: "max(0.5, calc(1 - var(--drawer-swipe-progress)))",
      ":is([data-starting-style], [data-ending-style])": 0
    }
  },
  viewport: { pointerEvents: "none", position: "fixed", inset: 0, zIndex: 50, userSelect: "none" },
  modal: { pointerEvents: "auto" },
  popup: {
    pointerEvents: "auto",
    position: "fixed",
    boxSizing: "border-box",
    zIndex: 50,
    margin: "var(--drawer-inset, 0px)",
    display: "flex",
    height: "var(--drawer-height, auto)",
    minHeight: 0,
    width: "auto",
    flexDirection: "column",
    backgroundColor: token.background,
    color: token.foreground,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    transitionProperty: "transform, height, opacity, filter",
    transitionDuration: {
      default: "450ms",
      ":is([data-swiping], [data-nested-drawer-swiping])": "0s",
      ":is([data-ending-style])": "calc(var(--drawer-swipe-strength) * 400ms)",
      "@media (prefers-reduced-motion: reduce)": "0s"
    },
    transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
    willChange: "transform",
    outline: "none",
    userSelect: "none",
    interpolateSize: "allow-keywords",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: token.border,
    overflow: { default: "visible", ":is([data-nested-drawer-open])": "hidden" },
    filter: { default: "none", ":is([data-nested-drawer-open])": "brightness(0.95)" },
    opacity: { default: 1, ":is([data-ending-style])": 0.9999 }
  },
  y: {
    left: 0,
    right: 0,
    maxHeight: "calc(100dvh - 6rem)",
    height: { default: "var(--drawer-height, auto)", ":is([data-nested-drawer-open])": stackHeight }
  },
  x: { top: 0, bottom: 0, flexDirection: "row", width: { default: "75%", "@media (min-width: 640px)": "24rem" } },
  snap: { height: { default: "100dvh", ":is([data-nested-drawer-open])": stackHeight } },
  down: {
    bottom: 0,
    transformOrigin: "bottom",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderTopWidth: 1,
    transform: {
      default: `translate3d(0, calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y) - ${peek} - (1 - ${scale}) * ${stackHeight}), 0) scale(${scale})`,
      ":is([data-starting-style], [data-ending-style])":
        "translate3d(0, calc(100% + var(--drawer-inset, 0px) + 2px), 0)"
    }
  },
  up: {
    top: 0,
    transformOrigin: "top",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderBottomWidth: 1,
    transform: {
      default: `translate3d(0, calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y) + ${peek} + (1 - ${scale}) * ${stackHeight}), 0) scale(${scale})`,
      ":is([data-starting-style], [data-ending-style])":
        "translate3d(0, calc(-100% - var(--drawer-inset, 0px) - 2px), 0)"
    }
  },
  left: {
    left: 0,
    transformOrigin: "left",
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    borderRightWidth: 1,
    transform: {
      default: `translate3d(calc(var(--drawer-swipe-movement-x) + ${peek} + (1 - ${scale}) * 100%), 0, 0) scale(${scale})`,
      ":is([data-starting-style], [data-ending-style])":
        "translate3d(calc(-100% - var(--drawer-inset, 0px) - 2px), 0, 0)"
    }
  },
  right: {
    right: 0,
    transformOrigin: "right",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    borderLeftWidth: 1,
    transform: {
      default: `translate3d(calc(var(--drawer-swipe-movement-x) - ${peek} - (1 - ${scale}) * 100%), 0, 0) scale(${scale})`,
      ":is([data-starting-style], [data-ending-style])":
        "translate3d(calc(100% + var(--drawer-inset, 0px) + 2px), 0, 0)"
    }
  },
  content: {
    display: "flex",
    minHeight: 0,
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
    overscrollBehavior: "contain",
    borderRadius: "inherit",
    transitionProperty: "opacity",
    transitionDuration: "300ms",
    transitionTimingFunction: "cubic-bezier(0.45,1.005,0,1.005)",
    userSelect: { default: "text", [stylex.when.ancestor("[data-swiping]")]: "none" },
    opacity: {
      default: 1,
      [stylex.when.ancestor("[data-nested-drawer-open]")]: 0,
      [stylex.when.ancestor("[data-nested-drawer-swiping]")]: 1
    }
  },
  handle: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexShrink: 0,
    cursor: { default: "grab", ":active": "grabbing" },
    height: 12,
    width: "100%",
    justifyContent: "center",
    alignItems: "end"
  },
  grip: {
    display: "block",
    flexShrink: 0,
    borderRadius: "var(--bridge-radius-9999, 9999em)",
    backgroundColor: token.muted,
    width: 96,
    height: 4
  },
  header: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    gap: 2,
    padding: 16,
    paddingBottom: 0,
    textAlign: {
      default: "left",
      [stylex.when.ancestor('[data-swipe-axis="y"]')]: { default: "center", "@media (min-width: 768px)": "left" }
    }
  },
  footer: {
    marginTop: "auto",
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    gap: 8,
    padding: 16,
    paddingTop: 0
  },
  title: {
    margin: 0,
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-lg, 1em)",
    lineHeight: "24px",
    fontWeight: 500,
    color: token.foreground
  },
  description: {
    margin: 0,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    textWrap: "balance",
    color: token.mutedForeground
  }
})
export function Drawer({
  modal = true,
  showSwipeHandle = false,
  snapPoints,
  swipeDirection = "down",
  ...props
}: Primitive.Root.Props & { showSwipeHandle?: boolean }) {
  const context = useMemo(
    () => ({ modal, showSwipeHandle, hasSnapPoints: snapPoints != null && snapPoints.length > 0, swipeDirection }),
    [modal, showSwipeHandle, snapPoints, swipeDirection]
  )
  return (
    <Context value={context}>
      <Primitive.Root modal={modal} snapPoints={snapPoints} swipeDirection={swipeDirection} {...props} />
    </Context>
  )
}
export function DrawerTrigger(props: Primitive.Trigger.Props) {
  return <Primitive.Trigger data-slot="drawer-trigger" {...props} />
}
export function DrawerClose(props: Primitive.Close.Props) {
  return <Primitive.Close data-slot="drawer-close" {...props} />
}
export function DrawerPortal({ children, ...props }: Primitive.Portal.Props) {
  return (
    <Primitive.Portal data-slot="drawer-portal" {...props}>
      <Theme>{children}</Theme>
    </Primitive.Portal>
  )
}
export function DrawerOverlay({ className, ...props }: Primitive.Backdrop.Props) {
  const context = useContext(Context)
  return (
    <Primitive.Backdrop
      data-slot="drawer-overlay"
      {...props}
      className={(state) =>
        [
          stylex.props(style.overlay, context?.hasSnapPoints && style.snapOverlay).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function DrawerSwipeHandle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-swipe-handle"
      aria-hidden="true"
      {...props}
      className={[stylex.props(style.handle, style.handleRelation).className, className].filter(Boolean).join(" ")}>
      <div {...stylex.props(style.grip, style.gripRelation)} />
    </div>
  )
}
export function DrawerContent({ className, children, ...props }: Primitive.Popup.Props) {
  const context = useContext(Context)
  if (!context) throw new Error("useDrawer must be used within a Drawer.")
  const { hasSnapPoints, modal, showSwipeHandle, swipeDirection } = context
  const y = swipeDirection === "down" || swipeDirection === "up"
  return (
    <DrawerPortal>
      {modal === true && <DrawerOverlay data-snap-points={hasSnapPoints ? "" : undefined} />}
      <Primitive.Viewport
        data-slot="drawer-viewport"
        data-modal={modal}
        {...stylex.props(style.viewport, modal === true && style.modal)}>
        <Primitive.Popup
          data-slot="drawer-popup"
          data-swipe-axis={y ? "y" : "x"}
          data-snap-points={hasSnapPoints ? "" : undefined}
          {...props}
          className={(state) =>
            [
              stylex.props(
                stylex.defaultMarker(),
                style.popup,
                y ? style.y : style.x,
                y && hasSnapPoints && style.snap,
                style[swipeDirection],
                style.bleed,
                swipeDirection === "down" && style.bleedDown,
                swipeDirection === "up" && style.bleedUp,
                swipeDirection === "left" && style.bleedLeft,
                swipeDirection === "right" && style.bleedRight
              ).className,
              typeof className === "function" ? className(state) : className
            ]
              .filter(Boolean)
              .join(" ")
          }>
          {showSwipeHandle && <DrawerSwipeHandle />}
          <Primitive.Content data-slot="drawer-content" {...stylex.props(style.content)}>
            {children}
          </Primitive.Content>
        </Primitive.Popup>
      </Primitive.Viewport>
    </DrawerPortal>
  )
}
export function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      {...props}
      className={[stylex.props(style.header).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      {...props}
      className={[stylex.props(style.footer).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function DrawerTitle({ className, ...props }: Primitive.Title.Props) {
  return (
    <Primitive.Title
      data-slot="drawer-title"
      {...props}
      className={(state) =>
        [stylex.props(style.title).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function DrawerDescription({ className, ...props }: Primitive.Description.Props) {
  return (
    <Primitive.Description
      data-slot="drawer-description"
      {...props}
      className={(state) =>
        [stylex.props(style.description).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
