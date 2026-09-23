import { Dialog as Primitive } from "@base-ui/react/dialog"
import * as stylex from "@stylexjs/stylex"
import { XIcon } from "lucide-react"
import { useRef } from "react"
import type { ComponentProps, CSSProperties, PointerEvent } from "react"

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
    fontSize: "var(--bridge-font-size-base, 0.875em)",
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
  resizeHandle: {
    position: "absolute",
    zIndex: 1,
    borderRadius: "var(--bridge-radius-999, 999em)",
    backgroundColor: token.border,
    outline: "none",
    ":focus-visible": { boxShadow: `0 0 0 2px ${token.ring}` }
  },
  resizeHandleHorizontal: { top: "50%", width: 6, height: 48, cursor: "col-resize", translate: "0 -50%" },
  resizeHandleVertical: { left: "50%", width: 48, height: 6, cursor: "row-resize", translate: "-50% 0" },
  resizeHandleLeft: { left: -3 },
  resizeHandleRight: { right: -3 },
  resizeHandleTop: { top: -3 },
  resizeHandleBottom: { bottom: -3 },
  close: { position: "absolute", top: 12, right: 12 },
  icon: { width: 16, height: 16 },
  viewport: { minHeight: 0, flex: 1, overflowY: "auto" },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    backgroundColor: token.background,
    padding: 16
  },
  footer: { marginTop: "auto", display: "flex", flexDirection: "column", gap: 8, padding: 16 },
  title: {
    margin: 0,
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-lg, 1em)",
    lineHeight: "24px",
    fontWeight: 500,
    color: token.foreground
  },
  description: { margin: 0, fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: "20px", color: token.mutedForeground }
})
const ResizeHandleEdgeBySide = {
  right: style.resizeHandleLeft,
  left: style.resizeHandleRight,
  top: style.resizeHandleBottom,
  bottom: style.resizeHandleTop
} as const
const ResizableSheetMaxByAxis = { horizontal: "80vw", vertical: "70vh" } as const
export function Sheet({ onClose, onOpenChange, ...props }: Primitive.Root.Props & { onClose?: () => boolean | void }) {
  return (
    <Primitive.Root
      {...props}
      onOpenChange={(open, eventDetails) => {
        if (!open && onClose?.() === false) {
          eventDetails.cancel()
          return
        }
        onOpenChange?.(open, eventDetails)
      }}
    />
  )
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
  style: popupStyle,
  side = "right",
  showCloseButton = true,
  resizable = false,
  size,
  onSizeChange,
  maxWidth,
  maxHeight,
  ...props
}: Primitive.Popup.Props & {
  side?: "top" | "right" | "bottom" | "left"
  showCloseButton?: boolean
  resizable?: boolean
  size?: number
  onSizeChange?: (size: number) => void
  maxWidth?: CSSProperties["maxWidth"]
  maxHeight?: CSSProperties["maxHeight"]
}) {
  const resizeAxis = side === "left" || side === "right" ? "horizontal" : "vertical"
  const resizeStart = useRef<{ coordinate: number; dimension: number } | undefined>(undefined)
  const handleEdge = ResizeHandleEdgeBySide[side]
  const startResize = (event: PointerEvent<HTMLDivElement>) => {
    const dimension =
      resizeAxis === "horizontal"
        ? event.currentTarget.parentElement?.clientWidth
        : event.currentTarget.parentElement?.clientHeight
    resizeStart.current = {
      coordinate: resizeAxis === "horizontal" ? event.clientX : event.clientY,
      dimension: size ?? dimension ?? 0
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  const resize = (event: PointerEvent<HTMLDivElement>) => {
    if (!resizeStart.current) return
    const coordinate = resizeAxis === "horizontal" ? event.clientX : event.clientY
    const direction = side === "right" || side === "bottom" ? -1 : 1
    const minimum = resizeAxis === "horizontal" ? 288 : 192
    onSizeChange?.(
      Math.max(minimum, resizeStart.current.dimension + (coordinate - resizeStart.current.coordinate) * direction)
    )
  }
  const stopResize = () => {
    resizeStart.current = undefined
  }
  return (
    <Primitive.Portal data-slot="sheet-portal">
      <Theme>
        <Primitive.Backdrop data-slot="sheet-overlay" {...stylex.props(style.overlay)} />
        <Primitive.Popup
          data-slot="sheet-content"
          data-side={side}
          data-resizable={resizable || undefined}
          data-resize-axis={resizable ? resizeAxis : undefined}
          {...props}
          style={(state) => ({
            ...(typeof popupStyle === "function" ? popupStyle(state) : popupStyle),
            ...(resizeAxis === "horizontal"
              ? { width: size, maxWidth: maxWidth ?? (resizable ? ResizableSheetMaxByAxis.horizontal : undefined) }
              : { height: size, maxHeight: maxHeight ?? (resizable ? ResizableSheetMaxByAxis.vertical : undefined) })
          })}
          className={(state) =>
            [
              stylex.props(style.popup, style[side]).className,
              typeof className === "function" ? className(state) : className
            ]
              .filter(Boolean)
              .join(" ")
          }>
          <div
            data-slot="sheet-content-viewport"
            data-testid="sheet-content-viewport"
            {...stylex.props(style.viewport)}>
            {children}
          </div>
          {showCloseButton && (
            <Primitive.Close
              data-slot="sheet-close"
              aria-label="Close"
              render={<Button variant="ghost" size="icon-sm" className={stylex.props(style.close).className} />}>
              <XIcon {...stylex.props(style.icon)} />
            </Primitive.Close>
          )}
          {resizable && (
            <div
              role="separator"
              tabIndex={0}
              aria-label={resizeAxis === "horizontal" ? "Resize width" : "Resize height"}
              aria-orientation={resizeAxis === "horizontal" ? "vertical" : "horizontal"}
              data-slot="sheet-resize-handle"
              onPointerDown={startResize}
              onPointerMove={resize}
              onPointerUp={stopResize}
              {...stylex.props(
                style.resizeHandle,
                style[resizeAxis === "horizontal" ? "resizeHandleHorizontal" : "resizeHandleVertical"],
                handleEdge
              )}
            />
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
