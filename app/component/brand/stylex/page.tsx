import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 1480,
    minWidth: 0,
    marginInline: "auto",
    paddingTop: { default: 24, "@media (max-width: 640px)": 20 },
    paddingRight: { default: 44, "@media (max-width: 1024px)": 24, "@media (max-width: 640px)": 16 },
    paddingBottom: 48,
    paddingLeft: { default: 44, "@media (max-width: 1024px)": 24, "@media (max-width: 640px)": 16 },
    color: token.foreground
  },
  breadcrumb: { marginBottom: 20, minWidth: 0 },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 24,
    marginBottom: 28,
    minWidth: 0,
    flexDirection: { default: "row", "@media (max-width: 640px)": "column" }
  },
  heading: { minWidth: 0, flex: 1 },
  title: {
    margin: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
    color: token.foreground,
    fontFamily: "inherit",
    fontSize: { default: 42, "@media (max-width: 640px)": 28 },
    lineHeight: 1.06,
    fontWeight: 600,
    letterSpacing: "-0.035em"
  },
  description: {
    maxWidth: 700,
    marginTop: 9,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: token.mutedForeground,
    fontSize: 14,
    lineHeight: 1.55
  },
  action: {
    display: "flex",
    flex: { default: "0 0 auto", "@media (max-width: 640px)": "1 1 auto" },
    gap: 8,
    width: { default: "auto", "@media (max-width: 640px)": "100%" },
    alignItems: "center"
  },
  content: { minWidth: 0 }
})

export function Page({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page"
      {...props}
      className={[stylex.props(stylex.defaultMarker(), style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function PageBreadcrumb({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-breadcrumb"
      {...props}
      className={[stylex.props(style.breadcrumb).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function PageHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      data-slot="page-header"
      {...props}
      className={[stylex.props(style.header).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function PageHeading({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-heading"
      {...props}
      className={[stylex.props(style.heading).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function PageTitle({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-title"
      {...props}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function PageDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="page-description"
      {...props}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function PageAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-action"
      {...props}
      className={[stylex.props(style.action).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function PageContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
