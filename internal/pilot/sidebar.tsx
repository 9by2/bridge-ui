import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as stylex from "@stylexjs/stylex"
import { PanelLeftIcon } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentProps,
  type CSSProperties,
  type ReactNode
} from "react"

import { useIsMobile } from "../use-mobile"

import { Button } from "./button"
import { Input } from "./input"
import { Separator } from "./separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./sheet"
import { Skeleton } from "./skeleton"
import { token } from "./token.stylex"
import { Tooltip, TooltipTrigger, TooltipContent } from "./tooltip"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (value: boolean | ((value: boolean) => boolean)) => void
  openMobile: boolean
  setOpenMobile: (value: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}
const Context = createContext<SidebarContext | null>(null)
const style = stylex.create({
  wrapper: {
    display: "flex",
    minHeight: "100svh",
    width: "100%",
    backgroundColor: {
      default: "transparent",
      ':has([data-variant="inset"])': token.background
    }
  },
  root: { display: { default: "none", "@media (min-width: 768px)": "block" }, color: token.foreground },
  static: {
    display: "flex",
    height: "100%",
    width: "var(--sidebar-width)",
    flexDirection: "column",
    backgroundColor: token.background,
    color: token.foreground
  },
  gap: {
    position: "relative",
    width: "var(--sidebar-width)",
    transitionProperty: "width",
    transitionDuration: "200ms",
    transitionTimingFunction: "linear"
  },
  gapOff: { width: 0 },
  gapIcon: { width: "var(--sidebar-width-icon)" },
  gapFloating: { width: "calc(var(--sidebar-width-icon) + 16px)" },
  container: {
    position: "fixed",
    top: 0,
    bottom: 0,
    zIndex: 10,
    display: { default: "none", "@media (min-width: 768px)": "flex" },
    height: "100svh",
    width: "var(--sidebar-width)",
    boxSizing: "border-box",
    transitionProperty: "left, right, width",
    transitionDuration: "200ms",
    transitionTimingFunction: "linear",
    borderColor: token.border,
    borderStyle: "solid",
    borderWidth: 0
  },
  left: { left: 0, borderRightWidth: 1 },
  right: { right: 0, borderLeftWidth: 1 },
  leftOff: { left: "calc(var(--sidebar-width) * -1)" },
  rightOff: { right: "calc(var(--sidebar-width) * -1)" },
  floating: { padding: 8, borderWidth: 0 },
  iconFloating: { width: "calc(var(--sidebar-width-icon) + 18px)" },
  inner: { display: "flex", width: "100%", height: "100%", flexDirection: "column", backgroundColor: token.background },
  floatingInner: { borderRadius: 10, boxShadow: `0 0 0 1px ${token.border}, 0 8px 24px rgb(0 0 0 / 12%)` },
  mobile: { width: 288, padding: 0 },
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
  },
  icon: { width: 16, height: 16 },
  inset: {
    position: "relative",
    display: "flex",
    width: "100%",
    flex: 1,
    flexDirection: "column",
    backgroundColor: token.background
  },
  edge: { display: "flex", flexDirection: "column", gap: 8, padding: 8 },
  input: { height: 32, width: "100%", backgroundColor: token.background, boxShadow: "none" },
  separator: { marginInline: 8, width: "auto", backgroundColor: token.border },
  content: {
    display: "flex",
    minHeight: 0,
    flex: 1,
    flexDirection: "column",
    gap: 0,
    overflow: { default: "auto", [stylex.when.ancestor('[data-collapsible="icon"]')]: "hidden" },
    scrollbarWidth: "none"
  },
  group: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
    minWidth: 0,
    flexDirection: "column",
    padding: 8
  },
  groupContent: { width: "100%", fontSize: 14, lineHeight: "20px" },
  label: {
    display: "flex",
    height: 32,
    flexShrink: 0,
    alignItems: "center",
    borderRadius: 8,
    paddingInline: 8,
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: 500,
    color: token.mutedForeground,
    outline: "none",
    marginTop: { default: 0, [stylex.when.ancestor('[data-collapsible="icon"]')]: -32 },
    opacity: { default: 1, [stylex.when.ancestor('[data-collapsible="icon"]')]: 0 },
    transitionProperty: "margin, opacity",
    transitionDuration: "200ms"
  },
  menu: {
    display: "flex",
    width: "100%",
    minWidth: 0,
    flexDirection: "column",
    gap: 0,
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  item: { position: "relative" },
  menuButton: {
    display: "flex",
    boxSizing: "border-box",
    width: { default: "100%", [stylex.when.ancestor('[data-collapsible="icon"]')]: 32 },
    height: 32,
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
    borderRadius: 8,
    padding: 8,
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: "20px",
    color: token.foreground,
    borderWidth: 0,
    outline: "none",
    backgroundColor: {
      default: "transparent",
      ":hover": token.accent,
      ":active": token.accent,
      ":is([data-active])": token.accent
    },
    fontWeight: { default: 400, ":is([data-active])": 500 },
    pointerEvents: { default: "auto", ':is(:disabled, [aria-disabled="true"])': "none" },
    opacity: { default: 1, ':is(:disabled, [aria-disabled="true"])': 0.5 },
    boxShadow: { default: "none", ":focus-visible": `0 0 0 2px ${token.ring}` }
  },
  outline: { backgroundColor: token.background, boxShadow: `0 0 0 1px ${token.border}` },
  sm: { height: 28, fontSize: 12 },
  lg: { height: { default: 48, [stylex.when.ancestor('[data-collapsible="icon"]')]: 32 } },
  action: {
    position: "absolute",
    top: 6,
    right: 4,
    display: { default: "flex", [stylex.when.ancestor('[data-collapsible="icon"]')]: "none" },
    aspectRatio: "1",
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 0,
    color: token.foreground,
    borderWidth: 0,
    backgroundColor: { default: "transparent", ":hover": token.accent },
    outline: "none"
  },
  groupAction: { top: 14, right: 12 },
  hoverAction: {
    opacity: {
      default: 1,
      "@media (min-width: 768px)": {
        default: 0,
        ':is([data-slot="sidebar-menu-item"]:hover *, [data-slot="sidebar-menu-item"]:focus-within *)': 1,
        ':is([aria-expanded="true"])': 1
      }
    }
  },
  badge: {
    pointerEvents: "none",
    position: "absolute",
    right: 4,
    top: 6,
    display: { default: "flex", [stylex.when.ancestor('[data-collapsible="icon"]')]: "none" },
    height: 20,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingInline: 4,
    fontSize: 12,
    fontWeight: 500,
    fontVariantNumeric: "tabular-nums"
  },
  skeleton: { display: "flex", height: 32, alignItems: "center", gap: 8, borderRadius: 8, paddingInline: 8 },
  skeletonText: { height: 16, flex: 1 },
  sub: {
    marginInline: 14,
    marginBlock: 0,
    display: { default: "flex", [stylex.when.ancestor('[data-collapsible="icon"]')]: "none" },
    minWidth: 0,
    translate: "1px 0",
    flexDirection: "column",
    gap: 4,
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: token.border,
    paddingInline: 10,
    paddingBlock: 2,
    listStyleType: "none"
  },
  subButton: {
    height: 28,
    width: "100%",
    minWidth: 0,
    translate: "-1px 0",
    textDecorationLine: "none",
    display: { default: "flex", [stylex.when.ancestor('[data-collapsible="icon"]')]: "none" }
  },
  rail: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: -16,
    zIndex: 20,
    display: { default: "none", "@media (min-width: 640px)": "flex" },
    width: 16,
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "ew-resize",
    translate: "-50% 0"
  }
})
export function useSidebar() {
  const context = useContext(Context)
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.")
  return context
}
export function SidebarProvider({
  defaultOpen = true,
  open: controlled,
  onOpenChange,
  className,
  style: callerStyle,
  children,
  ...props
}: ComponentProps<"div"> & { defaultOpen?: boolean; open?: boolean; onOpenChange?: (open: boolean) => void }) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = useState(false)
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const open = controlled ?? internalOpen
  const setOpen: SidebarContext["setOpen"] = useCallback(
    (value) => {
      const next = typeof value === "function" ? value(open) : value
      if (onOpenChange) onOpenChange(next)
      else setInternalOpen(next)
      document.cookie = `sidebar_state=${next}; path=/; max-age=604800`
    },
    [open, onOpenChange]
  )
  const toggleSidebar = useCallback(() => {
    if (isMobile) setOpenMobile((value) => !value)
    else setOpen((value) => !value)
  }, [isMobile, setOpen])
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "b" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", keydown)
    return () => window.removeEventListener("keydown", keydown)
  }, [toggleSidebar])
  const variables: CSSProperties & Record<`--${string}`, string> = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
    ...callerStyle
  }
  const context = useMemo(
    () => ({
      state: open ? ("expanded" as const) : ("collapsed" as const),
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar
    }),
    [open, setOpen, openMobile, isMobile, toggleSidebar]
  )
  return (
    <Context value={context}>
      <div
        data-slot="sidebar-wrapper"
        {...props}
        style={variables}
        className={[stylex.props(style.wrapper).className, className].filter(Boolean).join(" ")}>
        {children}
      </div>
    </Context>
  )
}
function sidebarGapStyle(collapsed: boolean, collapsible: "offcanvas" | "icon" | "none", floating: boolean) {
  return stylex.props(
    style.gap,
    collapsed && (collapsible === "offcanvas" ? style.gapOff : floating ? style.gapFloating : style.gapIcon)
  )
}
function sidebarContainerClassName(
  side: "left" | "right",
  floating: boolean,
  collapsed: boolean,
  collapsible: "offcanvas" | "icon" | "none"
) {
  return stylex.props(
    style.container,
    side === "left" ? style.left : style.right,
    floating && style.floating,
    collapsed && collapsible === "offcanvas" && (side === "left" ? style.leftOff : style.rightOff),
    collapsed && collapsible === "icon" && (floating ? style.iconFloating : style.gapIcon)
  ).className
}
function StaticSidebar({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar"
      {...props}
      className={[stylex.props(style.static).className, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  )
}
function MobileSidebar({
  side,
  dir,
  openMobile,
  setOpenMobile,
  children
}: {
  side: "left" | "right"
  dir: ComponentProps<"div">["dir"]
  openMobile: boolean
  setOpenMobile: (value: boolean) => void
  children: ReactNode
}) {
  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetContent
        dir={dir}
        data-sidebar="sidebar"
        data-slot="sidebar"
        data-mobile="true"
        side={side}
        showCloseButton={false}
        className={stylex.props(style.mobile).className}>
        <SheetHeader className={stylex.props(style.hidden).className}>
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>Displays the mobile sidebar.</SheetDescription>
        </SheetHeader>
        <div {...stylex.props(style.inner)}>{children}</div>
      </SheetContent>
    </Sheet>
  )
}
export function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  dir,
  ...props
}: ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()
  if (collapsible === "none")
    return (
      <StaticSidebar className={className} {...props}>
        {children}
      </StaticSidebar>
    )
  if (isMobile)
    return (
      <MobileSidebar side={side} dir={dir} openMobile={openMobile} setOpenMobile={setOpenMobile}>
        {children}
      </MobileSidebar>
    )
  const collapsed = state === "collapsed"
  const floating = variant === "floating"
  return (
    <div
      data-slot="sidebar"
      data-state={state}
      data-collapsible={collapsed ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      {...stylex.props(stylex.defaultMarker(), style.root)}>
      <div data-slot="sidebar-gap" {...sidebarGapStyle(collapsed, collapsible, floating)} />
      <div
        data-slot="sidebar-container"
        data-side={side}
        {...props}
        className={[sidebarContainerClassName(side, floating, collapsed, collapsible), className]
          .filter(Boolean)
          .join(" ")}>
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          {...stylex.props(style.inner, variant === "floating" && style.floatingInner)}>
          {children}
        </div>
      </div>
    </div>
  )
}
export function SidebarTrigger({ onClick, ...props }: ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()
  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon-sm"
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}>
      <PanelLeftIcon {...stylex.props(style.icon)} />
      <span {...stylex.props(style.hidden)}>Toggle Sidebar</span>
    </Button>
  )
}
export function SidebarRail({ className, ...props }: ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()
  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      {...props}
      className={[stylex.props(style.rail).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarInset({ className, ...props }: ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      {...props}
      className={[stylex.props(style.inset).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      {...props}
      className={[stylex.props(style.input).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      {...props}
      className={[stylex.props(style.edge).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      {...props}
      className={[stylex.props(style.edge).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      {...props}
      className={(state) =>
        [stylex.props(style.separator).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      {...props}
      className={[stylex.props(style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarGroupLabel({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div"> & ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: [stylex.props(style.label).className, className].filter(Boolean).join(" ") },
      props
    ),
    render,
    state: { slot: "sidebar-group-label", sidebar: "group-label" }
  })
}
export function SidebarGroupAction({
  className,
  render,
  ...props
}: useRender.ComponentProps<"button"> & ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      { className: [stylex.props(style.action, style.groupAction).className, className].filter(Boolean).join(" ") },
      props
    ),
    render,
    state: { slot: "sidebar-group-action", sidebar: "group-action" }
  })
}
export function SidebarGroupContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      {...props}
      className={[stylex.props(style.groupContent).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      {...props}
      className={[stylex.props(style.menu).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarMenuItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      {...props}
      className={[stylex.props(style.item).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: useRender.ComponentProps<"button"> &
  ComponentProps<"button"> & {
    isActive?: boolean
    variant?: "default" | "outline" | null
    size?: "default" | "sm" | "lg" | null
    tooltip?: string | ComponentProps<typeof TooltipContent>
  }) {
  const { isMobile, state } = useSidebar()
  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: [
          stylex.props(
            style.menuButton,
            variant === "outline" && style.outline,
            size === "sm" && style.sm,
            size === "lg" && style.lg
          ).className,
          className
        ]
          .filter(Boolean)
          .join(" ")
      },
      props
    ),
    render: tooltip ? <TooltipTrigger render={render} /> : render,
    state: { slot: "sidebar-menu-button", sidebar: "menu-button", size, active: isActive }
  })
  return tooltip ? (
    <Tooltip>
      {comp}
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...(typeof tooltip === "string" ? { children: tooltip } : tooltip)}
      />
    </Tooltip>
  ) : (
    comp
  )
}
export function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: useRender.ComponentProps<"button"> & ComponentProps<"button"> & { showOnHover?: boolean }) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: [stylex.props(style.action, showOnHover && style.hoverAction).className, className]
          .filter(Boolean)
          .join(" ")
      },
      props
    ),
    render,
    state: { slot: "sidebar-menu-action", sidebar: "menu-action" }
  })
}
export function SidebarMenuBadge({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      {...props}
      className={[stylex.props(style.badge).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: ComponentProps<"div"> & { showIcon?: boolean }) {
  const [width] = useState(() => `${Math.floor(Math.random() * 40) + 50}%`)
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      {...props}
      className={[stylex.props(style.skeleton).className, className].filter(Boolean).join(" ")}>
      {showIcon && <Skeleton data-sidebar="menu-skeleton-icon" className={stylex.props(style.icon).className} />}
      <Skeleton
        data-sidebar="menu-skeleton-text"
        className={stylex.props(style.skeletonText).className}
        style={{ maxWidth: width }}
      />
    </div>
  )
}
export function SidebarMenuSub({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      {...props}
      className={[stylex.props(style.sub).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarMenuSubItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      {...props}
      className={[stylex.props(style.item).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function SidebarMenuSubButton({
  render,
  size = "md",
  isActive = false,
  className,
  ...props
}: useRender.ComponentProps<"a"> & ComponentProps<"a"> & { size?: "sm" | "md"; isActive?: boolean }) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: [stylex.props(style.menuButton, style.subButton, size === "sm" && style.sm).className, className]
          .filter(Boolean)
          .join(" ")
      },
      props
    ),
    render,
    state: { slot: "sidebar-menu-sub-button", sidebar: "menu-sub-button", size, active: isActive }
  })
}
