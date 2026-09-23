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
    borderRadius: "var(--bridge-radius-26, 1.625em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: "transparent", ":focus-visible": token.ring },
    paddingRight: { default: 8, ':has([data-icon="inline-end"])': 6 },
    paddingLeft: { default: 8, ':has([data-icon="inline-start"])': 6 },
    paddingBlock: 2,
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
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
  warning: {
    backgroundColor: {
      default: token.warning,
      ":is(a):hover": `color-mix(in oklch, ${token.warning}, transparent 10%)`
    },
    color: token.warningForeground,
    boxShadow: {
      default: "none",
      ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.warning} ${token.errorRingOpacity}, transparent)`
    }
  },
  info: { backgroundColor: token.primary, color: token.primaryForeground },
  pending: { backgroundColor: token.muted, color: token.foreground },
  success: { backgroundColor: token.brand, color: token.brandForeground },
  partialSuccess: { backgroundColor: token.brandAccent, color: token.brandAccentForeground },
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
type Variant =
  | "default"
  | "secondary"
  | "destructive"
  | "warning"
  | "info"
  | "pending"
  | "success"
  | "partial-success"
  | "outline"
  | "ghost"
  | "link"
const variantStyle = {
  default: style.default,
  secondary: style.secondary,
  destructive: style.destructive,
  warning: style.warning,
  info: style.info,
  pending: style.pending,
  success: style.success,
  "partial-success": style.partialSuccess,
  outline: style.outline,
  ghost: style.ghost,
  link: style.link
} as const
export function badgeVariants({
  variant = "default",
  className,
  class: extra
}: { variant?: Variant | null; className?: string; class?: string } = {}) {
  return [stylex.props(style.root, variant && variantStyle[variant]).className, className, extra]
    .filter(Boolean)
    .join(" ")
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
            variant && variantStyle[variant],
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
