import { Button as Primitive } from "@base-ui/react/button"
import * as stylex from "@stylexjs/stylex"

import { buttonToken, themeToken, token } from "./token.stylex"

const style = stylex.create({
  press: { translate: { default: "none", ":active": "0 1px" } },
  popupTrigger: { translate: { default: "none", ":active": "none" } },
  root: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    borderRadius: buttonToken["--bridge-button-radius"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: "transparent", ":focus-visible": token.ring },
    backgroundClip: "padding-box",
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    fontWeight: 500,
    lineHeight: "20px",
    whiteSpace: "nowrap",
    userSelect: "none",
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    opacity: { default: 1, ":disabled": 0.5 },
    pointerEvents: { default: "auto", ":disabled": "none" },
    // Cue's `transition-all` default is intentional: consumers expect every visual state
    // change in the default control recipe to use the same 150ms motion curve.
    transitionProperty: "all",
    transitionDuration: { default: "150ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
  },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  },
  default: {
    backgroundColor: {
      default: buttonToken["--bridge-button-primary"],
      ":hover": `color-mix(in oklch, ${buttonToken["--bridge-button-primary"]}, transparent 20%)`
    },
    color: buttonToken["--bridge-button-primary-foreground"]
  },
  outline: {
    borderColor: token.outlineBorder,
    backgroundColor: {
      default: token.outlineBackground,
      ":hover": token.outlineHover,
      ':is([aria-expanded="true"])': token.muted
    },
    color: { default: token.foreground, ':is([aria-expanded="true"])': token.foreground }
  },
  secondary: {
    backgroundColor: {
      default: token.secondary,
      ":hover": `color-mix(in oklch, ${token.secondary}, ${token.foreground} 5%)`
    },
    color: token.secondaryForeground
  },
  ghost: {
    backgroundColor: {
      default: "transparent",
      ":hover": token.ghostHover,
      ':is([aria-expanded="true"])': token.muted
    },
    color: token.foreground
  },
  destructive: {
    boxShadow: {
      default: "none",
      ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.destructive}, transparent 60%)`
    },
    borderColor: {
      default: "transparent",
      ":focus-visible": `color-mix(in oklch, ${token.destructive}, transparent 60%)`
    },
    backgroundColor: {
      default: token.destructive,
      ":hover": `color-mix(in oklch, ${token.destructive}, transparent 10%)`
    },
    color: token.destructiveForeground
  },
  warning: {
    boxShadow: {
      default: "none",
      ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.warning}, transparent 80%)`
    },
    borderColor: { default: "transparent", ":focus-visible": `color-mix(in oklch, ${token.warning}, transparent 60%)` },
    backgroundColor: { default: token.warning, ":hover": `color-mix(in oklch, ${token.warning}, transparent 10%)` },
    color: token.warningForeground
  },
  cta: {
    borderRadius: 0,
    backgroundImage: {
      default: `linear-gradient(to right, ${token.brand}, ${token.brandAccent})`,
      ":hover": `linear-gradient(to right, color-mix(in oklch, ${token.brand}, transparent 10%), color-mix(in oklch, ${token.brandAccent}, transparent 10%))`
    },
    color: token.highlight,
    fontFamily: token.fontHeading,
    transitionProperty:
      "color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to"
  },
  link: {
    backgroundColor: "transparent",
    color: token.primary,
    textUnderlineOffset: 4,
    textDecorationLine: { default: "none", ":hover": "underline" }
  }
})
const sizeStyle = stylex.create({
  default: { height: 32, gap: 6, paddingInline: buttonToken["--bridge-button-padding-inline"] },
  xs: {
    height: 24,
    gap: 4,
    paddingInline: 8,
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px",
    borderRadius: buttonToken["--bridge-button-radius-small"]
  },
  sm: {
    height: 28,
    gap: 4,
    paddingInline: buttonToken["--bridge-button-padding-inline"],
    fontSize: "0.8rem",
    lineHeight: 1.5,
    borderRadius: buttonToken["--bridge-button-radius-small"]
  },
  lg: { height: 36, gap: 6, paddingInline: buttonToken["--bridge-button-padding-inline"] },
  xl: { height: 44, gap: 6, paddingInline: 12, fontSize: "var(--bridge-font-size-xl, 1.125em)", lineHeight: "28px" },
  icon: { height: 32, width: 32, padding: 0 },
  "icon-xs": { height: 24, width: 24, padding: 0, borderRadius: "var(--bridge-radius-8, 0.5em)" },
  "icon-sm": { height: 28, width: 28, padding: 0, borderRadius: "var(--bridge-radius-8, 0.5em)" },
  "icon-lg": { height: 36, width: 36, padding: 0 }
})
const groupStyle = stylex.create({
  base: { fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: "20px", gap: 8, boxShadow: "none" },
  xs: { height: 24, gap: 4, borderRadius: "var(--bridge-radius-11, 0.6875em)", paddingInline: 6 },
  iconXs: { height: 24, width: 24, borderRadius: "var(--bridge-radius-11, 0.6875em)", padding: 0 },
  iconSm: { height: 32, width: 32, padding: 0 }
})
const multiSelectStyle = stylex.create({
  trigger: {
    height: "auto",
    minHeight: 36,
    width: "fit-content",
    justifyContent: "space-between",
    gap: 8,
    overflow: "hidden",
    borderRadius: 0,
    paddingInline: 12,
    paddingBlock: 6
  }
})
type Variant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "warning" | "cta" | "link"
type Size = keyof typeof sizeStyle

export function buttonVariants({
  variant = "default",
  size = "default",
  className,
  class: extra
}: { variant?: Variant | null; size?: Size | null; className?: string; class?: string } = {}) {
  return [
    "pilot-button",
    size && `pilot-button-${size}`,
    stylex.props(style.root, style.press, variant && style[variant], size && sizeStyle[size]).className,
    className,
    extra
  ]
    .filter(Boolean)
    .join(" ")
}

export function Button({
  variant = "default",
  size = "default",
  className,
  inputGroupSize,
  multiSelectTrigger,
  ...props
}: Primitive.Props & {
  variant?: Variant | null
  size?: Size | null
  inputGroupSize?: "xs" | "sm" | "icon-xs" | "icon-sm" | null
  multiSelectTrigger?: boolean
}) {
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"
  const popup =
    props["aria-haspopup"] !== undefined && props["aria-haspopup"] !== false && props["aria-haspopup"] !== "false"
  const compiled = stylex.props(
    style.root,
    style.press,
    variant && style[variant],
    size && sizeStyle[size],
    invalid && style.invalid,
    popup && style.popupTrigger,
    inputGroupSize !== undefined && groupStyle.base,
    inputGroupSize === "xs" && groupStyle.xs,
    inputGroupSize === "icon-xs" && groupStyle.iconXs,
    inputGroupSize === "icon-sm" && groupStyle.iconSm,
    multiSelectTrigger && multiSelectStyle.trigger
  ).className
  const classes = ["pilot-button", size && `pilot-button-${size}`, compiled].filter(Boolean).join(" ")
  return (
    <Primitive
      data-slot="button"
      data-size={size}
      {...props}
      className={
        typeof className === "function" ? (state) => `${classes} ${className(state)}` : `${classes} ${className ?? ""}`
      }
    />
  )
}
