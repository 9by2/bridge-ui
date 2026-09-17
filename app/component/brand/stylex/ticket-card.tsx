import * as stylex from "@stylexjs/stylex"
import { useState } from "react"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const side = { front: "front", back: "back" } as const
export type TicketCardSide = (typeof side)[keyof typeof side]
const style = stylex.create({
  root: { perspective: "1000px", color: token.cardForeground },
  card: {
    display: "grid",
    gridTemplateAreas: "stack",
    minHeight: 300,
    borderRadius: token.shapeSurface,
    transformStyle: "preserve-3d",
    transitionProperty: "transform",
    transitionDuration: "400ms",
    transitionTimingFunction: "ease",
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0ms" }
  },
  cardBack: { transform: "rotateY(180deg)" },
  front: {
    gridArea: "stack",
    padding: 24,
    borderRadius: token.shapeSurface,
    backgroundColor: token.card,
    boxShadow: `0 0 0 1px ${token.border}`
  },
  back: {
    gridArea: "stack",
    padding: 24,
    borderRadius: token.shapeSurface,
    backgroundColor: token.primary,
    color: token.primaryForeground,
    transform: "rotateY(180deg)",
    backfaceVisibility: "hidden"
  },
  frontHidden: { transform: "rotateY(180deg)", backfaceVisibility: "hidden" },
  backVisible: { transform: "rotateY(0deg)" },
  toggle: {
    marginTop: 12,
    border: "none",
    backgroundColor: "transparent",
    color: token.mutedForeground,
    textDecorationLine: "underline"
  }
})
export type TicketCardProps = ComponentProps<"article"> & {
  backLabel: string
  defaultSide?: TicketCardSide
  frontLabel: string
  onSideChange?: (side: TicketCardSide) => void
  side?: TicketCardSide
}
export function TicketCard({
  backLabel,
  children,
  className,
  frontLabel,
  defaultSide = "front",
  onSideChange,
  side: controlledSide,
  ...prop
}: TicketCardProps) {
  const [uncontrolledSide, setUncontrolledSide] = useState(defaultSide)
  const value = controlledSide ?? uncontrolledSide
  const next = value === "front" ? "back" : "front"
  const changeSide = () => {
    if (controlledSide === undefined) setUncontrolledSide(next)
    onSideChange?.(next)
  }
  return (
    <article
      data-slot="ticket-card"
      data-side={value}
      {...prop}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}>
      <div
        data-slot="ticket-card-surface"
        className={stylex.props(style.card, value === "back" && style.cardBack).className}>
        {children}
      </div>
      <button
        type="button"
        data-slot="ticket-card-toggle"
        aria-label={next === "back" ? backLabel : frontLabel}
        onClick={changeSide}
        className={stylex.props(style.toggle).className}>
        {next === "back" ? backLabel : frontLabel}
      </button>
    </article>
  )
}
export function TicketCardFront({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="ticket-card-front"
      {...prop}
      className={[stylex.props(style.front).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function TicketCardBack({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="ticket-card-back"
      {...prop}
      className={[stylex.props(style.back).className, className].filter(Boolean).join(" ")}
    />
  )
}
