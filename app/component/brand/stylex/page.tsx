import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"
import { Heading, WAIHeading } from "./typography"

const pageVariant = { default: "default", container: "container" } as const

type ValueOf<T> = T[keyof T]

export type PageVariant = ValueOf<typeof pageVariant>

/** Canonical Page padding scale (DEC-001). Replaces the deprecated `spacing` prop. */
export const PageDensity = { compact: "compact", default: "default", comfortable: "comfortable", none: "none" } as const
export type PageDensity = ValueOf<typeof PageDensity>

/** Page max-width preset (DEC-005). Controls width and centering only; padding stays with `density`. */
export const PageWidth = { full: "full", content: "content", form: "form", editor: "editor" } as const
export type PageWidth = ValueOf<typeof PageWidth>

export const PageFormActionAlign = { start: "start", end: "end", between: "between" } as const
export type PageFormActionAlign = ValueOf<typeof PageFormActionAlign>

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
    paddingTop: "var(--bridge-unit-24, 24px)",
    paddingRight: "var(--bridge-unit-44, 44px)",
    paddingBottom: "var(--bridge-unit-48, 48px)",
    paddingLeft: "var(--bridge-unit-44, 44px)",
    color: token.foreground
  },
  container: { maxWidth: 1480, marginInline: "auto" },
  none: { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
  compact: {
    paddingTop: "var(--bridge-unit-16, 16px)",
    paddingRight: "var(--bridge-unit-16, 16px)",
    paddingBottom: "var(--bridge-unit-16, 16px)",
    paddingLeft: "var(--bridge-unit-16, 16px)"
  },
  comfortable: {
    paddingTop: "var(--bridge-unit-24, 24px)",
    paddingRight: "var(--bridge-unit-24, 24px)",
    paddingBottom: "var(--bridge-unit-24, 24px)",
    paddingLeft: "var(--bridge-unit-24, 24px)"
  },
  widthFull: { maxWidth: "none" },
  widthContent: { maxWidth: "80rem", marginInline: "auto" },
  widthForm: { maxWidth: "48rem", marginInline: "auto" },
  widthEditor: { maxWidth: "none", paddingRight: 0, paddingLeft: 0 },
  dynamicPadding: {
    paddingTop: { default: "var(--bridge-unit-24, 24px)", "@media (max-width: 640px)": "var(--bridge-unit-20, 20px)" },
    paddingRight: {
      default: "var(--bridge-unit-44, 44px)",
      "@media (max-width: 1024px)": "var(--bridge-unit-24, 24px)",
      "@media (max-width: 640px)": "var(--bridge-unit-16, 16px)"
    },
    paddingLeft: {
      default: "var(--bridge-unit-44, 44px)",
      "@media (max-width: 1024px)": "var(--bridge-unit-24, 24px)",
      "@media (max-width: 640px)": "var(--bridge-unit-16, 16px)"
    }
  },
  breadcrumb: { marginBottom: 20, minWidth: 0 },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "var(--bridge-unit-24, 24px)",
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
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: 1.55
  },
  action: {
    display: "flex",
    flex: { default: "0 0 auto", "@media (max-width: 640px)": "1 1 auto" },
    gap: "var(--bridge-unit-8, 8px)",
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
    gap: "var(--bridge-unit-8, 8px)",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border,
    paddingBlock: "var(--bridge-unit-8, 8px)",
    paddingInline: {
      default: "var(--bridge-unit-24, 24px)",
      "@media (max-width: 640px)": "var(--bridge-unit-16, 16px)"
    }
  },
  content: { minWidth: 0 },
  eyebrow: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 6,
    marginLeft: 0,
    color: token.mutedForeground,
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    fontWeight: 600,
    letterSpacing: "0.04em",
    lineHeight: 1.4,
    textTransform: "uppercase"
  },
  meta: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "var(--bridge-unit-8, 8px)",
    minWidth: 0,
    marginTop: 10,
    color: token.mutedForeground,
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: 1.5
  },
  filter: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "var(--bridge-unit-8, 8px)",
    flexBasis: "100%",
    width: "100%",
    minWidth: 0
  },
  headerWrap: { flexWrap: "wrap" },
  formAction: {
    boxSizing: "border-box",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "var(--bridge-unit-8, 8px)",
    minWidth: 0,
    paddingBlock: "var(--bridge-unit-16, 16px)"
  },
  alignStart: { justifyContent: "flex-start" },
  alignEnd: { justifyContent: "flex-end" },
  alignBetween: { justifyContent: "space-between" },
  sticky: {
    position: "sticky",
    bottom: 0,
    zIndex: 1,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: token.border,
    backgroundColor: token.background
  }
})

const widthStyle = {
  full: style.widthFull,
  content: style.widthContent,
  form: style.widthForm,
  editor: style.widthEditor
} as const

const formActionAlignStyle = {
  start: style.alignStart,
  end: style.alignEnd,
  between: style.alignBetween
} as const

export type PageProps = ComponentProps<"div"> & {
  variant?: PageVariant
  /** Padding scale. Wins over the deprecated `spacing`. Default `default`. */
  density?: PageDensity
  /**
   * @deprecated Use `density`. Kept as an alias with identical values until the next major.
   */
  spacing?: PageDensity
  /** Max-width preset. Omit for the existing full-width behavior. */
  width?: PageWidth
  isDynamicPadding?: boolean
}

export function Page({
  variant = pageVariant.default,
  density,
  spacing,
  width,
  isDynamicPadding = false,
  className,
  ...props
}: PageProps) {
  const resolved = density ?? spacing ?? PageDensity.default
  return (
    <div
      data-slot="page"
      data-variant={variant}
      data-density={resolved}
      data-spacing={resolved}
      data-width={width}
      data-dynamic-padding={isDynamicPadding || undefined}
      {...props}
      className={[
        stylex.props(
          stylex.defaultMarker(),
          style.root,
          variant === pageVariant.container && style.container,
          resolved === PageDensity.none && style.none,
          resolved === PageDensity.compact && style.compact,
          resolved === PageDensity.comfortable && style.comfortable,
          isDynamicPadding && style.dynamicPadding,
          width && widthStyle[width]
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
      className={[stylex.props(style.header, style.headerWrap).className, className].filter(Boolean).join(" ")}
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

/** Small label above `PageTitle` (section, product area, status context). */
export function PageEyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="page-eyebrow"
      {...props}
      className={[stylex.props(style.eyebrow).className, className].filter(Boolean).join(" ")}
    />
  )
}

/** Inline metadata row under the title (owner, updated time, badge). */
export function PageMeta({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-meta"
      {...props}
      className={[stylex.props(style.meta).className, className].filter(Boolean).join(" ")}
    />
  )
}

/** Full-width filter row inside `PageHeader` (search, select, segmented control). */
export function PageFilter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-filter"
      {...props}
      className={[stylex.props(style.filter).className, className].filter(Boolean).join(" ")}
    />
  )
}

export type PageFormActionProps = ComponentProps<"div"> & {
  align?: PageFormActionAlign
  /** Pin the row to the bottom of the nearest scroll container. */
  sticky?: boolean
}

/** Aligned form action row (Cancel / Save), optionally sticky. */
export function PageFormAction({
  align = PageFormActionAlign.end,
  sticky = false,
  className,
  ...props
}: PageFormActionProps) {
  return (
    <div
      data-slot="page-form-action"
      data-align={align}
      data-sticky={sticky || undefined}
      {...props}
      className={[
        stylex.props(style.formAction, formActionAlignStyle[align], sticky && style.sticky).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
