import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as stylex from "@stylexjs/stylex"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  list: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
    lineHeight: "20px",
    overflowWrap: "break-word",
    color: token.mutedForeground,
    listStyleType: "none",
    padding: 0,
    margin: 0
  },
  item: { display: "inline-flex", alignItems: "center", gap: 4 },
  link: {
    transitionProperty: "color",
    transitionDuration: "150ms",
    color: { default: "inherit", ":hover": token.foreground },
    textDecorationLine: "none"
  },
  page: { fontWeight: 400, color: token.foreground },
  chevron: { width: 14, height: 14 },
  icon: { width: 16, height: 16 },
  ellipsis: { display: "flex", width: 20, height: 20, alignItems: "center", justifyContent: "center" },
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
  }
})
export function Breadcrumb(props: ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}
export function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      {...props}
      className={[stylex.props(style.list).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      {...props}
      className={[stylex.props(style.item).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function BreadcrumbLink({ className, render, ...props }: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      { className: [stylex.props(style.link).className, className].filter(Boolean).join(" ") },
      props
    ),
    render,
    state: { slot: "breadcrumb-link" }
  })
}
export function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      {...props}
      className={[stylex.props(style.page).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function BreadcrumbSeparator({ children, ...props }: ComponentProps<"li">) {
  return (
    <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" {...props}>
      {children ?? <ChevronRightIcon {...stylex.props(style.chevron)} />}
    </li>
  )
}
export function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      {...props}
      className={[stylex.props(style.ellipsis).className, className].filter(Boolean).join(" ")}>
      <MoreHorizontalIcon {...stylex.props(style.icon)} />
      <span {...stylex.props(style.hidden)}>More</span>
    </span>
  )
}
