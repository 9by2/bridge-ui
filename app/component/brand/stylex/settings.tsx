import * as stylex from "@stylexjs/stylex"
import {
  Children,
  createContext,
  isValidElement,
  useContext,
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
    gap: 4,
    padding: 12,
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: token.border
  },
  picker: { paddingBottom: 16 },
  pickerContent: {
    width: "min(100%, 22rem)",
    maxWidth: "calc(100% - 2rem)",
    gap: 12,
    padding: 12
  },
  pickerTitle: { marginInline: 4, marginTop: 4 },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border,
    marginBottom: 8
  },
  nav: { display: "flex", flexDirection: "column", gap: 4 },
  navItem: {
    display: "flex",
    width: "100%",
    minHeight: 36,
    alignItems: "center",
    borderWidth: 0,
    borderRadius: 8,
    backgroundColor: {
      default: "transparent",
      ":hover": token.accent,
      ":focus-visible": token.accent,
      ':is([aria-current="page"])': token.accent
    },
    color: token.foreground,
    paddingInline: 10,
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: { default: 400, ':is([aria-current="page"])': 600 },
    textAlign: "left",
    outline: "none",
    cursor: "pointer"
  },
  content: { minWidth: 0, padding: { default: 28, "@media (max-width: 767px)": 16 } }
})

const classes = (own: string | undefined, value?: string) => [own, value].filter(Boolean).join(" ")

export function Settings({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="settings" {...props} className={classes(stylex.props(style.root).className, className)} />
}

export function SettingsSidebar({ title, className, children, ...props }: ComponentProps<"nav"> & { title: string }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const context = { isMobile, closePicker: () => setOpen(false) }
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
