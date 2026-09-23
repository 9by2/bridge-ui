import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { Button } from "./button"
import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    minWidth: 0,
    flexShrink: 0,
    flexWrap: "wrap",
    borderRadius: "var(--bridge-radius-14, 0.875em)",
    borderWidth: 1,
    borderStyle: { default: "solid", ':is([data-state="idle"])': "dashed" },
    borderColor: {
      default: token.border,
      ':is([data-state="error"])': `color-mix(in oklch, ${token.destructive}, transparent 70%)`
    },
    backgroundColor: {
      default: token.background,
      ":has(> a, > button):hover": `color-mix(in oklch, ${token.muted}, transparent 50%)`
    },
    color: token.foreground,
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    boxShadow: { default: "none", ":focus-within": `0 0 0 1px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    scrollSnapAlign: "start"
  },
  default: {
    gap: 8,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    paddingInline: {
      default: 0,
      ':has([data-slot="attachment-content"])': 10,
      ':has([data-slot="attachment-media"])': 8
    },
    paddingBlock: { default: 0, ':has([data-slot="attachment-content"], [data-slot="attachment-media"])': 8 }
  },
  sm: {
    gap: 10,
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px",
    paddingInline: {
      default: 0,
      ':has([data-slot="attachment-content"])': 8,
      ':has([data-slot="attachment-media"])': 6
    },
    paddingBlock: { default: 0, ':has([data-slot="attachment-content"], [data-slot="attachment-media"])': 6 }
  },
  xs: {
    gap: 6,
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px",
    paddingInline: {
      default: 0,
      ':has([data-slot="attachment-content"])': 6,
      ':has([data-slot="attachment-media"])': 4
    },
    paddingBlock: { default: 0, ':has([data-slot="attachment-content"], [data-slot="attachment-media"])': 4 }
  },
  horizontal: { minWidth: 160, alignItems: "center" },
  vertical: { width: { default: 96, ':has([data-slot="attachment-content"])': 120 }, flexDirection: "column" },
  media: {
    position: "relative",
    display: "flex",
    aspectRatio: "1",
    width: {
      default: 40,
      [stylex.when.ancestor('[data-orientation="vertical"]')]: "100%",
      [stylex.when.ancestor('[data-size="sm"]')]: 32,
      [stylex.when.ancestor('[data-size="xs"]')]: 28
    },
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: { default: 10, [stylex.when.ancestor('[data-size="xs"]')]: 8 },
    backgroundColor: {
      default: token.muted,
      [stylex.when.ancestor('[data-state="error"]')]: `color-mix(in oklch, ${token.destructive}, transparent 90%)`
    },
    color: { default: token.foreground, [stylex.when.ancestor('[data-state="error"]')]: token.errorText }
  },
  image: { opacity: { default: 0.6, [stylex.when.ancestor(':is([data-state="done"], [data-state="idle"])')]: 1 } },
  content: {
    maxWidth: "100%",
    minWidth: 0,
    flex: 1,
    lineHeight: 1.25,
    paddingInline: { default: 0, [stylex.when.ancestor('[data-orientation="vertical"]')]: 4 }
  },
  title: {
    display: "block",
    maxWidth: "100%",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: 500
  },
  description: {
    marginTop: 2,
    display: "block",
    maxWidth: "100%",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px",
    color: {
      default: token.mutedForeground,
      [stylex.when.ancestor('[data-state="error"]')]: `color-mix(in oklch, ${token.errorText}, transparent 20%)`
    }
  },
  actions: {
    position: { default: "relative", [stylex.when.ancestor('[data-orientation="vertical"]')]: "absolute" },
    zIndex: 20,
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    top: { default: "auto", [stylex.when.ancestor('[data-orientation="vertical"]')]: 12 },
    right: { default: "auto", [stylex.when.ancestor('[data-orientation="vertical"]')]: 12 },
    gap: { default: 0, [stylex.when.ancestor('[data-orientation="vertical"]')]: 4 }
  },
  trigger: {
    position: "absolute",
    inset: 0,
    zIndex: 10,
    outline: "none",
    backgroundColor: "transparent",
    borderWidth: 0
  },
  group: {
    display: "flex",
    minWidth: 0,
    scrollSnapType: "x mandatory",
    scrollPaddingInline: 4,
    scrollbarWidth: "none",
    gap: 12,
    overflowX: "auto",
    overscrollBehaviorX: "contain",
    paddingBlock: 4
  }
})
export function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: ComponentProps<"div"> & {
  state?: "idle" | "uploading" | "processing" | "error" | "done"
  size?: "default" | "sm" | "xs" | null
  orientation?: "horizontal" | "vertical" | null
}) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      {...props}
      className={[
        stylex.props(stylex.defaultMarker(), style.root, size && style[size], orientation && style[orientation])
          .className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: ComponentProps<"div"> & { variant?: "icon" | "image" | null }) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      {...props}
      className={[stylex.props(style.media, variant === "image" && style.image).className, className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function AttachmentContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AttachmentTitle({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      {...props}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AttachmentDescription({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      {...props}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AttachmentActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      {...props}
      className={[stylex.props(style.actions).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function AttachmentAction({ variant, size = "icon-xs", ...props }: ComponentProps<typeof Button>) {
  return <Button data-slot="attachment-action" variant={variant ?? "ghost"} size={size} {...props} />
}
export function AttachmentTrigger({ className, render, type, ...props }: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: [stylex.props(style.trigger).className, className].filter(Boolean).join(" ")
      },
      props
    ),
    render,
    state: { slot: "attachment-trigger" }
  })
}
export function AttachmentGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      {...props}
      className={[stylex.props(style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
