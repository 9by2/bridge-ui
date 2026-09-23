import { Toggle as Primitive } from "@base-ui/react/toggle"
import { ToggleGroup as Group } from "@base-ui/react/toggle-group"
import * as stylex from "@stylexjs/stylex"
import { createContext, useContext, useMemo } from "react"

import { toggleStyle } from "./toggle"

type Option = {
  variant?: "default" | "outline" | null
  size?: "default" | "sm" | "lg" | null
  spacing?: number
  orientation?: "horizontal" | "vertical"
}
const Context = createContext<Option>({ variant: "default", size: "default", spacing: 2, orientation: "horizontal" })
const style = stylex.create({
  root: {
    display: "flex",
    width: "fit-content",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: "var(--bridge-radius-10, 0.625em)"
  },
  small: { borderRadius: "var(--bridge-radius-8, 0.5em)" },
  vertical: { flexDirection: "column", alignItems: "stretch" },
  item: { flexShrink: 0, zIndex: { default: "auto", ":focus": 10, ":focus-visible": 10 } },
  joined: {
    borderRadius: 0,
    paddingInline: 8,
    paddingRight: { default: 8, ':has([data-icon="inline-end"])': 6 },
    paddingLeft: { default: 8, ':has([data-icon="inline-start"])': 6 }
  },
  horizontalEdge: {
    borderTopLeftRadius: { default: 0, ":first-child": 10 },
    borderBottomLeftRadius: { default: 0, ":first-child": 10 },
    borderTopRightRadius: { default: 0, ":last-child": 10 },
    borderBottomRightRadius: { default: 0, ":last-child": 10 }
  },
  verticalEdge: {
    borderTopLeftRadius: { default: 0, ":first-child": 10 },
    borderTopRightRadius: { default: 0, ":first-child": 10 },
    borderBottomLeftRadius: { default: 0, ":last-child": 10 },
    borderBottomRightRadius: { default: 0, ":last-child": 10 }
  },
  horizontalBorder: { borderLeftWidth: { default: 0, ":first-child": 1 } },
  verticalBorder: { borderTopWidth: { default: 0, ":first-child": 1 } }
})

export function ToggleGroup({
  className,
  variant,
  size,
  spacing = 2,
  orientation = "horizontal",
  children,
  style: callerStyle,
  ...props
}: Group.Props & Option) {
  const compiled = stylex.props(style.root, size === "sm" && style.small, orientation === "vertical" && style.vertical)
  const context = useMemo(() => ({ variant, size, spacing, orientation }), [variant, size, spacing, orientation])
  return (
    <Group
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-spacing={spacing}
      data-orientation={orientation}
      orientation={orientation}
      {...props}
      style={(state) => ({
        gap: spacing * 4,
        ...(typeof callerStyle === "function" ? callerStyle(state) : callerStyle)
      })}
      className={(state) =>
        [compiled.className, typeof className === "function" ? className(state) : className].filter(Boolean).join(" ")
      }>
      <Context value={context}>{children}</Context>
    </Group>
  )
}

export function ToggleGroupItem({
  className,
  variant = "default",
  size = "default",
  ...props
}: Primitive.Props & Pick<Option, "size" | "variant">) {
  const context = useContext(Context)
  const selectedVariant = context.variant || variant
  const selectedSize = context.size || size
  const vertical = context.orientation === "vertical"
  return (
    <Primitive
      data-slot="toggle-group-item"
      data-variant={selectedVariant}
      data-size={selectedSize}
      data-spacing={context.spacing}
      {...props}
      className={(state) =>
        [
          stylex.props(
            toggleStyle.root,
            selectedVariant === "outline" && toggleStyle.outline,
            selectedSize === "default" ? toggleStyle.defaultSize : selectedSize && toggleStyle[selectedSize],
            style.item,
            context.spacing === 0 && style.joined,
            context.spacing === 0 && (vertical ? style.verticalEdge : style.horizontalEdge),
            context.spacing === 0 &&
              selectedVariant === "outline" &&
              (vertical ? style.verticalBorder : style.horizontalBorder)
          ).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
