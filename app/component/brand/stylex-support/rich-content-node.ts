// Shared RichContent node contract and sanitizers. Used by the themed RichContent and the print DocumentContent.

export type ValueOf<T> = T[keyof T]

export const RichContentTextAlign = { Left: "left", Center: "center", Right: "right", Justify: "justify" } as const
export type RichContentTextAlign = ValueOf<typeof RichContentTextAlign>

export const RichContentImageAlign = { Left: "left", Center: "center", Right: "right" } as const
export type RichContentImageAlign = ValueOf<typeof RichContentImageAlign>

export type RichContentText = {
  type: "text"
  text: string
  bold?: boolean
  italic?: boolean
  strike?: boolean
  underline?: boolean
  code?: boolean
  /** Inline code only: show a copy action. Ignored inside links. */
  copyable?: boolean
  href?: string
  /** Open the link in a new tab with `rel="noopener noreferrer"`. */
  external?: boolean
}
export type RichContentLineBreak = { type: "lineBreak" }
export type RichContentInline = RichContentText | RichContentLineBreak

/** Legacy flat text runs, or an item holding inline runs and/or nested blocks (paragraphs, lists). */
export type RichContentListItem =
  | readonly RichContentInline[]
  | { children?: readonly RichContentInline[]; blocks?: readonly RichContentNode[] }

export type RichContentTableCell = {
  header?: boolean
  colSpan?: number
  rowSpan?: number
  children?: readonly RichContentInline[]
  blocks?: readonly RichContentNode[]
}
export type RichContentTableRow = { cells: readonly RichContentTableCell[] }

export type RichContentImageSource = { url: string; width: number }

export type RichContentNode =
  | { type: "paragraph"; align?: RichContentTextAlign; children: readonly RichContentInline[] }
  | {
      type: "heading"
      level: 1 | 2 | 3 | 4 | 5 | 6
      align?: RichContentTextAlign
      children: readonly RichContentInline[]
    }
  | { type: "quote"; children?: readonly RichContentInline[]; blocks?: readonly RichContentNode[] }
  | { type: "list"; ordered: boolean; start?: number; items: readonly RichContentListItem[] }
  | { type: "codeBlock"; code: string; language?: string; copyable?: boolean }
  | { type: "table"; rows: readonly RichContentTableRow[]; columnWidths?: readonly number[] }
  | {
      type: "image"
      src: string
      alt: string
      width?: number
      height?: number
      align?: RichContentImageAlign
      /** Rendered width: a number (px) or a CSS length such as `"30%"`, `"240px"`, `"12rem"`. */
      displayWidth?: number | string
      sourceSet?: readonly RichContentImageSource[]
      sizes?: string
      blurDataUrl?: string
    }
  | {
      type: "video"
      embedUrl: string
      title: string
      /** Poster image URL or ordered fallback candidates (http(s) / root-relative); built by the application. */
      poster?: string | readonly string[]
    }
  | { type: "horizontalRule" }
  /** @deprecated Renders a horizontal rule; use `horizontalRule`, or inline `lineBreak` for a line break. */
  | { type: "break" }
  | { type: "pageBreak" }

/** Sanitized image data passed to `renderImage`; unsafe images never reach the slot. */
export type RichContentImageRenderProps = {
  src: string
  alt: string
  width?: number
  height?: number
  displayWidth?: string
  sourceSet: readonly RichContentImageSource[]
  sizes?: string
  blurDataUrl?: string
}

export const RichContentLimit = { Depth: 24 } as const
const cssLengthPattern = /^\d+(?:\.\d+)?(?:px|%|rem|em|vw|cm|mm|in|pt|pc)$/
const blurDataPattern = /^data:image\/(?:png|jpe?g|webp|gif|avif);base64,[A-Za-z0-9+/=]+$/

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

export function safeUrl(value: unknown, image = false) {
  if (typeof value !== "string" || !value.trim()) return undefined
  const url = value.trim()
  if (url.startsWith("/") && !url.startsWith("//") && !url.includes("\\")) return url
  try {
    const parsed = new URL(url)
    if (["http:", "https:"].includes(parsed.protocol) || (!image && parsed.protocol === "mailto:")) return url
  } catch {
    /* relative URLs without a root are not accepted */
  }
  return undefined
}

export function safeBlur(value: unknown) {
  if (typeof value !== "string") return undefined
  if (blurDataPattern.test(value)) return value
  const url = safeUrl(value, true)
  return url && !/["'()\\\s]/.test(url) ? url : undefined
}

export function cssLength(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? `${value}px` : undefined
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return cssLengthPattern.test(trimmed) ? trimmed : undefined
}

export const positive = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined
export const integer = (value: unknown) => (typeof value === "number" && Number.isInteger(value) ? value : undefined)
export const span = (value: unknown) => {
  const count = integer(value)
  return count !== undefined && count > 1 ? count : undefined
}
export const oneOf = <T extends Record<string, string>>(option: T, value: unknown): ValueOf<T> | undefined =>
  Object.values(option).find((item): item is ValueOf<T> => item === value)

export function isTextRun(item: unknown): item is RichContentText {
  return isRecord(item) && item.type === "text" && typeof item.text === "string"
}

export function hasText(value: unknown) {
  return Array.isArray(value) && value.some((item) => isTextRun(item) && item.text.trim())
}

export function imageSources(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .flatMap((source): RichContentImageSource[] => {
      const url = isRecord(source) ? safeUrl(source.url, true) : undefined
      const width = isRecord(source) ? positive(source.width) : undefined
      return url && width && !/[\s,]/.test(url) ? [{ url, width }] : []
    })
    .sort((left, right) => left.width - right.width)
}

/** Positive column widths (percent), rounded to 2 decimals; empty when absent or invalid. */
export function columnWidths(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.flatMap((width) => {
    const count = positive(width)
    return count ? [Math.round(count * 100) / 100] : []
  })
}

/** Sanitized image props, or `undefined` when the source or alt text is unusable. */
export function imageProps(node: Record<string, unknown>): RichContentImageRenderProps | undefined {
  const src = safeUrl(node.src, true)
  if (!src || typeof node.alt !== "string") return undefined
  return {
    src,
    alt: node.alt,
    width: positive(node.width),
    height: positive(node.height),
    displayWidth: cssLength(node.displayWidth),
    sourceSet: imageSources(node.sourceSet),
    sizes: typeof node.sizes === "string" ? node.sizes : undefined,
    blurDataUrl: safeBlur(node.blurDataUrl)
  }
}

export const imageAlign = (value: unknown) => oneOf(RichContentImageAlign, value) ?? RichContentImageAlign.Center
