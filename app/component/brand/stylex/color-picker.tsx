import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"
import * as stylex from "@stylexjs/stylex"
import { MoreHorizontalIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useId, useState, type CSSProperties, type ReactNode } from "react"

import { Button } from "./button"
import {
  ColorPickerConfig,
  colorPickerBackground,
  colorPickerGradientKind,
  colorPickerMode,
  colorPickerNormalizeHex,
  colorPickerParse,
  colorPickerRadialShape,
  type ColorPickerFillOption,
  type ColorPickerGradientKind,
  type ColorPickerGradientOption,
  type ColorPickerMode,
  type ColorPickerOption,
  type ColorPickerRadialShape,
  type ColorPickerStop
} from "./color-picker-value"
import { Input } from "./input"
import { Label } from "./label"
import { NativeSelect, NativeSelectOption } from "./native-select"
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "./popover"
import { Switch } from "./switch"
import { themeToken, token } from "./token.stylex"

export * from "./color-picker-value"

type ValueOf<T> = T[keyof T]

export const colorPickerSize = { sm: "sm", md: "md", lg: "lg" } as const
export type ColorPickerSize = ValueOf<typeof colorPickerSize>

export const colorPickerLayout = { grid: "grid", row: "row" } as const
export type ColorPickerLayout = ValueOf<typeof colorPickerLayout>

function fill(value: string, label: string, color: string): ColorPickerFillOption {
  return { type: "fill", value, label, color }
}
function gradient(value: string, label: string, from: string, to: string): ColorPickerGradientOption {
  return { type: "gradient", value, label, stop: [from, to] }
}

