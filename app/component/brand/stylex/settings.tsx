import * as stylex from "@stylexjs/stylex"
import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type MouseEvent
} from "react"

import { useIsMobile } from "../stylex-support/use-mobile"

import { Button } from "./button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./dialog"
import { token } from "./token.stylex"

type SettingsContext = { closePicker: () => void; isMobile: boolean }

const Context = createContext<SettingsContext | null>(null)

// Sidebar dividers sit at half the border token strength so they read as structure, not emphasis.
const subtleBorder = `color-mix(in oklch, ${token.border}, transparent 50%)`

const style = stylex.create({
  root: {
    display: "grid",
    gridTemplateColumns: { default: "13rem minmax(0, 1fr)", "@media (max-width: 767px)": "minmax(0, 1fr)" },
    minWidth: 0,
    color: token.foreground
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "var(--bridge-unit-4, 4px)",
    padding: "var(--bridge-unit-12, 12px)",
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: subtleBorder
  },
  picker: { paddingBottom: "var(--bridge-unit-16, 16px)" },
  pickerContent: {
    width: "min(100%, 22rem)",
    maxWidth: "calc(100% - 2rem)",
    gap: "var(--bridge-unit-12, 12px)",
    padding: "var(--bridge-unit-12, 12px)"
  },
  pickerTitle: { marginInline: 4, marginTop: 4 },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: "var(--bridge-unit-10, 10px)",
    padding: "var(--bridge-unit-8, 8px)",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: subtleBorder,
    marginBottom: 8
  },
  nav: { display: "flex", flexDirection: "column", gap: "var(--bridge-unit-4, 4px)" },
  navItem: {
    display: "flex",
    width: "100%",
    minHeight: 36,
    alignItems: "center",
    borderWidth: 0,
    borderRadius: "var(--bridge-radius-8, 0.5em)",
    backgroundColor: {
      default: "transparent",
      ":hover": token.accent,
      ":focus-visible": token.accent,
      ':is([aria-current="page"])': token.accent
    },
    color: token.foreground,
    paddingInline: "var(--bridge-unit-10, 10px)",
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    fontWeight: { default: 400, ':is([aria-current="page"])': 600 },
    textAlign: "left",
    outline: "none",
    cursor: "pointer"
  },
  content: {
    minWidth: 0,
    padding: { default: "var(--bridge-unit-28, 28px)", "@media (max-width: 767px)": "var(--bridge-unit-16, 16px)" }
  }
})

const classes = (own: string | undefined, value?: string) => [own, value].filter(Boolean).join(" ")

export function Settings({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="settings" {...props} className={classes(stylex.props(style.root).className, className)} />
}

export function SettingsSidebar({ title, className, children, ...props }: ComponentProps<"nav"> & { title: string }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const context = useMemo(() => ({ isMobile, closePicker: () => setOpen(false) }), [isMobile])
  const child = Children.toArray(children)
  const header = child.find((item) => isValidElement(item) && item.type === SettingsSidebarHeader)
  const navigation = child.filter((item) => item !== header)
  return (
    <Context value={context}>
      {isMobile ? (
        <div data-slot="settings-picker" {...stylex.props(style.picker)}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" />}>{title}</DialogTrigger>
            <DialogContent className={stylex.props(style.pickerContent).className} showCloseButton>
              <DialogTitle className={stylex.props(style.pickerTitle).className}>{title}</DialogTitle>
              {header}
              <nav data-slot="settings-nav" aria-label="Settings" {...stylex.props(style.nav)}>
                {navigation}
              </nav>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <nav
          data-slot="settings-sidebar"
          aria-label="Settings"
          {...props}
          className={classes(stylex.props(style.sidebar).className, className)}>
          {header}
          <div data-slot="settings-nav" {...stylex.props(style.nav)}>
            {navigation}
          </div>
        </nav>
      )}
    </Context>
  )
}

export function SettingsSidebarHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      data-slot="settings-sidebar-header"
      {...props}
      className={classes(stylex.props(style.sidebarHeader).className, className)}
    />
  )
}

export function SettingsNavItem({
  isActive = false,
  className,
  onClick,
  ...props
}: ComponentProps<"button"> & { isActive?: boolean }) {
  const context = useContext(Context)
  const click = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented && context?.isMobile) context.closePicker()
  }
  return (
    <button
      data-slot="settings-nav-item"
      aria-current={isActive ? "page" : undefined}
      {...props}
      onClick={click}
      className={classes(stylex.props(style.navItem).className, className)}
    />
  )
}

export function SettingsContent({ className, ...props }: ComponentProps<"main">) {
  return (
    <main
      data-slot="settings-content"
      {...props}
      className={classes(stylex.props(style.content).className, className)}
    />
  )
}
