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
    gap: 8,
    paddingBlock: 6,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    fontWeight: 500,
    color: token.mutedForeground,
    userSelect: "none",
    opacity: { default: 1, [stylex.when.ancestor('[data-disabled="true"]')]: 0.5 }
  },
  start: {
    order: -9999,
    paddingLeft: 8,
    marginLeft: { default: 0, ":has(> button)": "-0.3rem", ":has(> kbd)": "-0.15rem" }
  },
  end: {
    order: 9999,
    paddingRight: 8,
    marginRight: { default: 0, ":has(> button)": "-0.3rem", ":has(> kbd)": "-0.15rem" }
  },
  blockStart: {
    order: -9999,
    width: "100%",
    justifyContent: "start",
    paddingInline: 10,
    paddingTop: 8,
    paddingBottom: { default: 6, ":is(.border-b)": 8 }
  },
  blockEnd: {
    order: 9999,
    width: "100%",
    justifyContent: "start",
    paddingInline: 10,
    paddingBottom: 8,
    paddingTop: { default: 6, ":is(.border-t)": 8 }
  },
  text: {
    display: "flex",
    alignItems: "center",
    gap: 8,
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
    paddingTop: { default: 4, [stylex.when.ancestor(':has(> [data-align="block-end"])')]: 12 },
    paddingBottom: { default: 4, [stylex.when.ancestor(':has(> [data-align="block-start"])')]: 12 },
    paddingRight: { default: 10, [stylex.when.ancestor(':has(> [data-align="inline-end"])')]: 6 },
    paddingLeft: { default: 10, [stylex.when.ancestor(':has(> [data-align="inline-start"])')]: 6 }
  },
  textarea: { resize: "none", paddingBlock: 8 }
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
