import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const timelineStepOrientation = { vertical: "vertical", horizontal: "horizontal" } as const
const timelineStepPosition = { left: "left", right: "right", alternate: "alternate" } as const
const timelineStepState = {
  default: "default",
  completed: "completed",
  current: "current",
  upcoming: "upcoming"
} as const
const timelineStepTreatment = { solid: "solid", dashed: "dashed", dotted: "dotted" } as const
const timelineStepSize = { small: "small", default: "default", large: "large" } as const
const timelineStepTone = {
  default: "default",
  primary: "primary",
  secondary: "secondary",
  destructive: "destructive",
  outline: "outline"
} as const

type ValueOf<T> = T[keyof T]

export type TimelineStepOrientation = ValueOf<typeof timelineStepOrientation>
export type TimelineStepPosition = ValueOf<typeof timelineStepPosition>
export type TimelineStepState = ValueOf<typeof timelineStepState>
export type TimelineStepTreatment = ValueOf<typeof timelineStepTreatment>
export type TimelineStepSize = ValueOf<typeof timelineStepSize>
export type TimelineStepTone = ValueOf<typeof timelineStepTone>

const style = stylex.create({
  root: { display: "flex", width: "100%", minWidth: 0 },
  vertical: { flexDirection: "column" },
  horizontal: { flexDirection: "row", overflowX: "auto", overscrollBehaviorInline: "contain" },
  item: { position: "relative", display: "flex", minWidth: 0, flexDirection: "column" },
  itemVertical: { paddingBottom: 32 },
  itemHorizontal: { minWidth: 160, flex: "1 0 160px", alignItems: "center" },
  upcoming: { outlineWidth: 1, outlineStyle: "dashed", outlineColor: token.border, outlineOffset: 4 },
  connector: { position: "absolute", boxSizing: "border-box" },
  connectorVertical: {
    top: "var(--timeline-step-indicator-size, 40px)",
    left: "calc(var(--timeline-step-indicator-size, 40px) / 2)",
    width: 1,
    height: "calc(100% - var(--timeline-step-indicator-size, 40px))",
    transform: "translateX(-50%)"
  },
  connectorHorizontal: {
    top: 12,
    left: "calc(50% + 12px)",
    width: "calc(100% - 24px)",
    height: 1
  },
  solid: { backgroundColor: token.border },
  dashedVertical: { borderLeftWidth: 1, borderLeftStyle: "dashed", borderLeftColor: token.border },
  dottedVertical: { borderLeftWidth: 1, borderLeftStyle: "dotted", borderLeftColor: token.border },
  dashedHorizontal: { borderTopWidth: 1, borderTopStyle: "dashed", borderTopColor: token.border },
  dottedHorizontal: { borderTopWidth: 1, borderTopStyle: "dotted", borderTopColor: token.border },
  completedConnector: { backgroundColor: token.primary, borderColor: token.primary },
  currentConnector: { backgroundImage: `linear-gradient(${token.primary}, ${token.border})` },
  upcomingConnector: { backgroundColor: token.muted, borderColor: token.muted },
  header: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
  indicator: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    borderRadius: "50%",
    backgroundColor: token.background,
    color: token.mutedForeground
  },
  indicatorSmall: { width: 24, height: 24, "--timeline-step-indicator-size": "24px" },
  indicatorDefault: { width: 40, height: 40, "--timeline-step-indicator-size": "40px" },
  indicatorLarge: { width: 48, height: 48, "--timeline-step-indicator-size": "48px" },
  primary: { borderColor: token.primary, backgroundColor: token.primary, color: token.primaryForeground },
  secondary: { borderColor: token.secondary, backgroundColor: token.secondary, color: token.secondaryForeground },
  destructive: {
    borderColor: token.destructive,
    backgroundColor: token.destructive,
    color: token.destructiveForeground
  },
  outline: { borderColor: token.border, backgroundColor: token.background, color: token.foreground },
  content: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: 4,
    paddingTop: 2,
    paddingBottom: 8,
    marginInlineStart: 52
  },
  title: {
    minWidth: 0,
    color: token.foreground,
    fontFamily: token.fontHeading,
    fontWeight: 600,
    lineHeight: 1.25,
    overflowWrap: "anywhere"
  },
  description: {
    color: token.mutedForeground,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: 1.5,
    overflowWrap: "anywhere"
  },
  time: { color: token.mutedForeground, fontSize: "var(--bridge-font-size-sm, 0.75em)", lineHeight: 1.5 }
})

