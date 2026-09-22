import { Input as Primitive } from "@base-ui/react/input"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps, ReactNode } from "react"

import { geometryToken, themeToken, token } from "./token.stylex"

export const inputStyle = stylex.create({
  wrapper: { position: "relative", width: "100%" },
  root: {
    boxSizing: "border-box",
    height: { default: 32, "::file-selector-button": 24 },
    width: "100%",
    minWidth: 0,
    borderRadius: geometryToken.controlRadius,
    borderWidth: { default: 1, "::file-selector-button": 0 },
    borderStyle: "solid",
    borderColor: {
      default: themeToken.input,
      ":focus-visible": themeToken.ring,
      "::file-selector-button": "currentColor"
    },
    backgroundColor: {
      default: token.inputBackground,
      ":disabled": token.inputDisabled,
      "::file-selector-button": "transparent"
    },
    color: {
      default: themeToken.foreground,
      "::placeholder": themeToken.mutedForeground,
      "::file-selector-button": themeToken.foreground
    },
    paddingInline: { default: geometryToken.controlPaddingInline, "::file-selector-button": 0 },
    paddingBlock: { default: geometryToken.controlPaddingBlock, "::file-selector-button": 0 },
    fontWeight: { default: 400, "::file-selector-button": 500 },
    display: { default: "inline-block", "::file-selector-button": "inline-flex" },
    fontFamily: "inherit",
    fontSize: { default: 16, "@media (min-width: 768px)": 14, "::file-selector-button": 14 },
    lineHeight: { default: "24px", "@media (min-width: 768px)": "20px", "::file-selector-button": "20px" },
    outline: "none",
    boxShadow: {
      default: "none",
      ":focus-visible": `0 0 0 3px color-mix(in oklch, ${themeToken.ring}, transparent 50%)`
    },
    opacity: { default: 1, ":disabled": 0.5 },
    pointerEvents: { default: "auto", ":disabled": "none" },
    cursor: { default: "text", ":disabled": "not-allowed" },
    transitionProperty: "color, background-color, border-color",
    transitionDuration: { default: "150ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: 10,
    display: "flex",
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    transform: "translateY(-50%)",
    color: token.mutedForeground,
    pointerEvents: "none"
  },
  withIcon: { paddingLeft: 34 }
})

export function Input({ className, icon, ...props }: ComponentProps<"input"> & { icon?: ReactNode }) {
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"
  const input = (
    <Primitive
      data-slot="input"
      {...props}
      className={[
        stylex.props(inputStyle.root, invalid && inputStyle.invalid, Boolean(icon) && inputStyle.withIcon).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
  if (!icon) return input
  return (
    <span data-slot="input-wrapper" {...stylex.props(inputStyle.wrapper)}>
      <span data-slot="input-icon" aria-hidden="true" {...stylex.props(inputStyle.icon)}>
        {icon}
      </span>
      {input}
    </span>
  )
}
