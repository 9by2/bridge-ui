import * as stylex from "@stylexjs/stylex"
import { CheckIcon, CopyIcon } from "lucide-react"
import { useEffect, useState, type CSSProperties, type ReactNode } from "react"

import {
  RichContentImageAlign,
  RichContentLimit,
  RichContentTextAlign,
  columnWidths,
  hasText,
  imageAlign,
  imageProps,
  integer,
  isRecord,
  isTextRun,
  oneOf,
  safeUrl,
  span,
  type RichContentImageRenderProps,
  type RichContentNode,
  type RichContentText,
  type ValueOf
} from "../stylex-support/rich-content-node"

import { Button } from "./button"
import { ResponsiveImage } from "./responsive-image"
import { Separator } from "./separator"
import { token } from "./token.stylex"
import { Blockquote, Body, Heading, InlineCode, List, WAIHeading } from "./typography"
import { VideoPlayer } from "./video-player"
import { VideoThumbnail } from "./video-thumbnail"

export {
  RichContentImageAlign,
  RichContentTextAlign,
  type RichContentImageRenderProps,
  type RichContentImageSource,
  type RichContentInline,
  type RichContentLineBreak,
  type RichContentListItem,
  type RichContentNode,
  type RichContentTableCell,
  type RichContentTableRow,
  type RichContentText
} from "../stylex-support/rich-content-node"

export const RichContentVariant = { Default: "default", Compact: "compact" } as const
export type RichContentVariant = ValueOf<typeof RichContentVariant>

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
const CopiedResetMs = 1500
const youtubeHost = ["youtube.com", "www.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com"]

// Typography owns font, size, colour and list/quote/code appearance; these add only layout it does not set.
const style = stylex.create({
  root: { color: token.foreground, overflowWrap: "anywhere", minWidth: 0 },
  block: { marginBlock: "0.75em" },
  tight: { marginBlock: "0.25em" },
  heading: { fontWeight: 700, lineHeight: 1.2, marginBlock: "1em 0.5em" },
  listItem: { marginBlock: "0.25em", paddingInlineStart: "0.25em" },
  link: { color: token.primary, textDecoration: "underline", textUnderlineOffset: "0.2em" },
  left: { textAlign: "left" },
  center: { textAlign: "center" },
  right: { textAlign: "right" },
  justify: { textAlign: "justify" },
  mono: { fontFamily: "var(--bridge-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)" },
  inlineCopy: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.125em",
    maxWidth: "100%",
    verticalAlign: "baseline"
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
  rule: { marginBlock: "2em" },
  pageBreak: {
    marginBlock: "1.5em",
    backgroundImage: `repeating-linear-gradient(to right, transparent 0 6px, ${token.background} 6px 10px)`,
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
const figureAlignStyle = { left: style.figureLeft, center: style.figureCenter, right: style.figureRight } as const

type RenderContext = {
  depth: number
  tight: boolean
  labels: RichContentLabels
  renderImage?: RichContentProps["renderImage"]
  copyText: (text: string) => Promise<boolean> | boolean
}

const HeadingTag = Object.values(WAIHeading)

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
    const timer = setTimeout(() => setCopied(false), CopiedResetMs)
    return () => clearTimeout(timer)
  }, [copied])
  const label = copied ? context.labels.copiedCode : context.labels.copyCode
  const Icon = copied ? CheckIcon : CopyIcon
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        data-slot="rich-content-copy"
        aria-label={label}
        title={label}
        onClick={async () => setCopied(await context.copyText(value))}>
        <Icon aria-hidden="true" />
      </Button>
      <span role="status" className={stylex.props(style.visuallyHidden).className}>
        {copied ? context.labels.copiedCode : ""}
      </span>
    </>
  )
}

function markText(item: RichContentText, context: RenderContext, href: string | undefined): ReactNode {
  let content: ReactNode = item.text
  if (item.code) content = <InlineCode>{content}</InlineCode>
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
      <Body key={key} data-align={align} className={stylex.props(blockStyle(context), alignStyle).className}>
        {content}
      </Body>
    )
  const level = integer(node.level)
  const Tag = level !== undefined && level >= 1 ? HeadingTag[level - 1] : undefined
  if (!Tag) return null
  return (
    <Heading key={key} as={Tag} data-align={align} className={stylex.props(style.heading, alignStyle).className}>
      {content}
    </Heading>
  )
}

function renderQuote(node: Record<string, unknown>, key: number, context: RenderContext) {
  const content = mixedContent(node.children, node.blocks, context)
  return content ? <Blockquote key={key}>{content}</Blockquote> : null
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
  return node.ordered ? (
    <List key={key} ordered start={integer(node.start)}>
      {items}
    </List>
  ) : (
    <List key={key}>{items}</List>
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
  const widths = columnWidths(node.columnWidths)
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
  const image = imageProps(node)
  if (!image) return null
  const align = imageAlign(node.align)
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
      <Separator
        key={key}
        aria-label={context.labels.pageBreak}
        data-slot="rich-content-page-break"
        className={stylex.props(style.pageBreak).className}
      />
    )
  return <Separator key={key} className={stylex.props(style.rule).className} />
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
    tight: variant === RichContentVariant.Compact,
    labels: { ...DefaultLabel, ...labels },
    renderImage: imageSlot,
    copyText
  }
  const nodes = Array.isArray(content)
    ? content.map((node, index) => renderNode(node, index, context)).filter((node) => node !== null)
    : []
  return (
    <div data-slot="rich-content" className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}>
      {nodes.length ? nodes : emptyFallback}
    </div>
  )
}
