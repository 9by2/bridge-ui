import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { geometryToken, themeToken, token } from "./token.stylex"

export const textareaStyle = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    fieldSizing: "content",
    minHeight: 64,
    width: "100%",
    borderRadius: geometryToken.controlRadius,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: themeToken.input, ":focus-visible": themeToken.ring },
    backgroundColor: { default: token.inputBackground, ":disabled": token.inputDisabled },
    paddingInline: geometryToken.controlPaddingInline,
    paddingBlock: "calc(var(--bridge-control-padding-block, 4px) * 2)",
    fontFamily: "inherit",
    color: { default: themeToken.foreground, "::placeholder": themeToken.mutedForeground },
    fontSize: { default: 16, "@media (min-width: 768px)": 14 },
    lineHeight: { default: "24px", "@media (min-width: 768px)": "20px" },
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    outline: "none",
    boxShadow: {
      default: "none",
      ":focus-visible": `0 0 0 3px color-mix(in oklch, ${themeToken.ring}, transparent 50%)`
    },
    cursor: { default: "text", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 }
  },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  }
})
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      {...props}
      className={[
        stylex.props(
          textareaStyle.root,
          (props["aria-invalid"] === true || props["aria-invalid"] === "true") && textareaStyle.invalid
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
