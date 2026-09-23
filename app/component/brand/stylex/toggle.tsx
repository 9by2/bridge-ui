import { Toggle as Primitive } from "@base-ui/react/toggle"
import * as stylex from "@stylexjs/stylex"

import { token } from "./token.stylex"

export const toggleStyle = stylex.create({
  root: {
    display: "inline-flex",
    boxSizing: "border-box",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderWidth: 0,
    fontFamily: "inherit",
    color: token.foreground,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    transitionProperty: "all",
    transitionDuration: "150ms",
    outline: "none",
    backgroundColor: { default: "transparent", ":hover": token.muted, ':is([aria-pressed="true"])': token.muted },
    pointerEvents: { default: "auto", ":disabled": "none" },
    opacity: { default: 1, ":disabled": 0.5 },
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` }
  },
  outline: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: token.input, ":focus-visible": token.ring }
  },
  defaultSize: { height: 32, minWidth: 32, paddingInline: 10 },
  sm: { height: 28, minWidth: 28, borderRadius: "var(--bridge-radius-8, 0.5em)", paddingInline: 10, fontSize: "0.8rem" },
  lg: { height: 36, minWidth: 36, paddingInline: 10 },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  }
})
type Option = { variant?: "default" | "outline" | null; size?: "default" | "sm" | "lg" | null }
export function toggleVariants({
  variant = "default",
  size = "default",
  className,
  class: extra
}: Option & { className?: string; class?: string } = {}) {
  return [
    stylex.props(
      toggleStyle.root,
      variant === "outline" && toggleStyle.outline,
      size === "default" ? toggleStyle.defaultSize : size && toggleStyle[size]
    ).className,
    className,
    extra
  ]
    .filter(Boolean)
    .join(" ")
}
export function Toggle({ className, variant = "default", size = "default", ...props }: Primitive.Props & Option) {
  return (
    <Primitive
      data-slot="toggle"
      {...props}
      className={(state) =>
        [
          stylex.props(
            toggleStyle.root,
            variant === "outline" && toggleStyle.outline,
            size === "default" ? toggleStyle.defaultSize : size && toggleStyle[size],
            (props["aria-invalid"] === true || props["aria-invalid"] === "true") && toggleStyle.invalid
          ).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
