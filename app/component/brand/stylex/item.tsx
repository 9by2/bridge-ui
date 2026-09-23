import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { Separator } from "./separator"
import { token } from "./token.stylex"

const style = stylex.create({
  group: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    gap: { default: 16, ':has([data-size="sm"])': 10, ':has([data-size="xs"])': 8 }
  },
  separator: { marginBlock: 8 },
  root: {
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
    flexWrap: "wrap",
    alignItems: "center",
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderWidth: 1,
    borderStyle: "solid",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "100ms",
    outline: "none",
    borderColor: { default: "transparent", ":focus-visible": token.ring },
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    backgroundColor: { default: "transparent", ":is(a):hover": token.muted },
    color: "inherit",
    textDecorationLine: "none"
  },
  outline: { borderColor: { default: token.border, ":focus-visible": token.ring } },
  muted: {
    backgroundColor: { default: `color-mix(in oklch, ${token.muted}, transparent 50%)`, ":is(a):hover": token.muted }
  },
  normal: { gap: 10, paddingInline: 12, paddingBlock: 10 },
  xs: {
    gap: 8,
    paddingInline: { default: 10, ':is([data-slot="dropdown-menu-content"] *)': 0 },
    paddingBlock: { default: 8, ':is([data-slot="dropdown-menu-content"] *)': 0 }
  },
  media: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    translate: { default: "none", [stylex.when.ancestor(':has([data-slot="item-description"])')]: "0 2px" },
    alignSelf: { default: "auto", [stylex.when.ancestor(':has([data-slot="item-description"])')]: "start" }
  },
  image: {
    width: {
      default: 40,
      [stylex.when.ancestor('[data-size="sm"]')]: 32,
      [stylex.when.ancestor('[data-size="xs"]')]: 24
    },
    height: {
      default: 40,
      [stylex.when.ancestor('[data-size="sm"]')]: 32,
      [stylex.when.ancestor('[data-size="xs"]')]: 24
    },
    overflow: "hidden",
    borderRadius: 6
  },
  content: {
    display: "flex",
    flex: { default: 1, ':is([data-slot="item-content"] + *)': "none" },
    flexDirection: "column",
    gap: { default: 4, [stylex.when.ancestor('[data-size="xs"]')]: 0 }
  },
  title: {
    display: "flex",
    overflow: "hidden",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    width: "fit-content",
    alignItems: "center",
    gap: 8,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: 1.375,
    fontWeight: 500,
    textUnderlineOffset: 4
  },
  description: {
    margin: 0,
    display: "-webkit-box",
    overflow: "hidden",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    textAlign: "left",
    fontSize: { default: 14, [stylex.when.ancestor('[data-size="xs"]')]: 12 },
    lineHeight: 1.5,
    fontWeight: 400,
    color: token.mutedForeground
  },
  action: { display: "flex", alignItems: "center", gap: 8 },
  edge: { display: "flex", flexBasis: "100%", alignItems: "center", justifyContent: "space-between", gap: 8 }
})

export function ItemGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="list"
      data-slot="item-group"
      {...props}
      className={[stylex.props(style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function ItemSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      {...props}
      className={(state) =>
        [stylex.props(style.separator).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function Item({
  className,
  variant = "default",
  size = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & {
  variant?: "default" | "outline" | "muted" | null
  size?: "default" | "sm" | "xs" | null
}) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: [
          stylex.props(
            stylex.defaultMarker(),
            style.root,
            variant === "outline" && style.outline,
            variant === "muted" && style.muted,
            size === "xs" ? style.xs : size && style.normal
          ).className,
          className
        ]
          .filter(Boolean)
          .join(" ")
      },
      props
    ),
    render,
    state: { slot: "item", variant, size }
  })
}
export function ItemMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & { variant?: "default" | "icon" | "image" | null }) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      {...props}
      className={[stylex.props(style.media, variant === "image" && style.image).className, className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function ItemContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function ItemTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      {...props}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function ItemDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      {...props}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function ItemActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      {...props}
      className={[stylex.props(style.action).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function ItemHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      {...props}
      className={[stylex.props(style.edge).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function ItemFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      {...props}
      className={[stylex.props(style.edge).className, className].filter(Boolean).join(" ")}
    />
  )
}
