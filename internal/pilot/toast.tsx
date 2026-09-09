import { Toast as Primitive } from "@base-ui/react/toast"
import * as stylex from "@stylexjs/stylex"
import { XIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

import { Button } from "./button"
import { Theme } from "./theme"
import { token } from "./token.stylex"

const spin = stylex.keyframes({ to: { rotate: "360deg" } })
const height = "var(--toast-frontmost-height, var(--toast-height))"
const scale = "max(0, 1 - var(--toast-index) * 0.1)"
const offset = "calc(var(--toast-offset-y) * -1 + var(--toast-index) * 0.75rem * -1 + var(--toast-swipe-movement-y))"
const style = stylex.create({
  viewport: {
    pointerEvents: "none",
    position: "fixed",
    left: { default: 16, "@media (min-width: 640px)": "auto" },
    right: 16,
    bottom: 16,
    zIndex: 50,
    marginInline: { default: "auto", "@media (min-width: 640px)": 0 },
    width: { default: "auto", "@media (min-width: 640px)": "100%" },
    maxWidth: 384,
    outline: "none"
  },
  root: {
    pointerEvents: "auto",
    position: { default: "absolute", "::after": "absolute" },
    right: 0,
    bottom: 0,
    zIndex: "calc(1000 - var(--toast-index))",
    width: { default: "100%", "::after": "100%" },
    transformOrigin: "bottom",
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: token.border, ":focus-visible": token.ring },
    backgroundColor: token.background,
    color: token.foreground,
    boxShadow: {
      default: "0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)",
      ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)`
    },
    willChange: "transform",
    outline: "none",
    userSelect: "none",
    height: { default: height, ":is([data-expanded])": "var(--toast-height)", "::after": "calc(0.75rem + 1px)" },
    top: { "::after": "100%" },
    left: { "::after": 0 },
    content: { "::after": '""' },
    opacity: { default: 1, ":is([data-limited])": 0 },
    transition: {
      default: "transform 500ms cubic-bezier(0.22,1,0.36,1), opacity 500ms, height 150ms",
      "@media (prefers-reduced-motion: reduce)": "none"
    },
    transform: {
      default: `translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) - var(--toast-index) * 0.75rem - (1 - ${scale}) * ${height})) scale(${scale})`,
      ":is([data-expanded])": `translateX(var(--toast-swipe-movement-x)) translateY(${offset})`,
      ":is([data-starting-style])": "translateY(150%)",
      ":is([data-ending-style]):not([data-limited]):not([data-swipe-direction])": "translateY(150%)",
      ':is([data-ending-style][data-swipe-direction="down"])': "translateY(calc(var(--toast-swipe-movement-y) + 150%))",
      ':is([data-ending-style][data-swipe-direction="up"])': "translateY(calc(var(--toast-swipe-movement-y) - 150%))",
      ':is([data-ending-style][data-swipe-direction="left"])': `translateX(calc(var(--toast-swipe-movement-x) - 150%)) translateY(${offset})`,
      ':is([data-ending-style][data-swipe-direction="right"])': `translateX(calc(var(--toast-swipe-movement-x) + 150%)) translateY(${offset})`
    }
  },
  content: {
    boxSizing: "border-box",
    display: "flex",
    height: "100%",
    alignItems: "center",
    gap: 12,
    overflow: "hidden",
    padding: 16,
    transitionProperty: "opacity",
    transitionDuration: "250ms",
    transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
    opacity: { default: 1, ":is([data-behind])": 0, ":is([data-expanded])": 1 }
  },
  title: { fontSize: 14, lineHeight: "20px", fontWeight: 500 },
  description: { fontSize: 14, lineHeight: "20px", color: token.mutedForeground },
  action: { flexShrink: 0 },
  close: {
    position: { default: "relative", "::after": "absolute" },
    flexShrink: 0,
    color: { default: token.mutedForeground, ":hover": token.foreground },
    inset: { "::after": -8 },
    content: { "::after": '""' }
  },
  icon: { width: 16, height: 16, pointerEvents: "none", flexShrink: 0 },
  error: { color: token.errorText },
  loading: {
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationPlayState: { default: "running", "@media (prefers-reduced-motion: reduce)": "paused" }
  },
  copy: { display: "flex", minWidth: 0, flex: 1, flexDirection: "column", gap: 4 }
})
export const toast = Primitive.createToastManager()
export const createToastManager = Primitive.createToastManager
export const useToastManager = Primitive.useToastManager
export function ToastProvider(props: Primitive.Provider.Props) {
  return <Primitive.Provider {...props} />
}
export function ToastPortal({ children, ...props }: Primitive.Portal.Props) {
  return (
    <Primitive.Portal data-slot="toast-portal" {...props}>
      <Theme>{children}</Theme>
    </Primitive.Portal>
  )
}
export function ToastViewport({ className, ...props }: Primitive.Viewport.Props) {
  return (
    <Primitive.Viewport
      data-slot="toast-viewport"
      {...props}
      className={(state) =>
        [stylex.props(style.viewport).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function Toast({ className, ...props }: Primitive.Root.Props) {
  return (
    <Primitive.Root
      data-slot="toast"
      {...props}
      className={(state) =>
        [stylex.props(style.root).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ToastContent({ className, ...props }: Primitive.Content.Props) {
  return (
    <Primitive.Content
      data-slot="toast-content"
      {...props}
      className={(state) =>
        [stylex.props(style.content).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ToastTitle({ className, ...props }: Primitive.Title.Props) {
  return (
    <Primitive.Title
      data-slot="toast-title"
      {...props}
      className={(state) =>
        [stylex.props(style.title).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ToastDescription({ className, ...props }: Primitive.Description.Props) {
  return (
    <Primitive.Description
      data-slot="toast-description"
      {...props}
      className={(state) =>
        [stylex.props(style.description).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: Primitive.Action.Props) {
  return (
    <Primitive.Action
      data-slot="toast-action"
      render={render}
      {...props}
      className={(state) =>
        [stylex.props(style.action).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: Primitive.Close.Props) {
  return (
    <Primitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      {...props}
      className={(state) =>
        [stylex.props(style.close).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }>
      {children ?? <XIcon aria-hidden="true" {...stylex.props(style.icon)} />}
    </Primitive.Close>
  )
}
function ToastList() {
  const { toasts } = useToastManager()
  return toasts.map((item) => (
    <Toast key={item.id} toast={item}>
      <ToastContent>
        {item.type === "success" && <CircleCheckIcon data-slot="toast-icon" {...stylex.props(style.icon)} />}
        {item.type === "info" && <InfoIcon data-slot="toast-icon" {...stylex.props(style.icon)} />}
        {item.type === "warning" && <TriangleAlertIcon data-slot="toast-icon" {...stylex.props(style.icon)} />}
        {item.type === "error" && <OctagonXIcon data-slot="toast-icon" {...stylex.props(style.icon, style.error)} />}
        {item.type === "loading" && <Loader2Icon data-slot="toast-icon" {...stylex.props(style.icon, style.loading)} />}
        <div {...stylex.props(style.copy)}>
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}
export function Toaster({ children, toastManager = toast, ...props }: Primitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}
