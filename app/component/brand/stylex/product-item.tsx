import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 16,
    alignItems: "center",
    padding: 16,
    borderRadius: token.shapeSurface,
    backgroundColor: token.card,
    color: token.cardForeground,
    boxShadow: `0 0 0 1px ${token.border}`
  },
  media: { display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  content: { minWidth: 0 },
  action: { display: "flex", alignItems: "center" },
  stepper: { display: "inline-flex", alignItems: "center", gap: 8 },
  button: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    borderRadius: token.shapePill,
    backgroundColor: token.background,
    color: token.foreground
  },
  output: { minWidth: 24, textAlign: "center", fontFamily: token.fontNumber, fontVariantNumeric: "tabular-nums" }
})
export function ProductItem({ className, ...prop }: ComponentProps<"article">) {
  return (
    <article
      data-slot="product-item"
      {...prop}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
export type QuantityStepperProps = Omit<ComponentProps<"div">, "onChange"> & {
  decrementLabel: string
  incrementLabel: string
  max?: number
  min?: number
  onValueChange: (value: number) => void
  value: number
}
export function QuantityStepper({
  className,
  decrementLabel,
  incrementLabel,
  max,
  min = 0,
  onValueChange,
  value,
  ...prop
}: QuantityStepperProps) {
  return (
    <div
      data-slot="quantity-stepper"
      {...prop}
      className={[stylex.props(style.stepper).className, className].filter(Boolean).join(" ")}>
      <button
        type="button"
        aria-label={decrementLabel}
        disabled={value <= min}
        onClick={() => onValueChange(Math.max(min, value - 1))}
        className={stylex.props(style.button).className}>
        −
      </button>
      <output data-slot="quantity-stepper-output" className={stylex.props(style.output).className}>
        {value}
      </output>
      <button
        type="button"
        aria-label={incrementLabel}
        disabled={max !== undefined && value >= max}
        onClick={() => onValueChange(max === undefined ? value + 1 : Math.min(max, value + 1))}
        className={stylex.props(style.button).className}>
        +
      </button>
    </div>
  )
}

export function ProductItemMedia({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="product-item-media"
      {...prop}
      className={[stylex.props(style.media).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function ProductItemContent({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="product-item-content"
      {...prop}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function ProductItemAction({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="product-item-action"
      {...prop}
      className={[stylex.props(style.action).className, className].filter(Boolean).join(" ")}
    />
  )
}
