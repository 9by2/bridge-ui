import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

export const textareaStyle = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    fieldSizing: "content",
    minHeight: 64,
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: token.input, ":focus-visible": token.ring },
    backgroundColor: { default: token.inputBackground, ":disabled": token.inputDisabled },
    paddingInline: 10,
    paddingBlock: 8,
    fontFamily: "inherit",
    color: { default: token.foreground, "::placeholder": token.mutedForeground },
    fontSize: { default: 16, "@media (min-width: 768px)": 14 },
    lineHeight: { default: "24px", "@media (min-width: 768px)": "20px" },
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
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
