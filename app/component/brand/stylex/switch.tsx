import { Switch as Primitive } from "@base-ui/react/switch"
import * as stylex from "@stylexjs/stylex"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    position: { default: "relative", "::after": "absolute" },
    boxSizing: "border-box",
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    padding: 0,
    height: 18.4,
    width: 32,
    borderRadius: "var(--bridge-radius-9999, 9999em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: "transparent", ":focus-visible": token.ring },
    backgroundColor: token.switchOff,
    content: { "::after": '""' },
    insetInline: { "::after": -12 },
    insetBlock: { "::after": -8 },
    transitionProperty: "all",
    transitionDuration: "150ms",
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    opacity: { default: 1, ":disabled": 0.5 },
    cursor: { default: "auto", ":disabled": "not-allowed" }
  },
  small: { height: 14, width: 24 },
  checked: { backgroundColor: token.primary },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  },
  thumb: {
    pointerEvents: "none",
    display: "block",
    width: 16,
    height: 16,
    borderRadius: "var(--bridge-radius-9999, 9999em)",
    backgroundColor: { default: token.switchThumb, ":is([data-checked])": token.switchThumbOn },
    transitionProperty: "translate",
    transitionDuration: "150ms",
    translate: { default: "0 0", ":is([data-checked])": "calc(100% - 2px) 0" },
    cursor: "auto"
  },
  smallThumb: { width: 12, height: 12 }
})
export function Switch({ className, size = "default", ...props }: Primitive.Root.Props & { size?: "sm" | "default" }) {
  return (
    <Primitive.Root
      data-slot="switch"
      data-size={size}
      {...props}
      className={(state) =>
        [
          stylex.props(
            style.root,
            size === "sm" && style.small,
            state.checked && style.checked,
            (props["aria-invalid"] === true || props["aria-invalid"] === "true") && style.invalid
          ).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <Primitive.Thumb data-slot="switch-thumb" {...stylex.props(style.thumb, size === "sm" && style.smallThumb)} />
    </Primitive.Root>
  )
}
