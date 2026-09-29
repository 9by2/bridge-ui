import * as stylex from "@stylexjs/stylex"
import { CheckIcon, CopyIcon } from "lucide-react"
import { useEffect, useState, type CSSProperties, type ReactNode } from "react"

import { ResponsiveImage } from "./responsive-image"
import { token } from "./token.stylex"
import { VideoPlayer } from "./video-player"
import { VideoThumbnail } from "./video-thumbnail"

type ValueOf<T> = T[keyof T]

export const RichContentVariant = { Default: "default", Compact: "compact" } as const
export type RichContentVariant = ValueOf<typeof RichContentVariant>

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

export type RichContentLabels = {
  code: string
  copyCode: string
  copiedCode: string
  table: string
  pageBreak: string
  playVideo: string
}

export type RichContentProps = {
  content?: readonly RichContentNode[] | null
  emptyFallback?: ReactNode
  variant?: RichContentVariant
  className?: string
  /** Translated copy; English defaults. */
  labels?: Partial<RichContentLabels>
  /** Replace the default image element, e.g. to apply CDN transforms. The package keeps the alignment frame. */
  renderImage?: (image: RichContentImageRenderProps) => ReactNode
  /** Clipboard writer; resolves `true` on success. Defaults to `navigator.clipboard.writeText`. */
  copyText?: (text: string) => Promise<boolean> | boolean
}

const DefaultLabel: RichContentLabels = {
  code: "Code",
  copyCode: "Copy code",
  copiedCode: "Copied code",
  table: "Table",
  pageBreak: "Page break",
  playVideo: "Play video"
}
const RichContentLimit = { Depth: 24, CopiedResetMs: 1500 } as const
const cssLengthPattern = /^\d+(?:\.\d+)?(?:px|%|rem|em|vw|cm|mm|in|pt|pc)$/
const blurDataPattern = /^data:image\/(?:png|jpe?g|webp|gif|avif);base64,[A-Za-z0-9+/=]+$/
const youtubeHost = ["youtube.com", "www.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"]

const style = stylex.create({
  root: { color: token.foreground, lineHeight: 1.65, overflowWrap: "anywhere", minWidth: 0 },
  compact: { lineHeight: 1.45 },
  block: { marginBlock: "0.75em" },
  tight: { marginBlock: "0.25em" },
  heading: { fontFamily: token.fontHeading, fontWeight: 700, lineHeight: 1.2, marginBlock: "1em 0.5em" },
  h1: { fontSize: "2em" },
  h2: { fontSize: "1.6em" },
  h3: { fontSize: "1.3em" },
  h4: { fontSize: "1.15em" },
  h5: { fontSize: "1em" },
  h6: { fontSize: "0.9em" },
  list: { paddingInlineStart: "1.5em", marginBlock: "0.75em" },
  bullet: { listStyleType: "disc" },
  ordered: { listStyleType: "decimal" },
  listItem: { marginBlock: "0.25em", paddingInlineStart: "0.25em" },
  link: { color: token.primary, textDecoration: "underline", textUnderlineOffset: "0.2em" },
  quote: {
    borderInlineStartWidth: "3px",
    borderInlineStartStyle: "solid",
    borderInlineStartColor: token.border,
    paddingInlineStart: "1em",
    color: token.mutedForeground
  },
  left: { textAlign: "left" },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  justify: { textAlign: "justify" },
  mono: { fontFamily: "var(--bridge-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)" },
  inlineCode: {
    fontSize: "0.9em",
    paddingBlock: "0.1em",
    paddingInline: "0.35em",
    borderRadius: "0.35em",
    backgroundColor: token.muted
  },
  inlineCopy: {
    display: "inline-flex",
    alignItems: "center",
    maxWidth: "100%",
    verticalAlign: "baseline",
    borderRadius: "0.35em",
    backgroundColor: token.muted
  },
  codeBlock: {
    marginBlock: "1em",
    overflow: "hidden",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: token.border,
    borderRadius: "0.5em",
    backgroundColor: token.muted
  },
  codeHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.5em",
    paddingBlock: "0.25em",
    paddingInline: "0.75em 0.25em",
    borderBlockEndWidth: "1px",
    borderBlockEndStyle: "solid",
    borderBlockEndColor: token.border,
    color: token.foreground,
    fontSize: "0.75em",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    minHeight: "2.25em"
  },
  pre: { margin: 0, padding: "1em", overflowX: "auto", fontSize: "0.875em", lineHeight: 1.6, whiteSpace: "pre" },
  copyButton: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    width: "1.75em",
    height: "1.75em",
    padding: 0,
    border: 0,
    borderRadius: "0.35em",
    cursor: "pointer",
    color: { default: token.mutedForeground, ":hover": token.foreground },
    backgroundColor: { default: "transparent", ":hover": token.accent },
    outline: { default: "none", ":focus-visible": `2px solid ${token.ring}` },
    fontSize: "1em"
  },
  copyIcon: { width: "1em", height: "1em" },
  visuallyHidden: {
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0
  },
  tableRegion: {
    marginBlock: "1em",
    maxWidth: "100%",
    overflowX: "auto",
    outline: { default: "none", ":focus-visible": `2px solid ${token.ring}` }
  },
  table: { width: "100%", borderCollapse: "collapse" },
  fixed: { tableLayout: "fixed" },
  cell: {
    minWidth: "4em",
    padding: "0.5em",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: token.border,
    textAlign: "start",
    verticalAlign: "top"
  },
  headerCell: { fontWeight: 600, backgroundColor: token.muted },
  rule: {
    marginBlock: "2em",
    borderWidth: 0,
    borderBlockStartWidth: "1px",
    borderBlockStartStyle: "solid",
    borderBlockStartColor: token.border
  },
  pageBreak: {
    height: 0,
    borderWidth: 0,
    marginBlock: "1.5em",
    borderBlockStartWidth: "1px",
    borderBlockStartStyle: "dashed",
    borderBlockStartColor: token.mutedForeground,
    breakBefore: "page"
  },
  figure: { display: "flex", width: "100%", marginBlock: "1.5em", marginInline: 0 },
  figureLeft: { justifyContent: "flex-start" },
  figureCenter: { justifyContent: "center" },
  figureRight: { justifyContent: "flex-end" },
  image: { display: "block", maxWidth: "100%", height: "auto" },
  video: { marginBlock: "1.5em" }
})