export type TimelineStepProps = ComponentProps<"div"> & {
  orientation?: TimelineStepOrientation
  position?: TimelineStepPosition
}

export function TimelineStep({ className, orientation = "vertical", position = "left", ...prop }: TimelineStepProps) {
  return (
    <div
      data-slot="timeline-step"
      data-orientation={orientation}
      data-position={position}
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

export type TimelineStepItemProps = ComponentProps<"div"> & {
  orientation?: TimelineStepOrientation
  state?: TimelineStepState
}

export function TimelineStepItem({
  className,
  orientation = "vertical",
  state = "default",
  ...prop
}: TimelineStepItemProps) {
  return (
    <div
      data-slot="timeline-step-item"
      data-orientation={orientation}
      data-state={state}
      {...prop}
      className={[
        stylex.props(
          style.item,
          orientation === "vertical" ? style.itemVertical : style.itemHorizontal,
          state === "upcoming" && style.upcoming
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}

export type TimelineStepConnectorProps = ComponentProps<"div"> & {
  orientation?: TimelineStepOrientation
  treatment?: TimelineStepTreatment
  state?: TimelineStepState
}

export function TimelineStepConnector({
  className,
  orientation = "vertical",
  treatment = "solid",
  state = "default",
  ...prop
}: TimelineStepConnectorProps) {
  return (
    <div
      data-slot="timeline-step-connector"
      data-orientation={orientation}
      data-state={state}
      data-treatment={treatment}
      aria-hidden="true"
      {...prop}
      className={[
        stylex.props(
          style.connector,
          orientation === "vertical" ? style.connectorVertical : style.connectorHorizontal,
          treatment === "solid" && style.solid,
          treatment === "dashed" && (orientation === "vertical" ? style.dashedVertical : style.dashedHorizontal),
          treatment === "dotted" && (orientation === "vertical" ? style.dottedVertical : style.dottedHorizontal),
          state === "completed" && style.completedConnector,
          state === "current" && style.currentConnector,
          state === "upcoming" && style.upcomingConnector
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}

export function TimelineStepHeader({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-step-header"
      {...prop}
      className={[stylex.props(style.header).className, className].filter(Boolean).join(" ")}
    />
  )
}

export type TimelineStepIndicatorProps = ComponentProps<"div"> & {
  size?: TimelineStepSize
  tone?: TimelineStepTone
}

export function TimelineStepIndicator({
  className,
  size = "default",
  tone = "default",
  ...prop
}: TimelineStepIndicatorProps) {
  return (
    <div
      data-slot="timeline-step-indicator"
      data-size={size}
      data-tone={tone}
      {...prop}
      className={[
        stylex.props(
          style.indicator,
          size === "small" ? style.indicatorSmall : size === "large" ? style.indicatorLarge : style.indicatorDefault,
          tone === "primary" && style.primary,
          tone === "secondary" && style.secondary,
          tone === "destructive" && style.destructive,
          tone === "outline" && style.outline
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}

export function TimelineStepContent({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-step-content"
      {...prop}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function TimelineStepTitle({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-step-title"
      {...prop}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function TimelineStepDescription({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-step-description"
      {...prop}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function TimelineStepTime({ className, ...prop }: ComponentProps<"time">) {
  return (
    <time
      data-slot="timeline-step-time"
      {...prop}
      className={[stylex.props(style.time).className, className].filter(Boolean).join(" ")}
    />
  )
}
