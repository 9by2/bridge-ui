import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as stylex from "@stylexjs/stylex"
import { CheckIcon, XIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const wizardStepOrientation = { horizontal: "horizontal", vertical: "vertical" } as const
const wizardStepVariant = { number: "number", dot: "dot", line: "line" } as const
const wizardStepTone = { hard: "hard", soft: "soft" } as const
const wizardStepState = {
  upcoming: "upcoming",
  current: "current",
  completed: "completed",
  error: "error"
} as const

type ValueOf<T> = T[keyof T]

export type WizardStepOrientation = ValueOf<typeof wizardStepOrientation>
export type WizardStepVariant = ValueOf<typeof wizardStepVariant>
export type WizardStepTone = ValueOf<typeof wizardStepTone>
export type WizardStepState = ValueOf<typeof wizardStepState>

const style = stylex.create({
  root: { display: "flex", width: "100%", minWidth: 0 },
  horizontal: {
    flexDirection: "row",
    alignItems: "flex-start",
    overflowX: "auto",
    overscrollBehaviorInline: "contain"
  },
  vertical: { flexDirection: "column", alignItems: "stretch" },
  item: {
    position: "relative",
    display: "flex",
    flexShrink: 0,
    minWidth: 0,
    alignItems: "flex-start",
    gap: 8,
    borderWidth: 0,
    borderStyle: "none",
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
    fontFamily: "inherit",
    textAlign: "left",
    color: "inherit",
    cursor: { default: "default", ":is(button, a)": "pointer" },
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` }
  },
  connector: { boxSizing: "border-box", flexShrink: 0, borderRadius: 2 },
  connectorHorizontal: { flex: "1 1 auto", minWidth: 24, height: 2, marginInline: 12, marginTop: 15 },
  connectorVertical: { width: 2, height: 24, marginInlineStart: 15 },
  connectorUpcoming: { backgroundColor: token.border },
  connectorCompleted: { backgroundColor: token.primary },
  connectorCurrentHorizontal: { backgroundImage: `linear-gradient(90deg, ${token.primary}, ${token.border})` },
  connectorCurrentVertical: { backgroundImage: `linear-gradient(${token.primary}, ${token.border})` },
  connectorError: { backgroundColor: token.destructive },
  indicator: {
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
    display: "flex",
    width: 32,
    height: 32,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    borderWidth: 1.5,
    borderStyle: "solid",
    borderColor: token.border,
    backgroundColor: token.background,
    color: token.mutedForeground,
    fontSize: 13,
    fontWeight: 600
  },
  indicatorDot: { width: 10, height: 10, borderWidth: 0, backgroundColor: token.border },
  indicatorCompleted: { borderColor: token.primary, backgroundColor: token.primary, color: token.primaryForeground },
  indicatorCurrent: { borderColor: token.primary, backgroundColor: token.primary, color: token.primaryForeground },
  indicatorCurrentSoft: {
    borderColor: token.primary,
    backgroundColor: `color-mix(in oklch, ${token.primary}, transparent 85%)`,
    color: token.primary
  },
  indicatorCurrentDot: { backgroundColor: token.primary },
  indicatorError: {
    borderColor: token.destructive,
    backgroundColor: token.destructive,
    color: token.destructiveForeground
  },
  indicatorIcon: { width: 14, height: 14 },
  label: { display: "flex", minWidth: 0, flexDirection: "column", gap: 2 },
  title: {
    minWidth: 0,
    color: token.foreground,
    fontFamily: token.fontHeading,
    fontWeight: 600,
    lineHeight: 1.3,
    overflowWrap: "anywhere"
  },
  description: { color: token.mutedForeground, fontSize: 13, lineHeight: 1.5, overflowWrap: "anywhere" },
  counter: { color: token.mutedForeground, fontSize: 12, lineHeight: 1.5 }
})

export type WizardStepProps = ComponentProps<"div"> & {
  orientation?: WizardStepOrientation
  variant?: WizardStepVariant
  tone?: WizardStepTone
}

export function WizardStep({
  className,
  orientation = "horizontal",
  variant = "number",
  tone = "hard",
  ...prop
}: WizardStepProps) {
  return (
    <div
      data-slot="wizard-step"
      data-orientation={orientation}
      data-variant={variant}
      data-tone={tone}
      {...prop}
      className={[
        stylex.props(stylex.defaultMarker(), style.root, orientation === "vertical" ? style.vertical : style.horizontal)
          .className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}

export function WizardStepItem({
  className,
  state = "upcoming",
  render,
  ...props
}: useRender.ComponentProps<"div"> & { state?: WizardStepState }) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: [stylex.props(stylex.defaultMarker(), style.item).className, className].filter(Boolean).join(" ") },
      props
    ),
    render,
    state: { slot: "wizard-step-item", state }
  })
}

export type WizardStepIndicatorProps = ComponentProps<"div"> & {
  state?: WizardStepState
  tone?: WizardStepTone
  dot?: boolean
}

export function WizardStepIndicator({
  className,
  state = "upcoming",
  tone = "hard",
  dot = false,
  children,
  ...prop
}: WizardStepIndicatorProps) {
  const icon =
    state === "completed" ? (
      <CheckIcon aria-hidden="true" {...stylex.props(style.indicatorIcon)} />
    ) : state === "error" ? (
      <XIcon aria-hidden="true" {...stylex.props(style.indicatorIcon)} />
    ) : (
      children
    )
  return (
    <div
      data-slot="wizard-step-indicator"
      data-state={state}
      data-tone={tone}
      {...prop}
      className={[
        stylex.props(
          style.indicator,
          dot && style.indicatorDot,
          state === "completed" && style.indicatorCompleted,
          state === "current" && !dot && (tone === "soft" ? style.indicatorCurrentSoft : style.indicatorCurrent),
          state === "current" && dot && style.indicatorCurrentDot,
          state === "error" && style.indicatorError
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}>
      {dot ? null : icon}
    </div>
  )
}

export type WizardStepConnectorProps = ComponentProps<"div"> & {
  orientation?: WizardStepOrientation
  state?: WizardStepState
}

export function WizardStepConnector({
  className,
  orientation = "horizontal",
  state = "upcoming",
  ...prop
}: WizardStepConnectorProps) {
  return (
    <div
      data-slot="wizard-step-connector"
      data-orientation={orientation}
      data-state={state}
      aria-hidden="true"
      {...prop}
      className={[
        stylex.props(
          style.connector,
          orientation === "vertical" ? style.connectorVertical : style.connectorHorizontal,
          state === "upcoming" && style.connectorUpcoming,
          state === "completed" && style.connectorCompleted,
          state === "current" &&
            (orientation === "vertical" ? style.connectorCurrentVertical : style.connectorCurrentHorizontal),
          state === "error" && style.connectorError
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}

export function WizardStepLabel({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="wizard-step-label"
      {...prop}
      className={[stylex.props(style.label).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function WizardStepTitle({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="wizard-step-title"
      {...prop}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function WizardStepDescription({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="wizard-step-description"
      {...prop}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function WizardStepCounter({ className, ...prop }: ComponentProps<"span">) {
  return (
    <span
      data-slot="wizard-step-counter"
      {...prop}
      className={[stylex.props(style.counter).className, className].filter(Boolean).join(" ")}
    />
  )
}