const textAlignStyle = {
  left: style.left,
  center: style.center,
  right: style.right,
  justify: style.justify
} as const
const headingSizeStyle = [style.h1, style.h2, style.h3, style.h4, style.h5, style.h6] as const
const figureAlignStyle = { left: style.figureLeft, center: style.figureCenter, right: style.figureRight } as const

type RenderContext = {
  depth: number
  tight: boolean
  labels: RichContentLabels
  renderImage?: RichContentProps["renderImage"]
  copyText: (text: string) => Promise<boolean> | boolean
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

function safeUrl(value: unknown, image = false) {
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

function safeBlur(value: unknown) {
  if (typeof value !== "string") return undefined
  if (blurDataPattern.test(value)) return value
  const url = safeUrl(value, true)
  return url && !/["'()\\\s]/.test(url) ? url : undefined
}

function cssLength(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? `${value}px` : undefined
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return cssLengthPattern.test(trimmed) ? trimmed : undefined
}

const positive = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined
const integer = (value: unknown) => (typeof value === "number" && Number.isInteger(value) ? value : undefined)
const span = (value: unknown) => {
  const count = integer(value)
  return count !== undefined && count > 1 ? count : undefined
}
const oneOf = <T extends Record<string, string>>(option: T, value: unknown): ValueOf<T> | undefined =>
  Object.values(option).find((item): item is ValueOf<T> => item === value)
const HeadingTag = ["h1", "h2", "h3", "h4", "h5", "h6"] as const

async function defaultCopyText(text: string) {
  try {
    if (!navigator.clipboard?.writeText) return false
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function isYouTubeEmbed(value: string) {
  try {
    const parsed = new URL(value)
    const safe = parsed.protocol === "https:" && youtubeHost.includes(parsed.hostname) && !parsed.port
    return safe && !parsed.username && !parsed.password && /^\/embed\/[a-zA-Z0-9_-]+$/.test(parsed.pathname)
  } catch {
    return false
  }
}

function CopyButton({ value, context }: { value: string; context: RenderContext }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), RichContentLimit.CopiedResetMs)
    return () => clearTimeout(timer)
  }, [copied])
  const label = copied ? context.labels.copiedCode : context.labels.copyCode
  const Icon = copied ? CheckIcon : CopyIcon
  return (
    <>
      <button
        type="button"
        data-slot="rich-content-copy"
        aria-label={label}
        title={label}
        className={stylex.props(style.copyButton).className}
        onClick={async () => setCopied(await context.copyText(value))}>
        <Icon aria-hidden="true" className={stylex.props(style.copyIcon).className} />
      </button>
      <span role="status" className={stylex.props(style.visuallyHidden).className}>
        {copied ? context.labels.copiedCode : ""}
      </span>
    </>
  )
}

function isTextRun(item: unknown): item is RichContentText {
  return isRecord(item) && item.type === "text" && typeof item.text === "string"
}

function hasText(value: unknown) {
  return Array.isArray(value) && value.some((item) => isTextRun(item) && item.text.trim())
}

function markText(item: RichContentText, context: RenderContext, href: string | undefined): ReactNode {
  let content: ReactNode = item.text
  if (item.code)
    content = (
      <code className={stylex.props(style.mono, !item.copyable || href ? style.inlineCode : null).className}>
        {content}
      </code>
    )
  if (item.bold) content = <strong>{content}</strong>
  if (item.italic) content = <em>{content}</em>
  if (item.strike) content = <s>{content}</s>
  if (item.underline) content = <u>{content}</u>
  if (item.code && item.copyable && !href)
    content = (
      <span data-slot="rich-content-inline-code" className={stylex.props(style.inlineCopy).className}>
        {content}
        <CopyButton value={item.text} context={context} />
      </span>
    )
  return content
}

function renderInline(item: unknown, key: number, context: RenderContext): ReactNode {
  if (isRecord(item) && item.type === "lineBreak") return <br key={key} />
  if (!isTextRun(item)) return null
  const href = safeUrl(item.href)
  const content = markText(item, context, href)
  if (!href) return <span key={key}>{content}</span>
  const external = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {}
  return (
    <a key={key} href={href} {...external} className={stylex.props(style.link).className}>
      {content}
    </a>
  )
}

function inlineContent(value: unknown, context: RenderContext) {
  return Array.isArray(value) && hasText(value) ? value.map((item, index) => renderInline(item, index, context)) : null
}

function blockContent(value: unknown, context: RenderContext) {
  if (!Array.isArray(value)) return null
  const next = { ...context, depth: context.depth + 1, tight: true }
  const nodes = value.map((node, index) => renderNode(node, index, next)).filter((node) => node !== null)
  return nodes.length ? nodes : null
}

function mixedContent(inline: unknown, blocks: unknown, context: RenderContext) {
  const text = inlineContent(inline, context)
  const nested = blockContent(blocks, context)
  if (!text && !nested) return null
  return (
    <>
      {text}
      {nested}
    </>
  )
}

function blockStyle(context: RenderContext) {
  return context.tight ? style.tight : style.block
}

function renderText(node: Record<string, unknown>, key: number, context: RenderContext) {
  const content = inlineContent(node.children, context)
  if (!content) return null
  const align = oneOf(RichContentTextAlign, node.align)
  const alignStyle = align ? textAlignStyle[align] : null
  if (node.type === "paragraph")
    return (
      <p key={key} data-align={align} className={stylex.props(blockStyle(context), alignStyle).className}>
        {content}
      </p>
    )
  const level = integer(node.level)
  const Tag = level !== undefined && level >= 1 ? HeadingTag[level - 1] : undefined
  if (!Tag || level === undefined) return null
  return (
    <Tag
      key={key}
      data-align={align}
      className={stylex.props(style.heading, headingSizeStyle[level - 1], alignStyle).className}>
      {content}
    </Tag>
  )
}

function renderQuote(node: Record<string, unknown>, key: number, context: RenderContext) {
  const content = mixedContent(node.children, node.blocks, context)
  return content ? (
    <blockquote key={key} className={stylex.props(blockStyle(context), style.quote).className}>
      {content}
    </blockquote>
  ) : null
}

function renderListItem(item: unknown, key: number, context: RenderContext) {
  const content = Array.isArray(item)
    ? inlineContent(item, context)
    : isRecord(item)
      ? mixedContent(item.children, item.blocks, context)
      : null
  return content ? (
    <li key={key} className={stylex.props(style.listItem).className}>
      {content}
    </li>
  ) : null
}

function renderList(node: Record<string, unknown>, key: number, context: RenderContext) {
  if (!Array.isArray(node.items)) return null
  const items = node.items.map((item, index) => renderListItem(item, index, context)).filter((item) => item !== null)
  if (!items.length) return null
  const Tag = node.ordered ? "ol" : "ul"
  const start = node.ordered ? integer(node.start) : undefined
  return (
    <Tag
      key={key}
      start={start}
      className={
        stylex.props(style.list, context.tight && style.tight, node.ordered ? style.ordered : style.bullet).className
      }>
      {items}
    </Tag>
  )
}

function renderCodeBlock(node: Record<string, unknown>, key: number, context: RenderContext) {
  if (typeof node.code !== "string" || !node.code.trim()) return null
  const language = typeof node.language === "string" && node.language.trim() ? node.language.trim() : undefined
  return (
    <div key={key} data-slot="rich-content-code-block" className={stylex.props(style.codeBlock).className}>
      <div className={stylex.props(style.codeHeader, style.mono).className}>
        <span>{language ?? context.labels.code}</span>
        {node.copyable === false ? null : <CopyButton value={node.code} context={context} />}
      </div>
      <pre className={stylex.props(style.pre, style.mono).className}>
        <code>{node.code}</code>
      </pre>
    </div>
  )
}

function renderCell(cell: unknown, key: number, context: RenderContext, rowHasData: boolean) {
  if (!isRecord(cell)) return null
  const content = mixedContent(cell.children, cell.blocks, context)
  const common = { colSpan: span(cell.colSpan), rowSpan: span(cell.rowSpan) }
  if (!cell.header)
    return (
      <td key={key} {...common} className={stylex.props(style.cell).className}>
        {content}
      </td>
    )
  return (
    <th
      key={key}
      {...common}
      scope={rowHasData ? "row" : "col"}
      className={stylex.props(style.cell, style.headerCell).className}>
      {content}
    </th>
  )
}

function renderRow(row: unknown, key: number, context: RenderContext) {
  if (!isRecord(row) || !Array.isArray(row.cells)) return null
  const hasData = row.cells.some((cell) => isRecord(cell) && !cell.header)
  const cells = row.cells
    .map((cell, index) => renderCell(cell, index, context, hasData))
    .filter((cell) => cell !== null)
  return cells.length ? <tr key={key}>{cells}</tr> : null
}

function renderTable(node: Record<string, unknown>, key: number, context: RenderContext) {
  if (!Array.isArray(node.rows)) return null
  const rows = node.rows.map((row, index) => renderRow(row, index, context)).filter((row) => row !== null)
  if (!rows.length) return null
  const widths = Array.isArray(node.columnWidths)
    ? node.columnWidths.flatMap((width) => {
        const value = positive(width)
        return value ? [Math.round(value * 100) / 100] : []
      })
    : []
  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable region must be keyboard reachable
    <div
      key={key}
      role="region"
      aria-label={context.labels.table}
      tabIndex={0}
      data-slot="rich-content-table"
      className={stylex.props(style.tableRegion).className}>
      <table className={stylex.props(style.table, widths.length > 0 && style.fixed).className}>
        {widths.length ? (
          <colgroup>
            {widths.map((width, index) => (
              // oxlint-disable-next-line react/no-array-index-key -- columns are positional
              <col key={index} style={{ width: `${width}%` }} />
            ))}
          </colgroup>
        ) : null}
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

function imageSources(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .flatMap((source): RichContentImageSource[] => {
      const url = isRecord(source) ? safeUrl(source.url, true) : undefined
      const width = isRecord(source) ? positive(source.width) : undefined
      return url && width && !/[\s,]/.test(url) ? [{ url, width }] : []
    })
    .sort((left, right) => left.width - right.width)
}

function DefaultImage({ image }: { image: RichContentImageRenderProps }) {
  const largest = image.sourceSet.at(-1)
  const imageStyle: CSSProperties | undefined = image.displayWidth ? { width: image.displayWidth } : undefined
  return (
    <ResponsiveImage
      src={image.src}
      alt={image.alt}
      width={image.width ?? largest?.width}
      height={image.height}
      loading="lazy"
      decoding="async"
      style={imageStyle}
      className={stylex.props(style.image).className}
      placeholder={image.blurDataUrl ? { blurDataUrl: image.blurDataUrl } : undefined}
      sourceSet={
        image.sourceSet.length
          ? [{ srcSet: image.sourceSet.map((item) => `${item.url} ${item.width}w`).join(", "), sizes: image.sizes }]
          : undefined
      }
    />
  )
}

function renderImage(node: Record<string, unknown>, key: number, context: RenderContext) {
  const src = safeUrl(node.src, true)
  if (!src || typeof node.alt !== "string") return null
  const image: RichContentImageRenderProps = {
    src,
    alt: node.alt,
    width: positive(node.width),
    height: positive(node.height),
    displayWidth: cssLength(node.displayWidth),
    sourceSet: imageSources(node.sourceSet),
    sizes: typeof node.sizes === "string" ? node.sizes : undefined,
    blurDataUrl: safeBlur(node.blurDataUrl)
  }
  const align = oneOf(RichContentImageAlign, node.align) ?? "center"
  return (
    <figure
      key={key}
      data-slot="rich-content-image"
      data-align={align}
      className={stylex.props(style.figure, figureAlignStyle[align]).className}>
      {context.renderImage ? context.renderImage(image) : <DefaultImage image={image} />}
    </figure>
  )
}

function renderVideo(node: Record<string, unknown>, key: number, context: RenderContext) {
  const embedUrl = typeof node.embedUrl === "string" ? node.embedUrl : ""
  if (!isYouTubeEmbed(embedUrl) || typeof node.title !== "string" || !node.title.trim()) return null
  const poster = (
    typeof node.poster === "string" ? [node.poster] : Array.isArray(node.poster) ? node.poster : []
  ).flatMap((item: unknown) => {
    const url = safeUrl(item, true)
    return url ? [url] : []
  })
  return (
    <div key={key} data-slot="rich-content-video" className={stylex.props(style.video).className}>
      <VideoPlayer
        embedUrl={embedUrl}
        title={node.title}
        playLabel={`${context.labels.playVideo}: ${node.title}`}
        poster={poster.length ? <VideoThumbnail src={poster} alt="" /> : undefined}
      />
    </div>
  )
}

function renderSeparator(node: Record<string, unknown>, key: number, context: RenderContext) {
  if (node.type === "pageBreak")
    return (
      <hr
        key={key}
        aria-label={context.labels.pageBreak}
        data-slot="rich-content-page-break"
        className={stylex.props(style.pageBreak).className}
      />
    )
  return <hr key={key} className={stylex.props(style.rule).className} />
}

type NodeRenderer = (node: Record<string, unknown>, key: number, context: RenderContext) => ReactNode
const NodeRenderer: Record<string, NodeRenderer> = {
  paragraph: renderText,
  heading: renderText,
  quote: renderQuote,
  list: renderList,
  codeBlock: renderCodeBlock,
  table: renderTable,
  image: renderImage,
  video: renderVideo,
  horizontalRule: renderSeparator,
  break: renderSeparator,
  pageBreak: renderSeparator
}

function renderNode(node: unknown, key: number, context: RenderContext): ReactNode {
  if (!isRecord(node) || context.depth > RichContentLimit.Depth || typeof node.type !== "string") return null
  const render = Object.hasOwn(NodeRenderer, node.type) ? NodeRenderer[node.type] : undefined
  return render ? render(node, key, context) : null
}

export function RichContent({
  content,
  emptyFallback = null,
  variant = RichContentVariant.Default,
  className,
  labels,
  renderImage: imageSlot,
  copyText = defaultCopyText
}: RichContentProps) {
  const context: RenderContext = {
    depth: 0,
    tight: false,
    labels: { ...DefaultLabel, ...labels },
    renderImage: imageSlot,
    copyText
  }
  const nodes = Array.isArray(content)
    ? content.map((node, index) => renderNode(node, index, context)).filter((node) => node !== null)
    : []
  return (
    <div
      data-slot="rich-content"
      className={[
        stylex.props(style.root, variant === RichContentVariant.Compact && style.compact).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}>
      {nodes.length ? nodes : emptyFallback}
    </div>
  )
}
