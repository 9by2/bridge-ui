import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"
import * as stylex from "@stylexjs/stylex"
import { MoreHorizontalIcon } from "lucide-react"
import { useId, useState, type CSSProperties } from "react"

import { Input } from "./input"
import { Label } from "./label"
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "./popover"
import { themeToken, token } from "./token.stylex"

type ValueOf<T> = T[keyof T]

export const colorPickerSize = { sm: "sm", md: "md", lg: "lg" } as const
export type ColorPickerSize = ValueOf<typeof colorPickerSize>

export const colorPickerLayout = { grid: "grid", row: "row" } as const
export type ColorPickerLayout = ValueOf<typeof colorPickerLayout>

export const colorPickerGradientShape = { linear: "linear", radial: "radial" } as const
export type ColorPickerGradientShape = ValueOf<typeof colorPickerGradientShape>

export const ColorPickerConfig = {
  DEFAULT_ANGLE: 135,
  DEFAULT_COLUMN: 6,
  DEFAULT_CUSTOM_COLOR: "#000000",
  HEX_PATTERN: /^#?([0-9a-f]{6})$/i
} as const

export type ColorPickerFillOption = { type: "fill"; value: string; label: string; color: string }
export type ColorPickerGradientOption = {
  type: "gradient"
  value: string
  label: string
  stop: readonly string[]
  /** Defaults to `linear`. */
  shape?: ColorPickerGradientShape
  /** Linear angle in degrees. Defaults to 135. */
  angle?: number
}
export type ColorPickerOption = ColorPickerFillOption | ColorPickerGradientOption

function gradient(value: string, label: string, from: string, to: string): ColorPickerGradientOption {
  return { type: "gradient", value, label, stop: [from, to] }
}
function fill(value: string, label: string, color: string): ColorPickerFillOption {
  return { type: "fill", value, label, color }
}

export const colorPickerPreset = {
  gradient: [
    fill("white", "White", "#ffffff"),
    gradient("slate", "Slate", "#6b7785", "#4a5568"),
    gradient("electric", "Electric blue", "#2a1ee8", "#4a7cf0"),
    gradient("navy", "Navy", "#3a4aa0", "#2c3e7a"),
    gradient("violet", "Violet", "#3b0fe8", "#8b2be8"),
    gradient("sky", "Sky", "#4a7fe6", "#6fb6e0"),
    gradient("steel", "Steel", "#5a70a0", "#3f5575"),
    gradient("lagoon", "Lagoon", "#3b6de8", "#86e0d8"),
    gradient("aqua", "Aqua", "#6cc3d8", "#92e6e8"),
    gradient("harbor", "Harbor", "#5f8fa0", "#6d9aa0"),
    gradient("ocean", "Ocean", "#5a9ad0", "#86e6d0"),
    gradient("meadow", "Meadow", "#6aaa9a", "#6cc850"),
    gradient("sage", "Sage", "#6aaa9a", "#5a8a78"),
    gradient("lime", "Lime", "#7cd86a", "#6ab4a8"),
    gradient("purple", "Purple", "#a82ee8", "#6a28d8"),
    gradient("plum", "Plum", "#a060b0", "#6a4a98"),
    gradient("orchid", "Orchid", "#c050d8", "#80b8d8"),
    gradient("crimson", "Crimson", "#d03c50", "#c03a70"),
    gradient("wine", "Wine", "#9a3a58", "#7a2e50"),
    gradient("berry", "Berry", "#c02a58", "#4a1ad0"),
    gradient("tangerine", "Tangerine", "#d05030", "#e8a050"),
    gradient("bronze", "Bronze", "#a86a4a", "#a88a40"),
    gradient("sunset", "Sunset", "#d85a28", "#e8b850")
  ],
  fill: [
    fill("white", "White", "#ffffff"),
    fill("gray", "Gray", "#6b7280"),
    fill("black", "Black", "#111827"),
    fill("red", "Red", "#ef4444"),
    fill("orange", "Orange", "#f97316"),
    fill("amber", "Amber", "#f59e0b"),
    fill("green", "Green", "#22c55e"),
    fill("teal", "Teal", "#14b8a6"),
    fill("blue", "Blue", "#3b82f6"),
    fill("indigo", "Indigo", "#6366f1"),
    fill("purple", "Purple", "#a855f7")
  ]
} as const satisfies Record<string, readonly ColorPickerOption[]>