export const colorPickerPreset = {
  gradient: [
    gradient("white", "White", "#ffffff", "#ffffff"),
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
} as const satisfies { fill: readonly ColorPickerFillOption[]; gradient: readonly ColorPickerGradientOption[] }

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
  panel: { width: 288, maxWidth: "calc(100vw - 32px)" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "end" },
  inline: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  preview: {
    height: 32,
    borderRadius: "var(--bridge-control-radius, 0.625em)",
    boxShadow: `inset 0 0 0 1px ${themeToken.border}`
  },
  stopList: { display: "grid", gap: 6, margin: 0, padding: 0, listStyle: "none" },
  stop: { display: "grid", gridTemplateColumns: "40px 1fr auto", gap: 6, alignItems: "center" },
  stopColor: { height: 32 },
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

export type ColorPickerLabel = {
  custom: string
  color: string
  hex: string
  kind: string
  linear: string
  radial: string
  conic: string
  repeating: string
  angle: string
  shape: string
  circle: string
  ellipse: string
  addStop: string
  stopColor: (index: number) => string
  stopPosition: (index: number) => string
  removeStop: (index: number) => string
}

export const colorPickerDefaultLabel: ColorPickerLabel = {
  custom: "Custom color",
  color: "Color",
  hex: "Hex",
  kind: "Type",
  linear: "Linear",
  radial: "Radial",
  conic: "Conic",
  repeating: "Repeating",
  angle: "Angle",
  shape: "Shape",
  circle: "Circle",
  ellipse: "Ellipse",
  addStop: "Add stop",
  stopColor: (index) => `Stop ${index} color`,
  stopPosition: (index) => `Stop ${index} position`,
  removeStop: (index) => `Remove stop ${index}`
}

type OptionOf<Mode extends ColorPickerMode> = Mode extends typeof colorPickerMode.fill
  ? ColorPickerFillOption
  : ColorPickerGradientOption

export type ColorPickerProps<Mode extends ColorPickerMode = ColorPickerMode> = {
  /** Required. The composing layer declares whether this picker edits a fill or a gradient. */
  mode: Mode
  /** Swatch list. Defaults to `colorPickerPreset[mode]`. */
  option?: readonly OptionOf<Mode>[]
  /** Selected option `value`, or the CSS string emitted for a custom color / gradient. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string, option: OptionOf<Mode>) => void
  size?: ColorPickerSize
  layout?: ColorPickerLayout
  /** Grid column count. Ignored for `row` layout. */
  column?: number
  /** Show the trailing custom editor control. */
  custom?: boolean
  /** Override any caller-facing copy. */
  label?: Partial<ColorPickerLabel>
  disabled?: boolean
  name?: string
  id?: string
  className?: string
  style?: CSSProperties
  "aria-label"?: string
  "aria-labelledby"?: string
  "aria-describedby"?: string
}

type EditorProps<Option extends ColorPickerOption> = {
  current: Option | null
  label: ColorPickerLabel
  onCommit: (option: Option) => void
}

function FillEditor({ current, label, onCommit }: EditorProps<ColorPickerFillOption>) {
  const id = useId()
  const [draft, setDraft] = useState(() => colorPickerNormalizeHex(current?.color) ?? "")
  const color =
    colorPickerNormalizeHex(draft) ?? colorPickerNormalizeHex(current?.color) ?? ColorPickerConfig.DEFAULT_COLOR
  const commit = (hex: string) => onCommit({ type: "fill", value: hex, label: hex, color: hex })

  return (
    <>
      <div {...stylex.props(style.field)}>
        <Label htmlFor={`${id}-color`}>{label.color}</Label>
        <input
          id={`${id}-color`}
          type="color"
          value={color}
          onChange={(event) => {
            setDraft(event.target.value)
            commit(event.target.value.toLowerCase())
          }}
          {...stylex.props(style.wheel)}
        />
      </div>
      <div {...stylex.props(style.field)}>
        <Label htmlFor={`${id}-hex`}>{label.hex}</Label>
        <Input
          id={`${id}-hex`}
          value={draft}
          placeholder="#000000"
          spellCheck={false}
          autoComplete="off"
          aria-invalid={draft !== "" && colorPickerNormalizeHex(draft) === null}
          onChange={(event) => {
            setDraft(event.target.value)
            const hex = colorPickerNormalizeHex(event.target.value)
            if (hex) commit(hex)
          }}
        />
      </div>
    </>
  )
}

type EditorStop = { color: string; position: number }

const stopIdCounter = (() => {
  let count = 0
  return { next: () => `stop-${++count}` }
})()

function editorStop(stop: readonly ColorPickerStop[]): EditorStop[] {
  const last = Math.max(stop.length - 1, 1)
  return stop.map((item, index) => {
    const color = typeof item === "string" ? item : item.color
    const position = typeof item === "string" ? undefined : item.position
    return {
      color: colorPickerNormalizeHex(color) ?? ColorPickerConfig.DEFAULT_COLOR,
      position: position ?? Math.round((index / last) * 100)
    }
  })
}

const initialGradient: ColorPickerGradientOption = {
  type: "gradient",
  value: "",
  label: "",
  stop: ["#000000", "#ffffff"]
}

function GradientEditor({ current, label, onCommit }: EditorProps<ColorPickerGradientOption>) {
  const id = useId()
  const base = current ?? initialGradient
  const kind = base.kind ?? colorPickerGradientKind.linear
  const stop = editorStop(base.stop)
  // Stops have no identity in CSS. Keep an id per row that survives edits, adds and removes while the editor is open.
  const [stopKey, setStopKey] = useState(() => stop.map(() => stopIdCounter.next()))
  // Grow keys if the owner supplied more stops than we have ids for (e.g. value changed while open).
  const key = stop.map((_, index) => stopKey[index] ?? `${stopKey.length}-${index}`)
  const angle =
    base.angle ??
    (kind === colorPickerGradientKind.conic
      ? ColorPickerConfig.DEFAULT_ANGLE.conic
      : ColorPickerConfig.DEFAULT_ANGLE.linear)

  function commit(patch: Partial<ColorPickerGradientOption>) {
    const draft: ColorPickerGradientOption = { type: "gradient", value: "", label: "", kind, stop, ...patch }
    if (draft.kind === colorPickerGradientKind.radial) {
      draft.shape = patch.shape ?? base.shape ?? ColorPickerConfig.DEFAULT_SHAPE
      delete draft.angle
    } else {
      draft.angle = patch.angle ?? (patch.kind === undefined ? angle : undefined)
    }
    draft.repeating = patch.repeating ?? base.repeating ?? false
    const css = colorPickerBackground(draft)
    onCommit({ ...draft, value: css, label: css })
  }
  function addStop() {
    setStopKey([...key, stopIdCounter.next()])
    commit({
      stop: [
        ...stop,
        { color: stop.reduce<string>((_, item) => item.color, ColorPickerConfig.DEFAULT_COLOR), position: 100 }
      ]
    })
  }
  function removeStop(index: number) {
    setStopKey(key.filter((_, at) => at !== index))
    commit({ stop: stop.filter((_, at) => at !== index) })
  }
  function updateStop(index: number, patch: Partial<EditorStop>) {
    commit({ stop: stop.map((item, at) => (at === index ? { ...item, ...patch } : item)) })
  }

  return (
    <>
      <div aria-hidden="true" {...stylex.props(style.preview)} style={{ background: colorPickerBackground(base) }} />
      <div {...stylex.props(style.grid2)}>
        <div {...stylex.props(style.field)}>
          <Label htmlFor={`${id}-kind`}>{label.kind}</Label>
          <NativeSelect
            id={`${id}-kind`}
            value={kind}
            onChange={(event) =>
              commit({
                kind: Object.values(colorPickerGradientKind).find((item) => item === event.target.value)
              })
            }>
            {Object.values(colorPickerGradientKind).map((item) => (
              <NativeSelectOption key={item} value={item}>
                {label[item]}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        {kind === colorPickerGradientKind.radial ? (
          <div {...stylex.props(style.field)}>
            <Label htmlFor={`${id}-shape`}>{label.shape}</Label>
            <NativeSelect
              id={`${id}-shape`}
              value={base.shape ?? ColorPickerConfig.DEFAULT_SHAPE}
              onChange={(event) =>
                commit({ shape: Object.values(colorPickerRadialShape).find((item) => item === event.target.value) })
              }>
              {Object.values(colorPickerRadialShape).map((item: ColorPickerRadialShape) => (
                <NativeSelectOption key={item} value={item}>
                  {label[item]}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          </div>
        ) : (
          <div {...stylex.props(style.field)}>
            <Label htmlFor={`${id}-angle`}>{label.angle}</Label>
            <Input
              id={`${id}-angle`}
              type="number"
              inputMode="numeric"
              min={0}
              max={360}
              value={angle}
              onChange={(event) => {
                if (event.target.value !== "") commit({ angle: Number(event.target.value) })
              }}
            />
          </div>
        )}
      </div>
      <div {...stylex.props(style.inline)}>
        <Label htmlFor={`${id}-repeating`}>{label.repeating}</Label>
        <Switch
          id={`${id}-repeating`}
          checked={base.repeating ?? false}
          onCheckedChange={(checked) => commit({ repeating: checked })}
        />
      </div>
      <ul {...stylex.props(style.stopList)}>
        {stop.map((item, index) => (
          <li key={key[index]} {...stylex.props(style.stop)}>
            <input
              type="color"
              aria-label={label.stopColor(index + 1)}
              value={item.color}
              onChange={(event) => updateStop(index, { color: event.target.value.toLowerCase() })}
              {...stylex.props(style.wheel, style.stopColor)}
            />
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              aria-label={label.stopPosition(index + 1)}
              value={item.position}
              onChange={(event) => {
                if (event.target.value !== "") updateStop(index, { position: Number(event.target.value) })
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={label.removeStop(index + 1)}
              disabled={stop.length <= ColorPickerConfig.MIN_STOP}
              onClick={() => removeStop(index)}>
              <Trash2Icon aria-hidden="true" />
            </Button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="outline" size="sm" onClick={addStop}>
        <PlusIcon aria-hidden="true" />
        {label.addStop}
      </Button>
    </>
  )
}

type CustomPanelProps<Option extends ColorPickerOption> = EditorProps<Option> & {
  size: ColorPickerSize
  disabled: boolean
  Editor: (props: EditorProps<Option>) => ReactNode
}

function CustomPanel<Option extends ColorPickerOption>({
  size,
  disabled,
  label,
  current,
  onCommit,
  Editor
}: CustomPanelProps<Option>) {
  return (
    <Popover>
      <PopoverTrigger
        type="button"
        aria-label={label.custom}
        title={label.custom}
        disabled={disabled}
        data-slot="color-picker-custom"
        {...stylex.props(style.swatch, sizeStyle[size], style.more)}>
        <MoreHorizontalIcon aria-hidden="true" {...stylex.props(moreIconStyle[size])} />
      </PopoverTrigger>
      <PopoverContent align="end" data-slot="color-picker-editor" {...stylex.props(style.panel)}>
        <PopoverTitle {...stylex.props(style.title)}>{label.custom}</PopoverTitle>
        <Editor current={current} label={label} onCommit={onCommit} />
      </PopoverContent>
    </Popover>
  )
}

type PickerProps<Option extends ColorPickerOption> = Omit<
  ColorPickerProps,
  "mode" | "option" | "onValueChange" | "label"
> & {
  mode: ColorPickerMode
  option: readonly Option[]
  onValueChange?: (value: string, option: Option) => void
  label: ColorPickerLabel
  parse: (value: string) => Option | null
  Editor: (props: EditorProps<Option>) => ReactNode
}

function Picker<Option extends ColorPickerOption>({
  mode,
  option,
  value,
  defaultValue,
  onValueChange,
  size = colorPickerSize.md,
  layout = colorPickerLayout.grid,
  column = ColorPickerConfig.DEFAULT_COLUMN,
  custom = true,
  label,
  disabled = false,
  name,
  className,
  style: callerStyle,
  parse,
  Editor,
  ...aria
}: PickerProps<Option>) {
  const [internal, setInternal] = useState(defaultValue)
  const current = value ?? internal
  const known = option.find((item) => item.value === current)
  const extra = known || current === undefined ? null : parse(current)
  const list = extra ? [...option, extra] : option

  function select(chosen: Option) {
    if (value === undefined) setInternal(chosen.value)
    onValueChange?.(chosen.value, chosen)
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
        // RadioGroup only emits rendered swatch values, so exactly one option matches.
        list.filter((item) => item.value === next).forEach(select)
      }}
      data-slot="color-picker"
      data-mode={mode}
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
          disabled={disabled}
          label={label}
          current={known ?? extra}
          onCommit={select}
          Editor={Editor}
        />
      )}
    </RadioGroup>
  )
}

function parseFill(value: string): ColorPickerFillOption | null {
  const option = colorPickerParse(value)
  return option?.type === colorPickerMode.fill ? option : null
}
function parseGradient(value: string): ColorPickerGradientOption | null {
  const option = colorPickerParse(value)
  return option?.type === colorPickerMode.gradient ? option : null
}

/**
 * Swatch picker. `mode` is required: the composing layer decides whether the payload is a fill or a gradient
 * and maps its own data shape into `option` / `value`.
 */
export function ColorPicker(props: ColorPickerProps<"fill"> | ColorPickerProps<"gradient">) {
  const label = { ...colorPickerDefaultLabel, ...props.label }
  if (props.mode === colorPickerMode.fill)
    return (
      <Picker
        {...props}
        label={label}
        option={props.option ?? colorPickerPreset.fill}
        parse={parseFill}
        Editor={FillEditor}
      />
    )
  return (
    <Picker
      {...props}
      label={label}
      option={props.option ?? colorPickerPreset.gradient}
      parse={parseGradient}
      Editor={GradientEditor}
    />
  )
}
