import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as stylex from "@stylexjs/stylex"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    display: "inline-flex",
    boxSizing: "border-box",
    height: 20,
    width: "fit-content",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    overflow: "hidden",
    borderRadius: 26,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: "transparent", ":focus-visible": token.ring },
    paddingInline: 8,
    paddingBlock: 2,
    fontSize: 12,
    lineHeight: "16px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    transitionProperty: "all",
    transitionDuration: "150ms",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` }
  },
  default: {
    backgroundColor: {
      default: token.primary,
      ":is(a):hover": `color-mix(in oklch, ${token.primary}, transparent 20%)`
    },
    color: token.primaryForeground
  },
  secondary: {
    backgroundColor: {
      default: token.secondary,
      ":is(a):hover": `color-mix(in oklch, ${token.secondary}, transparent 20%)`
    },
    color: token.secondaryForeground
  },
  destructive: {
    backgroundColor: {
      default: `color-mix(in oklch, ${token.destructive} ${token.destructiveOpacity}, transparent)`,
      ":is(a):hover": `color-mix(in oklch, ${token.destructive}, transparent 80%)`
    },
    color: token.errorText,
    boxShadow: {
      default: "none",
      ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
    }
  },
  outline: {
    borderColor: token.border,
    color: { default: token.foreground, ":is(a):hover": token.mutedForeground },
    backgroundColor: { default: "transparent", ":is(a):hover": token.muted }
  },
  ghost: {
    backgroundColor: { default: "transparent", ":hover": token.ghostHover },
    color: { default: "inherit", ":hover": token.mutedForeground }
  },
  link: { color: token.primary, textUnderlineOffset: 4, textDecoration: { default: "none", ":hover": "underline" } },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  }
})
type Variant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
export function badgeVariants({
  variant = "default",
  className,
  class: extra
}: { variant?: Variant | null; className?: string; class?: string } = {}) {
  return [stylex.props(style.root, variant && style[variant]).className, className, extra].filter(Boolean).join(" ")
}
export function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & { variant?: Variant | null }) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: [
          stylex.props(
            style.root,
            variant && style[variant],
            (props["aria-invalid"] === true || props["aria-invalid"] === "true") && style.invalid
          ).className,
          className
        ]
          .filter(Boolean)
          .join(" ")
      },
      props
    ),
    render,
    state: { slot: "badge", variant }
  })
}
