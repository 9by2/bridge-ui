type ValueOf<T> = T[keyof T]

export const colorPickerMode = { fill: "fill", gradient: "gradient" } as const
export type ColorPickerMode = ValueOf<typeof colorPickerMode>

export const colorPickerGradientKind = { linear: "linear", radial: "radial", conic: "conic" } as const
export type ColorPickerGradientKind = ValueOf<typeof colorPickerGradientKind>

export const colorPickerRadialShape = { circle: "circle", ellipse: "ellipse" } as const
export type ColorPickerRadialShape = ValueOf<typeof colorPickerRadialShape>

export const ColorPickerConfig = {
  DEFAULT_COLUMN: 6,
  DEFAULT_COLOR: "#000000",
  DEFAULT_ANGLE: { linear: 135, conic: 0 },
  DEFAULT_SHAPE: colorPickerRadialShape.circle,
  MIN_STOP: 2,
  HEX_PATTERN: /^#?([0-9a-f]{6})$/i,
  GRADIENT_PATTERN: /^(repeating-)?(linear|radial|conic)-gradient\((.*)\)$/is,
  ANGLE_PATTERN: /^(from\s+)?(-?\d+(?:\.\d+)?)deg$/i,
  STOP_POSITION_PATTERN: /\s+(-?\d+(?:\.\d+)?)%$/
} as const

/** A color stop. A bare string is a color without position. `position` is a percentage. */
export type ColorPickerStop = string | { color: string; position?: number }

export type ColorPickerFillOption = { type: "fill"; value: string; label: string; color: string }
export type ColorPickerGradientOption = {
  type: "gradient"
  value: string
  label: string
  stop: readonly ColorPickerStop[]
  /** CSS gradient function. Defaults to `linear`. */
  kind?: ColorPickerGradientKind
  /** Linear direction or conic start angle in degrees. Defaults to 135 (linear) / 0 (conic). */
  angle?: number
  /** Radial ending shape. Defaults to `circle`. */
  shape?: ColorPickerRadialShape
  /** Use the `repeating-*-gradient` function. */
  repeating?: boolean
}
export type ColorPickerOption = ColorPickerFillOption | ColorPickerGradientOption

function stopCss(stop: ColorPickerStop) {
  if (typeof stop === "string") return stop
  return stop.position === undefined ? stop.color : `${stop.color} ${stop.position}%`
}

function gradientHead(option: ColorPickerGradientOption) {
  if (option.kind === colorPickerGradientKind.radial) return option.shape ?? ColorPickerConfig.DEFAULT_SHAPE
  if (option.kind === colorPickerGradientKind.conic)
    return `from ${option.angle ?? ColorPickerConfig.DEFAULT_ANGLE.conic}deg`
  return `${option.angle ?? ColorPickerConfig.DEFAULT_ANGLE.linear}deg`
}

/** Convert an option into a CSS `background` value. */
export function colorPickerBackground(option: ColorPickerOption) {
  if (option.type === "fill") return option.color
  const kind = option.kind ?? colorPickerGradientKind.linear
  const stop = option.stop.map(stopCss).join(", ")
  return `${option.repeating ? "repeating-" : ""}${kind}-gradient(${gradientHead(option)}, ${stop})`
}

export function colorPickerNormalizeHex(input: string | undefined) {
  const match = ColorPickerConfig.HEX_PATTERN.exec(input?.trim() ?? "")
  return match?.[1] ? `#${match[1].toLowerCase()}` : null
}

/** Split on commas that are not nested inside parentheses. */
function splitArgument(input: string) {
  const part: string[] = []
  let depth = 0
  let start = 0
  for (let index = 0; index < input.length; index++) {
    const char = input[index]
    if (char === "(") depth++
    else if (char === ")") depth--
    else if (char === "," && depth === 0) {
      part.push(input.slice(start, index).trim())
      start = index + 1
    }
  }
  part.push(input.slice(start).trim())
  return part
}

function parseStop(input: string): ColorPickerStop {
  const position = ColorPickerConfig.STOP_POSITION_PATTERN.exec(input)
  if (!position) return { color: input }
  return { color: input.slice(0, position.index), position: Number(position[1]) }
}

function parseKind(input: string): ColorPickerGradientKind {
  const name = input.toLowerCase()
  if (name === colorPickerGradientKind.radial) return colorPickerGradientKind.radial
  if (name === colorPickerGradientKind.conic) return colorPickerGradientKind.conic
  return colorPickerGradientKind.linear
}

type GradientHead = Pick<ColorPickerGradientOption, "angle" | "shape">

function parseHead(kind: ColorPickerGradientKind, head: string): GradientHead | null {
  const angle = ColorPickerConfig.ANGLE_PATTERN.exec(head)
  if (kind === colorPickerGradientKind.linear && angle && !angle[1]) return { angle: Number(angle[2]) }
  if (kind === colorPickerGradientKind.conic && angle?.[1]) return { angle: Number(angle[2]) }
  if (kind === colorPickerGradientKind.radial && (head === "circle" || head === "ellipse")) return { shape: head }
  return null
}

/**
 * Parse a CSS gradient or hex color emitted by `colorPickerBackground` back into an option.
 * Returns `null` for any other CSS; callers may still render such a value as a plain background.
 */
export function colorPickerParse(css: string): ColorPickerOption | null {
  const value = css.trim()
  const hex = colorPickerNormalizeHex(value)
  if (hex) return { type: "fill", value, label: value, color: hex }
  const match = ColorPickerConfig.GRADIENT_PATTERN.exec(value)
  if (!match) return null
  const [, repeating, kindText = "", body = ""] = match
  const kind = parseKind(kindText)
  const [first = "", ...rest] = splitArgument(body)
  const head = parseHead(kind, first.toLowerCase())
  const stop = (head ? rest : [first, ...rest]).map(parseStop)
  if (stop.length < ColorPickerConfig.MIN_STOP) return null
  return { type: "gradient", value, label: value, kind, stop, ...head, ...(repeating && { repeating: true }) }
}
