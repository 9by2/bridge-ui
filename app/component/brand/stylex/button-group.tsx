import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { Separator } from "./separator"
import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    display: "flex",
    width: "fit-content",
    alignItems: "stretch",
    gap: { default: 0, ':has(> [data-slot="button-group"])': "var(--bridge-unit-8, 8px)" }
  },
  vertical: { flexDirection: "column" },
  text: {
    display: "flex",
    alignItems: "center",
    gap: "var(--bridge-unit-8, 8px)",
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    backgroundColor: token.muted,
    paddingInline: "var(--bridge-unit-10, 10px)",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    fontWeight: 500
  },
  separator: { position: "relative", alignSelf: "stretch", backgroundColor: token.input },
  horizontal: { marginInline: 1, width: "auto" },
  verticalSeparator: { marginBlock: 1, height: "auto" }
})
type Option = { orientation?: "horizontal" | "vertical" | null }
export function buttonGroupVariants({
  orientation = "horizontal",
  className,
  class: extra
}: Option & { className?: string; class?: string } = {}) {
  return [stylex.props(style.root, orientation === "vertical" && style.vertical).className, className, extra]
    .filter(Boolean)
    .join(" ")
}
export function ButtonGroup({ className, orientation, ...props }: ComponentProps<"div"> & Option) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      {...props}
      className={buttonGroupVariants({ orientation, className })}
    />
  )
}
export function ButtonGroupText({ className, render, ...props }: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: [stylex.props(style.text).className, className].filter(Boolean).join(" ") },
      props
    ),
    render,
    state: { slot: "button-group-text" }
  })
}
export function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      {...props}
      className={(state) =>
        [
          stylex.props(style.separator, orientation === "horizontal" ? style.horizontal : style.verticalSeparator)
            .className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
