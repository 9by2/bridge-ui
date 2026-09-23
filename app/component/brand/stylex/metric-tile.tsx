import * as stylex from "@stylexjs/stylex"
import type { ComponentProps, ReactNode } from "react"

import { geometryToken, themeToken, token } from "./token.stylex"

export const metricTileVariant = {
  standard: "standard",
  featured: "featured",
  compact: "compact"
} as const

type ValueOf<T> = T[keyof T]
export type MetricTileVariant = ValueOf<typeof metricTileVariant>

export type MetricTileProps = Omit<ComponentProps<"article">, "children"> & {
  variants: MetricTileVariant
  label: ReactNode
  value: ReactNode
  description?: ReactNode
  icon?: ReactNode
} & ({ loading?: false; loadingLabel?: never } | { loading: true; loadingLabel: ReactNode })

const style = stylex.create({
  root: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 24,
    padding: 16,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: themeToken.border,
    borderRadius: geometryToken.surfaceRadius,
    backgroundColor: themeToken.surface,
    color: themeToken.surfaceForeground
  },
  featured: { padding: 24, gap: 48 },
  compact: { padding: 12, gap: 16 },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  label: {
    fontFamily: token.fontHeading,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: themeToken.mutedForeground
  },
  icon: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    width: 36,
    height: 36,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: themeToken.border,
    color: themeToken.mutedForeground
  },
  value: {
    fontFamily: token.fontNumber,
    fontSize: 36,
    fontWeight: 600,
    lineHeight: 1.15,
    fontVariantNumeric: "tabular-nums",
    overflowWrap: "anywhere"
  },
  featuredValue: { fontSize: 52 },
  compactValue: { fontSize: 28 },
  description: { marginTop: 8, fontSize: 14, color: themeToken.mutedForeground }
})

export function MetricTile({
  variants,
  label,
  value,
  description,
  icon,
  loading = false,
  loadingLabel,
  className,
  ...prop
}: MetricTileProps) {
  return (
    <article
      {...prop}
      data-slot="metric-tile"
      data-variants={variants}
      aria-busy={loading || undefined}
      className={[
        stylex.props(
          style.root,
          variants === metricTileVariant.featured && style.featured,
          variants === metricTileVariant.compact && style.compact
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}>
      <div {...stylex.props(style.header)}>
        <span {...stylex.props(style.label)}>{label}</span>
        {icon && (
          <span {...stylex.props(style.icon)} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      {loading ? (
        <div role="status">{loadingLabel}</div>
      ) : (
        <div>
          <div
            {...stylex.props(
              style.value,
              variants === metricTileVariant.featured && style.featuredValue,
              variants === metricTileVariant.compact && style.compactValue
            )}>
            {value}
          </div>
          {description && <div {...stylex.props(style.description)}>{description}</div>}
        </div>
      )}
    </article>
  )
}
