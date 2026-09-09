import { Input as Primitive } from "@base-ui/react/input"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

export const inputStyle = stylex.create({
  root: {
    boxSizing: "border-box",
    height: { default: 32, "::file-selector-button": 24 },
    width: "100%",
    minWidth: 0,
    borderRadius: 10,
    borderWidth: { default: 1, "::file-selector-button": 0 },
    borderStyle: "solid",
    borderColor: { default: token.input, ":focus-visible": token.ring, "::file-selector-button": "currentColor" },
    backgroundColor: {
      default: token.inputBackground,
      ":disabled": token.inputDisabled,
      "::file-selector-button": "transparent"
    },
    color: {
      default: token.foreground,
      "::placeholder": token.mutedForeground,
      "::file-selector-button": token.foreground
    },
    paddingInline: { default: 10, "::file-selector-button": 0 },
    paddingBlock: { default: 4, "::file-selector-button": 0 },
    fontWeight: { default: 400, "::file-selector-button": 500 },
    display: { default: "inline-block", "::file-selector-button": "inline-flex" },
    fontFamily: "inherit",
    fontSize: { default: 16, "@media (min-width: 768px)": 14, "::file-selector-button": 14 },
    lineHeight: { default: "24px", "@media (min-width: 768px)": "20px", "::file-selector-button": "20px" },
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    opacity: { default: 1, ":disabled": 0.5 },
    pointerEvents: { default: "auto", ":disabled": "none" },
    cursor: { default: "text", ":disabled": "not-allowed" },
    transitionProperty: "color, background-color, border-color",
    transitionDuration: { default: "150ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  }
})

export function Input({ className, ...props }: ComponentProps<"input">) {
  const invalid = props["aria-invalid"] === true || props["aria-invalid"] === "true"
  return (
    <Primitive
      data-slot="input"
      {...props}
      className={[stylex.props(inputStyle.root, invalid && inputStyle.invalid).className, className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
