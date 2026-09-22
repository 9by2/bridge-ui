import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"
import { Heading, WAIHeading } from "./typography"

const pageVariant = { default: "default", container: "container" } as const

type ValueOf<T> = T[keyof T]

export type PageVariant = ValueOf<typeof pageVariant>

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
    paddingTop: 24,
    paddingRight: 44,
    paddingBottom: 48,
    paddingLeft: 44,
    color: token.foreground
  },
  container: { maxWidth: 1480, marginInline: "auto" },
  none: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
  compact: { paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16 },
  comfortable: { paddingTop: 24, paddingRight: 24, paddingBottom: 24, paddingLeft: 24 },
  dynamicPadding: {
    paddingTop: { default: 24, "@media (max-width: 640px)": 20 },
    paddingRight: { default: 44, "@media (max-width: 1024px)": 24, "@media (max-width: 640px)": 16 },
    paddingLeft: { default: 44, "@media (max-width: 1024px)": 24, "@media (max-width: 640px)": 16 }
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
    fontSize: { default: 32, "@media (max-width: 640px)": 26 },
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
  toolbar: {
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
    minWidth: 0,
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border,
    paddingBlock: 8,
    paddingInline: { default: 24, "@media (max-width: 640px)": 16 }
  },
  content: { minWidth: 0 }
})

export type PageProps = ComponentProps<"div"> & {
  variant?: PageVariant
  spacing?: "default" | "none" | "compact" | "comfortable"
  isDynamicPadding?: boolean
}

export function Page({
  variant = pageVariant.default,
  spacing = "default",
  isDynamicPadding = false,
  className,
  ...props
}: PageProps) {
  return (
    <div
      data-slot="page"
      data-variant={variant}
      data-spacing={spacing}
      data-dynamic-padding={isDynamicPadding || undefined}
      {...props}
      className={[
        stylex.props(
          stylex.defaultMarker(),
          style.root,
          variant === pageVariant.container && style.container,
          spacing === "none" && style.none,
          spacing === "compact" && style.compact,
          spacing === "comfortable" && style.comfortable,
          isDynamicPadding && style.dynamicPadding
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
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
    <Heading
      as={WAIHeading.H1}
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

export function PageToolbar({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-toolbar"
      {...props}
      className={[stylex.props(style.toolbar).className, className].filter(Boolean).join(" ")}
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
