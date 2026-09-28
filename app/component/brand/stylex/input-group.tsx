import { Input as Primitive } from "@base-ui/react/input"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { Button } from "./button"
import { inputStyle } from "./input"
import { textareaStyle } from "./textarea"
import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    height: { default: 32, ':has(> [data-align="block-start"], > [data-align="block-end"], > textarea)': "auto" },
    width: "100%",
    minWidth: 0,
    alignItems: "center",
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderWidth: 1,
    borderStyle: "solid",
    outline: "none",
    flexDirection: { default: "row", ':has(> [data-align="block-start"], > [data-align="block-end"])': "column" },
    borderColor: {
      default: token.input,
      ':has([data-slot="input-group-control"]:focus-visible)': token.ring,
      ':has([data-slot][aria-invalid="true"])': token.invalidBorder
    },
    backgroundColor: { default: token.inputBackground, ":has(:disabled)": token.inputDisabled },
    opacity: { default: 1, ":has(:disabled)": 0.5 },
    boxShadow: {
      default: "none",
      ':has([data-slot="input-group-control"]:focus-visible)': `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)`,
      ':has([data-slot][aria-invalid="true"])': `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
    },
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms"
  },
  addon: {
    boxSizing: "border-box",
    display: "flex",
    height: "auto",
    cursor: "text",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--bridge-unit-8, 8px)",
    paddingBlock: "var(--bridge-unit-6, 6px)",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    fontWeight: 500,
    color: token.mutedForeground,
    userSelect: "none",
    opacity: { default: 1, [stylex.when.ancestor('[data-disabled="true"]')]: 0.5 }
  },
  start: {
    order: -9999,
    paddingLeft: "var(--bridge-unit-8, 8px)",
    marginLeft: { default: 0, ":has(> button)": "-0.3rem", ":has(> kbd)": "-0.15rem" }
  },
  end: {
    order: 9999,
    paddingRight: "var(--bridge-unit-8, 8px)",
    marginRight: { default: 0, ":has(> button)": "-0.3rem", ":has(> kbd)": "-0.15rem" }
  },
  blockStart: {
    order: -9999,
    width: "100%",
    justifyContent: "start",
    paddingInline: "var(--bridge-unit-10, 10px)",
    paddingTop: "var(--bridge-unit-8, 8px)",
    paddingBottom: { default: "var(--bridge-unit-6, 6px)", ":is(.border-b)": "var(--bridge-unit-8, 8px)" }
  },
  blockEnd: {
    order: 9999,
    width: "100%",
    justifyContent: "start",
    paddingInline: "var(--bridge-unit-10, 10px)",
    paddingBottom: "var(--bridge-unit-8, 8px)",
    paddingTop: { default: "var(--bridge-unit-6, 6px)", ":is(.border-t)": "var(--bridge-unit-8, 8px)" }
  },
  text: {
    display: "flex",
    alignItems: "center",
    gap: "var(--bridge-unit-8, 8px)",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    color: token.mutedForeground
  },
  control: {
    flex: 1,
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: { default: "transparent", ":disabled": "transparent" },
    boxShadow: { default: "none", ":focus-visible": "none" }
  },
  input: {
    paddingTop: {
      default: "var(--bridge-unit-4, 4px)",
      [stylex.when.ancestor(':has(> [data-align="block-end"])')]: "var(--bridge-unit-12, 12px)"
    },
    paddingBottom: {
      default: "var(--bridge-unit-4, 4px)",
      [stylex.when.ancestor(':has(> [data-align="block-start"])')]: "var(--bridge-unit-12, 12px)"
    },
    paddingRight: {
      default: "var(--bridge-unit-10, 10px)",
      [stylex.when.ancestor(':has(> [data-align="inline-end"])')]: "var(--bridge-unit-6, 6px)"
    },
    paddingLeft: {
      default: "var(--bridge-unit-10, 10px)",
      [stylex.when.ancestor(':has(> [data-align="inline-start"])')]: "var(--bridge-unit-6, 6px)"
    }
  },
  textarea: { resize: "none", paddingBlock: "var(--bridge-unit-8, 8px)" }
})

export function InputGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="input-group"
      {...props}
      className={[stylex.props(stylex.defaultMarker(), style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: ComponentProps<"div"> & { align?: "inline-start" | "inline-end" | "block-start" | "block-end" | null }) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      onClick={(event) => {
        if (event.target instanceof Element && event.target.closest("button")) return
        event.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
      className={[
        stylex.props(
          style.addon,
          align === "inline-start" && style.start,
          align === "inline-end" && style.end,
          align === "block-start" && style.blockStart,
          align === "block-end" && style.blockEnd
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function InputGroupButton({
  size = "xs",
  type = "button",
  variant = "ghost",
  ...props
}: Omit<ComponentProps<typeof Button>, "size" | "type"> & {
  size?: "xs" | "sm" | "icon-xs" | "icon-sm" | null
  type?: "button" | "submit" | "reset"
}) {
  return <Button type={type} variant={variant} inputGroupSize={size} data-size={size} {...props} />
}
export function InputGroupText({ className, ...props }: ComponentProps<"span">) {
  return <span {...props} className={[stylex.props(style.text).className, className].filter(Boolean).join(" ")} />
}
export function InputGroupInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <Primitive
      data-slot="input-group-control"
      {...props}
      className={[stylex.props(inputStyle.root, style.control, style.input).className, className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function InputGroupTextarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="input-group-control"
      {...props}
      className={[stylex.props(textareaStyle.root, style.control, style.textarea).className, className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
