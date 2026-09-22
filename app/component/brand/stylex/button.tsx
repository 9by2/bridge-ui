import { Button as Primitive } from "@base-ui/react/button"
import * as stylex from "@stylexjs/stylex"

import { geometryToken, themeToken, token } from "./token.stylex"

const style = stylex.create({
  expanded: { backgroundColor: token.muted, color: token.foreground },
  outlineExpanded: { backgroundColor: token.outlineExpanded, color: token.foreground },
  press: { translate: { default: "none", ":active": "0 1px" } },
  popupTrigger: { translate: { default: "none", ":active": "none" } },
  root: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    borderRadius: geometryToken.controlRadius,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: "transparent", ":focus-visible": token.ring },
    backgroundClip: "padding-box",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "20px",
    whiteSpace: "nowrap",
    userSelect: "none",
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    opacity: { default: 1, ":disabled": 0.5 },
    pointerEvents: { default: "auto", ":disabled": "none" },
    transitionProperty: "color, background-color, border-color, box-shadow, transform",
    transitionDuration: { default: "150ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  },
  default: {
    backgroundColor: {
      default: themeToken.primary,
      ":hover": `color-mix(in oklch, ${themeToken.primary}, transparent 20%)`
    },
    color: themeToken.primaryForeground
  },
  outline: {
    borderColor: { default: token.outlineBorder, ":focus-visible": token.outlineFocus },
    backgroundColor: { default: token.outlineBackground, ":hover": token.outlineHover },
    color: token.foreground
  },
  secondary: {
    backgroundColor: {
      default: token.secondary,
      ":hover": `color-mix(in oklch, ${token.secondary}, ${token.foreground} 5%)`
    },
    color: token.secondaryForeground
  },
  ghost: { backgroundColor: { default: "transparent", ":hover": token.ghostHover }, color: token.foreground },
  destructive: {
    boxShadow: {
      default: "none",
      ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
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
    backgroundImage: `linear-gradient(to right, ${token.brand}, ${token.brandAccent})`,
    color: token.highlight,
    fontFamily: token.fontHeading
  },
  link: {
    backgroundColor: "transparent",
    color: token.primary,
    textUnderlineOffset: 4,
    textDecorationLine: { default: "none", ":hover": "underline" }
  }
})
const sizeStyle = stylex.create({
  default: { height: 32, gap: 6, paddingInline: geometryToken.controlPaddingInline },
  xs: {
    height: 24,
    gap: 4,
    paddingInline: 8,
    fontSize: 12,
    lineHeight: "16px",
    borderRadius: geometryToken.controlRadiusSmall
  },
  sm: {
    height: 28,
    gap: 4,
    paddingInline: geometryToken.controlPaddingInline,
    fontSize: "0.8rem",
    lineHeight: 1.5,
    borderRadius: geometryToken.controlRadiusSmall
  },
  lg: { height: 36, gap: 6, paddingInline: geometryToken.controlPaddingInline },
  xl: { height: 44, gap: 6, paddingInline: 12, fontSize: 18, lineHeight: "28px" },
  icon: { height: 32, width: 32, padding: 0 },
  "icon-xs": { height: 24, width: 24, padding: 0, borderRadius: 8 },
  "icon-sm": { height: 28, width: 28, padding: 0, borderRadius: 8 },
  "icon-lg": { height: 36, width: 36, padding: 0 }
})
const groupStyle = stylex.create({
  base: { fontSize: 14, lineHeight: "20px", gap: 8, boxShadow: "none" },
  xs: { height: 24, gap: 4, borderRadius: 11, paddingInline: 6 },
  iconXs: { height: 24, width: 24, borderRadius: 11, padding: 0 },
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
    (props["aria-expanded"] === true || props["aria-expanded"] === "true") &&
      (variant === "outline"
        ? style.outlineExpanded
        : (variant === "ghost" || variant === "secondary") && style.expanded),
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
