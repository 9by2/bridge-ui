import * as stylex from "@stylexjs/stylex"
import { Command as Primitive } from "cmdk"
import { CheckIcon, SearchIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog"
import { InputGroup, InputGroupAddon } from "./input-group"
import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: token.background,
    padding: 4,
    color: token.foreground
  },
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
  popup: { top: "33.333333%", transform: "translate(-50%, 0)", overflow: "hidden", borderRadius: 14, padding: 0 },
  wrapper: { padding: 4, paddingBottom: 0 },
  input: {
    width: "100%",
    fontSize: 14,
    lineHeight: "20px",
    fontFamily: "inherit",
    color: "inherit",
    backgroundColor: "transparent",
    borderWidth: 0,
    outline: "2px solid transparent",
    outlineOffset: 2,
    cursor: { default: "text", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 }
  },
  search: { width: 16, height: 16, flexShrink: 0, opacity: 0.5 },
  list: {
    maxHeight: 288,
    scrollPaddingBlock: 4,
    overflowX: "hidden",
    overflowY: "auto",
    outline: "none",
    scrollbarWidth: "none"
  },
  empty: { paddingBlock: 24, textAlign: "center", fontSize: 14, lineHeight: "20px" },
  group: { overflow: "hidden", padding: 4, color: token.foreground },
  heading: {
    display: "block",
    paddingInline: 8,
    paddingBlock: 6,
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: 500,
    color: token.mutedForeground
  },
  separator: { marginInline: -4, height: 1, backgroundColor: token.border },
  item: {
    position: "relative",
    display: "flex",
    cursor: "default",
    alignItems: "center",
    gap: 8,
    borderRadius: { default: 6, ':is([data-slot="dialog-content"] *)': 10 },
    paddingInline: 8,
    paddingBlock: 6,
    fontSize: 14,
    lineHeight: "20px",
    outline: "2px solid transparent",
    outlineOffset: 2,
    userSelect: "none",
    pointerEvents: { default: "auto", ':is([data-disabled="true"])': "none" },
    opacity: { default: 1, ':is([data-disabled="true"])': 0.5 },
    backgroundColor: { default: "transparent", ':is([data-selected="true"])': token.muted },
    color: token.foreground
  },
  check: {
    width: 16,
    height: 16,
    marginLeft: "auto",
    opacity: { default: 0, [stylex.when.ancestor('[data-checked="true"]')]: 1 },
    display: { default: "block", [stylex.when.ancestor(':has([data-slot="command-shortcut"])')]: "none" }
  },
  shortcut: {
    marginLeft: "auto",
    fontSize: 12,
    lineHeight: "16px",
    letterSpacing: "0.1em",
    color: { default: token.mutedForeground, [stylex.when.ancestor('[data-selected="true"]')]: token.foreground }
  }
})
export function Command({ className, ...props }: ComponentProps<typeof Primitive>) {
  return (
    <Primitive
      data-slot="command"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={[stylex.props(style.popup).className, className].filter(Boolean).join(" ")}>
        <DialogHeader className={stylex.props(style.hidden).className}>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
export function CommandInput({ className, ...props }: ComponentProps<typeof Primitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" {...stylex.props(style.wrapper)}>
      <InputGroup>
        <Primitive.Input
          data-slot="command-input"
          {...props}
          className={[stylex.props(style.input).className, className].filter(Boolean).join(" ")}
        />
        <InputGroupAddon>
          <SearchIcon {...stylex.props(style.search)} />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
export function CommandList({ className, ...props }: ComponentProps<typeof Primitive.List>) {
  return (
    <Primitive.List
      data-slot="command-list"
      {...props}
      className={[stylex.props(style.list).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function CommandEmpty({ className, ...props }: ComponentProps<typeof Primitive.Empty>) {
  return (
    <Primitive.Empty
      data-slot="command-empty"
      {...props}
      className={[stylex.props(style.empty).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function CommandGroup({ className, heading, ...props }: ComponentProps<typeof Primitive.Group>) {
  return (
    <Primitive.Group
      data-slot="command-group"
      {...props}
      heading={heading && <span {...stylex.props(style.heading)}>{heading}</span>}
      className={[stylex.props(style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function CommandSeparator({ className, ...props }: ComponentProps<typeof Primitive.Separator>) {
  return (
    <Primitive.Separator
      data-slot="command-separator"
      {...props}
      className={[stylex.props(style.separator).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function CommandItem({ className, children, ...props }: ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item
      data-slot="command-item"
      {...props}
      className={[stylex.props(stylex.defaultMarker(), style.item).className, className].filter(Boolean).join(" ")}>
      {children}
      <CheckIcon {...stylex.props(style.check)} />
    </Primitive.Item>
  )
}
export function CommandShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      {...props}
      className={[stylex.props(style.shortcut).className, className].filter(Boolean).join(" ")}
    />
  )
}
