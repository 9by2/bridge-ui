import { Radio as Primitive } from "@base-ui/react/radio"
import { RadioGroup as Group } from "@base-ui/react/radio-group"
import * as stylex from "@stylexjs/stylex"

import { token } from "./token.stylex"

const style = stylex.create({
  group: { display: "grid", width: "100%", gap: "var(--bridge-unit-8, 8px)" },
  root: {
    position: "relative",
    display: "flex",
    boxSizing: "border-box",
    width: 16,
    height: 16,
    flexShrink: 0,
    padding: 0,
    borderRadius: "var(--bridge-radius-9999, 9999em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: token.input, ":focus-visible": token.ring },
    backgroundColor: token.inputBackground,
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    cursor: { default: "default", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 }
  },
  checked: { borderColor: token.primary, backgroundColor: token.primary, color: token.primaryForeground },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  },
  indicator: { display: "flex", width: 16, height: 16, alignItems: "center", justifyContent: "center" },
  dot: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 8,
    height: 8,
    transform: "translate(-50%, -50%)",
    borderRadius: "var(--bridge-radius-9999, 9999em)",
    backgroundColor: token.primaryForeground
  }
})
export function RadioGroup({ className, ...props }: Group.Props) {
  return (
    <Group
      data-slot="radio-group"
      {...props}
      className={(state) =>
        [stylex.props(style.group).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function RadioGroupItem({ className, ...props }: Primitive.Root.Props) {
  return (
    <Primitive.Root
      data-slot="radio-group-item"
      {...props}
      className={(state) =>
        [
          stylex.props(
            style.root,
            state.checked && style.checked,
            (props["aria-invalid"] === true || props["aria-invalid"] === "true") && style.invalid
          ).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <Primitive.Indicator data-slot="radio-group-indicator" {...stylex.props(style.indicator)}>
        <span {...stylex.props(style.dot)} />
      </Primitive.Indicator>
    </Primitive.Root>
  )
}