/** Convert an option into a CSS `background` value. */
export function colorPickerBackground(option: ColorPickerOption) {
  if (option.type === "fill") return option.color
  const stop = option.stop.join(", ")
  if (option.shape === colorPickerGradientShape.radial) return `radial-gradient(circle, ${stop})`
  return `linear-gradient(${option.angle ?? ColorPickerConfig.DEFAULT_ANGLE}deg, ${stop})`
}

function normalizeHex(input: string | undefined) {
  const match = ColorPickerConfig.HEX_PATTERN.exec(input?.trim() ?? "")
  return match?.[1] ? `#${match[1].toLowerCase()}` : null
}

function customOption(value: string): ColorPickerFillOption {
  return { type: "fill", value, label: value, color: value }
}

const ring = `var(--bridge-color-picker-ring, ${themeToken.primary})`
const depth = "0 6px 14px -6px rgb(0 0 0 / 28%)"

const style = stylex.create({
  root: { display: "grid", width: "fit-content", maxWidth: "100%", boxSizing: "border-box", padding: 6 },
  row: {
    display: "flex",
    flexWrap: "nowrap",
    width: "auto",
    overflowX: "auto",
    scrollbarWidth: "thin",
    overscrollBehaviorX: "contain"
  },
  gapSm: { gap: 8 },
  gapMd: { gap: 12 },
  gapLg: { gap: 16 },
  swatch: {
    position: "relative",
    boxSizing: "border-box",
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    padding: 0,
    margin: 0,
    borderWidth: 0,
    borderRadius: "9999px",
    color: themeToken.mutedForeground,
    backgroundColor: themeToken.muted,
    outline: "none",
    cursor: { default: "pointer", ":disabled": "not-allowed", ":is([data-disabled])": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5, ":is([data-disabled])": 0.5 },
    boxShadow: {
      default: `inset 0 0 0 1px rgb(0 0 0 / 8%), ${depth}`,
      ":focus-visible": `inset 0 0 0 1px rgb(0 0 0 / 8%), 0 0 0 2px ${themeToken.background}, 0 0 0 4px ${themeToken.ring}`
    },
    transitionProperty: "transform, box-shadow",
    transitionDuration: { default: "120ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    transform: { default: "scale(1)", ":hover:not(:disabled):not([data-disabled])": "scale(1.05)" }
  },
  sm: { width: 24, height: 24 },
  md: { width: 40, height: 40 },
  lg: { width: 56, height: 56 },
  checked: {
    boxShadow: {
      default: `inset 0 0 0 1px rgb(0 0 0 / 8%), 0 0 0 2px ${themeToken.background}, 0 0 0 4px ${ring}, ${depth}`,
      ":focus-visible": `inset 0 0 0 1px rgb(0 0 0 / 8%), 0 0 0 2px ${themeToken.background}, 0 0 0 4px ${ring}, 0 0 0 7px ${themeToken.ring}`
    }
  },
  more: { boxShadow: { default: `inset 0 0 0 1px ${themeToken.border}` } },
  moreIconSm: { width: 14, height: 14 },
  moreIconMd: { width: 20, height: 20 },
  moreIconLg: { width: 24, height: 24 },
  panel: { width: 240 },
  field: { display: "grid", gap: 6 },
  wheel: {
    boxSizing: "border-box",
    width: "100%",
    height: 40,
    padding: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: themeToken.input,
    borderRadius: "var(--bridge-control-radius, 0.625em)",
    backgroundColor: "transparent",
    cursor: "pointer"
  },
  title: { fontFamily: token.fontHeading, fontWeight: 500, margin: 0 }
})

const sizeStyle = { sm: style.sm, md: style.md, lg: style.lg } as const
const gapStyle = { sm: style.gapSm, md: style.gapMd, lg: style.gapLg } as const
const moreIconStyle = { sm: style.moreIconSm, md: style.moreIconMd, lg: style.moreIconLg } as const

export type ColorPickerProps = {
  /** Swatch list. Defaults to `colorPickerPreset.gradient`. */
  option?: readonly ColorPickerOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, option: ColorPickerOption) => void
  size?: ColorPickerSize
  layout?: ColorPickerLayout
  /** Grid column count. Ignored for `row` layout. */
  column?: number
  /** Show the trailing custom-color control. */
  custom?: boolean
  customLabel?: string
  colorLabel?: string
  hexLabel?: string
  disabled?: boolean
  name?: string
  id?: string
  className?: string
  style?: CSSProperties
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
}

