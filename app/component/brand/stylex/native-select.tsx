import * as stylex from "@stylexjs/stylex"
import { ChevronDownIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  wrapper: { position: "relative", width: "fit-content", opacity: { default: 1, ":has(select:disabled)": 0.5 } },
  root: {
    boxSizing: "border-box",
    height: 32,
    width: "100%",
    minWidth: 0,
    appearance: "none",
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: token.input, ":focus-visible": token.ring },
    backgroundColor: token.inputBackground,
    paddingBlock: "var(--bridge-unit-4, 4px)",
    paddingRight: "var(--bridge-unit-32, 32px)",
    paddingLeft: "var(--bridge-unit-10, 10px)",
    fontFamily: "inherit",
    color: token.foreground,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    outline: "none",
    userSelect: "none",
    pointerEvents: { default: "auto", ":disabled": "none" },
    cursor: { default: "default", ":disabled": "not-allowed" },
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` }
  },
  small: { height: 28, borderRadius: "var(--bridge-radius-8, 0.5em)", paddingBlock: "var(--bridge-unit-2, 2px)" },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  },
  icon: {
    pointerEvents: "none",
    position: "absolute",
    top: "50%",
    right: 10,
    width: 16,
    height: 16,
    transform: "translateY(-50%)",
    color: token.mutedForeground,
    userSelect: "none"
  },
  option: { backgroundColor: "Canvas", color: "CanvasText" }
})
export function NativeSelect({
  className,
  size = "default",
  ...props
}: Omit<ComponentProps<"select">, "size"> & { size?: "sm" | "default" }) {
  return (
    <div
      data-slot="native-select-wrapper"
      data-size={size}
      className={[stylex.props(style.wrapper).className, className].filter(Boolean).join(" ")}>
      <select
        data-slot="native-select"
        data-size={size}
        {...props}
        {...stylex.props(
          style.root,
          size === "sm" && style.small,
          (props["aria-invalid"] === true || props["aria-invalid"] === "true") && style.invalid
        )}
      />
      <ChevronDownIcon data-slot="native-select-icon" aria-hidden="true" {...stylex.props(style.icon)} />
    </div>
  )
}
export function NativeSelectOption({ className, ...props }: ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      {...props}
      className={[stylex.props(style.option).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function NativeSelectOptGroup({ className, ...props }: ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      {...props}
      className={[stylex.props(style.option).className, className].filter(Boolean).join(" ")}
    />
  )
}
