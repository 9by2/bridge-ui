import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  group: { display: "flex", minWidth: 0, flexDirection: "column", gap: 8 },
  root: { position: "relative", display: "flex", width: "100%", minWidth: 0, gap: 8, fontSize: 14, lineHeight: "20px" },
  end: { flexDirection: "row-reverse" },
  avatar: {
    display: "flex",
    width: "fit-content",
    minWidth: 32,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "end",
    overflow: "hidden",
    borderRadius: 9999,
    backgroundColor: token.muted,
    translate: { default: "none", [stylex.when.ancestor(':has([data-slot="message-footer"])')]: "0 -32px" }
  },
  content: {
    display: "flex",
    width: "100%",
    minWidth: 0,
    flexDirection: "column",
    gap: 10,
    overflowWrap: "break-word"
  },
  edge: {
    display: "flex",
    maxWidth: "100%",
    minWidth: 0,
    alignItems: "center",
    paddingInline: { default: 12, [stylex.when.ancestor(':has([data-variant="ghost"])')]: 0 },
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: 500,
    color: token.mutedForeground,
    alignSelf: { default: "auto", [stylex.when.ancestor('[data-align="end"]')]: "end" }
  },
  footer: { justifyContent: { default: "normal", [stylex.when.ancestor('[data-align="end"]')]: "end" } }
})
export function MessageGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="message-group"
      {...props}
      className={[stylex.props(style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function Message({ className, align = "start", ...props }: ComponentProps<"div"> & { align?: "start" | "end" }) {
  return (
    <div
      data-slot="message"
      data-align={align}
      {...props}
      className={[stylex.props(stylex.defaultMarker(), style.root, align === "end" && style.end).className, className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function MessageAvatar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="message-avatar"
      {...props}
      className={[stylex.props(style.avatar).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function MessageContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="message-content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function MessageHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="message-header"
      {...props}
      className={[stylex.props(style.edge).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function MessageFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="message-footer"
      {...props}
      className={[stylex.props(style.edge, style.footer).className, className].filter(Boolean).join(" ")}
    />
  )
}
