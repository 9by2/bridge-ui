import * as stylex from "@stylexjs/stylex"
import {
  createContext,
  useContext,
  useId,
  useMemo,
  type ComponentProps,
  type ComponentType,
  type ReactNode
} from "react"
import * as Recharts from "recharts"
import type { TooltipValueType } from "recharts"

import { effectToken, token } from "./token.stylex"

export type ChartConfig = Record<
  string,
  { label?: ReactNode; icon?: ComponentType } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  )
>
const Context = createContext<{ config: ChartConfig } | null>(null)
const style = stylex.create({
  root: {
    display: "flex",
    minHeight: 200,
    minWidth: 0,
    aspectRatio: "16 / 9",
    justifyContent: "center",
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px"
  },
  tooltip: {
    display: "grid",
    minWidth: 128,
    alignItems: "start",
    gap: 6,
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: `color-mix(in oklch, ${token.border}, transparent 50%)`,
    backgroundColor: token.background,
    paddingInline: 10,
    paddingBlock: 6,
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px",
    boxShadow: effectToken.shadowXl
  },
  label: { fontWeight: 500 },
  grid: { display: "grid", gap: 6 },
  row: { display: "flex", width: "100%", flexWrap: "wrap", alignItems: "stretch", gap: 8 },
  center: { alignItems: "center" },
  indicator: { flexShrink: 0, borderRadius: "var(--bridge-radius-2, 0.125em)", borderStyle: "solid", borderWidth: 0 },
  dot: { height: 10, width: 10 },
  line: { width: 4 },
  dashed: { width: 0, borderWidth: 1.5, borderStyle: "dashed" },
  nestedDash: { marginBlock: 2 },
  copy: { display: "flex", flex: 1, justifyContent: "space-between", lineHeight: 1, alignItems: "center" },
  nested: { alignItems: "end" },
  muted: { color: token.mutedForeground },
  value: { fontFamily: "monospace", fontWeight: 500, color: token.foreground, fontVariantNumeric: "tabular-nums" },
  legend: { display: "flex", alignItems: "center", justifyContent: "center", gap: 16 },
  top: { paddingBottom: 12 },
  bottom: { paddingTop: 12 },
  legendItem: { display: "flex", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, flexShrink: 0, borderRadius: "var(--bridge-radius-2, 0.125em)" }
})
function useChart() {
  const context = useContext(Context)
  if (!context) throw new Error("useChart must be used within a <ChartContainer />")
  return context
}
export function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = { width: 320, height: 200 },
  ...props
}: ComponentProps<"div"> & {
  config: ChartConfig
  children: ComponentProps<typeof Recharts.ResponsiveContainer>["children"]
  initialDimension?: { width: number; height: number }
}) {
  const uniqueId = useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`
  const context = useMemo(() => ({ config }), [config])
  return (
    <Context value={context}>
      <div
        data-slot="chart"
        data-chart={chartId}
        {...props}
        className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}>
        <ChartStyle id={chartId} config={config} />
        <Recharts.ResponsiveContainer initialDimension={initialDimension}>{children}</Recharts.ResponsiveContainer>
      </div>
    </Context>
  )
}
export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colors = Object.entries(config).filter(([, value]) => value.theme ?? value.color)
  if (!colors.length) return null
  // Series color is caller data, not statically extractable presentation.
  const modes: ("light" | "dark")[] = ["light", "dark"]
  const selector = `[data-chart=${JSON.stringify(id).replaceAll("<", "\\3c ")}]`
  const css = modes
    .map(
      (mode) =>
        `${mode === "dark" ? `:is(.dark, [data-pilot-theme="dark"]) ${selector}` : selector} {${colors
          .map(([key, value]) => {
            const color = value.theme?.[mode] ?? value.color
            if (!/^[\w-]+$/.test(key) || (color && /[;{}<>\n\r]/.test(color))) throw new Error("Invalid chart color")
            return color ? `--color-${key}: ${color};` : ""
          })
          .join("\n")}}`
    )
    .join("\n")
  return <style>{css}</style>
}
export const ChartTooltip = Recharts.Tooltip
export const ChartLegend = Recharts.Legend
function getPayloadConfig(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return undefined
  const entry = Object.entries(payload)
  const direct = entry.find(([name]) => name === key)?.[1]
  const nested = entry.find(([name]) => name === "payload")?.[1]
  const nestedValue =
    typeof nested === "object" && nested !== null
      ? Object.entries(nested).find(([name]) => name === key)?.[1]
      : undefined
  const label = typeof direct === "string" ? direct : typeof nestedValue === "string" ? nestedValue : key
  return config[label] ?? config[key]
}
type TooltipProps = ComponentProps<typeof Recharts.Tooltip> &
  ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & Omit<Recharts.DefaultTooltipContentProps<TooltipValueType, number | string>, "accessibilityLayer">
export function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey
}: TooltipProps) {
  const { config } = useChart()
  if (!active || !payload?.length) return null
  const first = payload[0]
  const itemConfig = getPayloadConfig(config, first, `${labelKey ?? first?.dataKey ?? first?.name ?? "value"}`)
  const value = !labelKey && typeof label === "string" ? (config[label]?.label ?? label) : itemConfig?.label
  const tooltipLabel = hideLabel ? null : labelFormatter ? (
    <div className={[stylex.props(style.label).className, labelClassName].filter(Boolean).join(" ")}>
      {labelFormatter(value, payload)}
    </div>
  ) : value ? (
    <div className={[stylex.props(style.label).className, labelClassName].filter(Boolean).join(" ")}>{value}</div>
  ) : null
  const nestLabel = payload.length === 1 && indicator !== "dot"
  return (
    <div className={[stylex.props(style.tooltip).className, className].filter(Boolean).join(" ")}>
      {!nestLabel && tooltipLabel}
      <div {...stylex.props(style.grid)}>
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => {
            const entry = getPayloadConfig(config, item, `${nameKey ?? item.name ?? item.dataKey ?? "value"}`)
            const indicatorColor = color ?? item.payload?.fill ?? item.color
            return (
              <div key={item.graphicalItemId} {...stylex.props(style.row, indicator === "dot" && style.center)}>
                {formatter && item.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {entry?.icon ? (
                      <entry.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          {...stylex.props(
                            style.indicator,
                            style[indicator],
                            nestLabel && indicator === "dashed" && style.nestedDash
                          )}
                          style={{
                            backgroundColor: indicator === "dashed" ? "transparent" : indicatorColor,
                            borderColor: indicatorColor
                          }}
                        />
                      )
                    )}
                    <div {...stylex.props(style.copy, nestLabel && style.nested)}>
                      <div {...stylex.props(style.grid)}>
                        {nestLabel && tooltipLabel}
                        <span {...stylex.props(style.muted)}>{entry?.label ?? item.name}</span>
                      </div>
                      {item.value != null && (
                        <span {...stylex.props(style.value)}>
                          {typeof item.value === "number" ? item.value.toLocaleString() : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
export function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey
}: ComponentProps<"div"> & { hideIcon?: boolean; nameKey?: string } & Recharts.DefaultLegendContentProps) {
  const { config } = useChart()
  if (!payload?.length) return null
  return (
    <div
      className={[stylex.props(style.legend, verticalAlign === "top" ? style.top : style.bottom).className, className]
        .filter(Boolean)
        .join(" ")}>
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const entry = getPayloadConfig(config, item, `${nameKey ?? item.dataKey ?? "value"}`)
          const legendKey =
            (typeof item.dataKey === "string" || typeof item.dataKey === "number" ? item.dataKey : undefined) ??
            item.value ??
            "legend"
          return (
            <div key={legendKey} {...stylex.props(style.legendItem)}>
              {entry?.icon && !hideIcon ? (
                <entry.icon />
              ) : (
                <div {...stylex.props(style.legendDot)} style={{ backgroundColor: item.color }} />
              )}
              {entry?.label}
            </div>
          )
        })}
    </div>
  )
}