type CustomPanelProps = {
  size: ColorPickerSize
  current: string | undefined
  disabled: boolean
  customLabel: string
  colorLabel: string
  hexLabel: string
  onCommit: (value: string) => void
}

function CustomPanel({ size, current, disabled, customLabel, colorLabel, hexLabel, onCommit }: CustomPanelProps) {
  const id = useId()
  const [draft, setDraft] = useState("")
  const committed = normalizeHex(draft) ?? normalizeHex(current) ?? ColorPickerConfig.DEFAULT_CUSTOM_COLOR
  const invalid = draft !== "" && normalizeHex(draft) === null

  return (
    <Popover onOpenChange={(open) => open && setDraft(normalizeHex(current) ?? "")}>
      <PopoverTrigger
        type="button"
        aria-label={customLabel}
        title={customLabel}
        disabled={disabled}
        data-slot="color-picker-custom"
        {...stylex.props(style.swatch, sizeStyle[size], style.more)}>
        <MoreHorizontalIcon aria-hidden="true" {...stylex.props(moreIconStyle[size])} />
      </PopoverTrigger>
      <PopoverContent align="end" {...stylex.props(style.panel)}>
        <PopoverTitle {...stylex.props(style.title)}>{customLabel}</PopoverTitle>
        <div {...stylex.props(style.field)}>
          <Label htmlFor={`${id}-color`}>{colorLabel}</Label>
          <input
            id={`${id}-color`}
            type="color"
            value={committed}
            onChange={(event) => {
              setDraft(event.target.value)
              onCommit(event.target.value.toLowerCase())
            }}
            {...stylex.props(style.wheel)}
          />
        </div>
        <div {...stylex.props(style.field)}>
          <Label htmlFor={`${id}-hex`}>{hexLabel}</Label>
          <Input
            id={`${id}-hex`}
            value={draft}
            placeholder="#000000"
            spellCheck={false}
            autoComplete="off"
            aria-invalid={invalid}
            onChange={(event) => {
              setDraft(event.target.value)
              const hex = normalizeHex(event.target.value)
              if (hex) onCommit(hex)
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function ColorPicker({
  option = colorPickerPreset.gradient,
  value,
  defaultValue,
  onValueChange,
  size = colorPickerSize.md,
  layout = colorPickerLayout.grid,
  column = ColorPickerConfig.DEFAULT_COLUMN,
  custom = true,
  customLabel = "Custom color",
  colorLabel = "Color",
  hexLabel = "Hex",
  disabled = false,
  name,
  className,
  style: callerStyle,
  ...aria
}: ColorPickerProps) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const extra = current !== undefined && !option.some((item) => item.value === current) ? customOption(current) : null
  const list = extra ? [...option, extra] : option
  const byValue = new Map<string | null, ColorPickerOption>(list.map((item) => [item.value, item]))

  function select(next: string, chosen: ColorPickerOption) {
    if (value === undefined) setInternal(next)
    onValueChange?.(next, chosen)
  }

  const rootClass = [
    stylex.props(style.root, layout === colorPickerLayout.row && style.row, gapStyle[size]).className,
    className
  ]
    .filter(Boolean)
    .join(" ")
  const rootStyle: CSSProperties = {
    ...(layout === colorPickerLayout.grid && { gridTemplateColumns: `repeat(${column}, max-content)` }),
    ...callerStyle
  }

  return (
    <RadioGroup
      {...aria}
      name={name}
      disabled={disabled}
      value={current ?? null}
      onValueChange={(next: string | null) => {
        // RadioGroup only emits rendered swatch values, all present in `byValue`.
        const chosen = byValue.get(next)
        if (chosen === undefined) return
        select(chosen.value, chosen)
      }}
      data-slot="color-picker"
      data-size={size}
      data-layout={layout}
      className={rootClass}
      style={rootStyle}>
      {list.map((item) => (
        <Radio.Root
          key={item.value}
          value={item.value}
          aria-label={item.label}
          title={item.label}
          data-slot="color-picker-swatch"
          className={(state) => stylex.props(style.swatch, sizeStyle[size], state.checked && style.checked).className}
          style={{ background: colorPickerBackground(item) }}
        />
      ))}
      {custom && (
        <CustomPanel
          size={size}
          current={current}
          disabled={disabled}
          customLabel={customLabel}
          colorLabel={colorLabel}
          hexLabel={hexLabel}
          onCommit={(hex) => select(hex, customOption(hex))}
        />
      )}
    </RadioGroup>
  )
}
