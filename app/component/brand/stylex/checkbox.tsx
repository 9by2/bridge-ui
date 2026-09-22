import { Checkbox as Primitive } from "@base-ui/react/checkbox"
import * as stylex from "@stylexjs/stylex"
import { CheckIcon } from "lucide-react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    position: { default: "relative", "::after": "absolute" },
    boxSizing: "border-box",
    display: "flex",
    width: 16,
    height: 16,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: token.input, ":focus-visible": token.ring },
    backgroundColor: token.inputBackground,
    content: { "::after": '""' },
    insetInline: { "::after": -12 },
    insetBlock: { "::after": -8 },
    opacity: { default: 1, ":disabled": 0.5 },
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    cursor: { default: "default", ":disabled": "not-allowed" }
  },
  checked: { borderColor: token.primary, backgroundColor: token.primary, color: token.primaryForeground },
  invalidChecked: { borderColor: token.primary },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  },
  indicator: { display: "grid", placeContent: "center", color: "currentColor", transitionProperty: "none" },
  icon: { width: 14, height: 14 }
})
export function Checkbox({ className, ...props }: Primitive.Root.Props) {
  return (
    <Primitive.Root
      data-slot="checkbox"
      {...props}
      className={(state) =>
        [
          stylex.props(
            style.root,
            state.checked && style.checked,
            (props["aria-invalid"] === true || props["aria-invalid"] === "true") && style.invalid,
            state.checked &&
              (props["aria-invalid"] === true || props["aria-invalid"] === "true") &&
              style.invalidChecked
          ).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <Primitive.Indicator data-slot="checkbox-indicator" {...stylex.props(style.indicator)}>
        <CheckIcon {...stylex.props(style.icon)} />
      </Primitive.Indicator>
    </Primitive.Root>
  )
}
