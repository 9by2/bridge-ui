import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    minHeight: 16,
    width: "100%",
    alignItems: "center",
    gap: 8,
    textAlign: "left",
    fontSize: 14,
    lineHeight: "20px",
    color: { default: token.mutedForeground, ":is(a):hover": token.foreground },
    textDecorationLine: { default: "none", ":is(a)": "underline" },
    textUnderlineOffset: 3
  },
  separator: {
    content: { "::before": '""', "::after": '""' },
    height: { "::before": 1, "::after": 1 },
    minWidth: { "::before": 0, "::after": 0 },
    flex: { "::before": 1, "::after": 1 },
    backgroundColor: { "::before": token.border, "::after": token.border },
    marginRight: { "::before": 4 },
    marginLeft: { "::after": 4 }
  },
  border: { borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: token.border, paddingBottom: 8 },
  icon: { width: 16, height: 16, flexShrink: 0 },
  content: {
    minWidth: 0,
    overflowWrap: "break-word",
    flex: { default: null, [stylex.when.ancestor('[data-variant="separator"]')]: "none" },
    textAlign: { default: null, [stylex.when.ancestor('[data-variant="separator"]')]: "center" }
  }
})
type Variant = "default" | "separator" | "border"
export function markerVariants({
  variant,
  className,
  class: extra
}: { variant?: Variant | null; className?: string; class?: string } = {}) {
  return [
    stylex.props(
      stylex.defaultMarker(),
      style.root,
      variant === "separator" && style.separator,
      variant === "border" && style.border
    ).className,
    className,
    extra
  ]
    .filter(Boolean)
    .join(" ")
}
export function Marker({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"div"> & { variant?: Variant | null }) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">({ className: markerVariants({ variant, className }) }, props),
    render,
    state: { slot: "marker", variant }
  })
}
export function MarkerIcon({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      {...props}
      className={[stylex.props(style.icon).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function MarkerContent({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
