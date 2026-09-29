import type { ComponentProps, CSSProperties, ReactNode } from "react"

import {
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
  type ValueOf
} from "../stylex-support/rich-content-node"

export const DocumentPageSize = {
  A4: "a4",
  Letter: "letter",
  Legal: "legal"
} as const
export type DocumentPageSize = ValueOf<typeof DocumentPageSize>

/** CSS px at 96 dpi, matching Chromium print output. */
export const DocumentPageDimension = {
  [DocumentPageSize.A4]: { width: 794, height: 1123 },
  [DocumentPageSize.Letter]: { width: 816, height: 1056 },
  [DocumentPageSize.Legal]: { width: 816, height: 1344 }
} as const satisfies Record<DocumentPageSize, { width: number; height: number }>

export type DocumentLabels = { pageBreak: string }

export type DocumentContentProps = {
  content?: readonly RichContentNode[] | null
  emptyFallback?: ReactNode
  /** Base font size in px; every document size scales from it (12 matches the legacy CMS print output). */
  fontSize?: number
  /** Unitless body line height for paragraphs, list items, quotes and cells. */
  lineHeight?: number
  fontFamily?: string
  monoFontFamily?: string
  /** Translated copy; English defaults. */
  labels?: Partial<DocumentLabels>
  /** Replace the default image, e.g. to apply CDN transforms. Must be pure to stay server-renderable. */
  renderImage?: (image: RichContentImageRenderProps) => ReactNode
  className?: string
}

const DocumentDefault = {
  FontSize: 12,
  LineHeight: 1.3,
  FontFamily: 'Inter, "Noto Sans Thai", "Sukhumvit Set", system-ui, sans-serif',
  MonoFontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  PageMargin: 48
} as const
const DefaultLabel: DocumentLabels = { pageBreak: "Page break" }

// Sizes are the legacy 12px print values scaled by the caller base size, so 12px reproduces the PDF exactly.
const px = (value: number) => `calc(var(--document-unit) * ${value})`
const scope = ".bridge-document"
const page = ".bridge-document-page"

/**
 * Theme-independent document styles: black on white, no `--bridge` tokens, `:where()` selectors so application CSS
 * can override. Rendered once through React 19 style hoisting; also exported for standalone PDF HTML.
 */
export const documentStyleSheet = `
${scope}, ${scope} *, ${scope} *::before, ${scope} *::after { box-sizing: border-box; }
${scope} {
  --document-unit: calc(var(--document-font-size, 12px) / 12);
  color-scheme: light;
  color: #000;
  background: #fff;
  font-family: var(--document-font-family);
  font-size: var(--document-font-size, 12px);
  line-height: 1.2;
  letter-spacing: 0;
  overflow-wrap: break-word;
  text-align: start;
  print-color-adjust: exact;
  -webkit-print-color-adjust: exact;
}
${scope} :where(p, h1, h2, h3, h4, h5, h6, ul, ol, li, figure, blockquote, pre, table, tr, th, td, hr) {
  margin: 0; padding: 0; border: 0; background: transparent; color: inherit; font-family: inherit; font-style: normal;
}
${scope} :where(p) { margin: 0 0 ${px(4)}; line-height: var(--document-line-height, 1.3); }
${scope} :where(h1, h2, h3, h4, h5, h6) { font-weight: 700; line-height: 1.2; break-after: avoid; page-break-after: avoid; }
${scope} :where(h1) { margin: 0 0 ${px(20)}; font-size: ${px(20)}; line-height: 1.1; }
${scope} :where(h2) { margin: ${px(18)} 0 ${px(8)}; font-size: ${px(18)}; }
${scope} :where(h3) { margin: ${px(16)} 0 ${px(8)}; font-size: ${px(16)}; }
${scope} :where(h4, h5, h6) { margin: ${px(18)} 0 ${px(8)}; font-size: ${px(12)}; }
${scope} :where(ul, ol) { margin: 0 0 ${px(16)} ${px(22)}; }
${scope} :where(li) { display: list-item; margin: ${px(6)} 0; line-height: var(--document-line-height, 1.3); }
${scope} :where(li > p) { margin: 0; }
${scope} :where(ul) { list-style-type: disc; }
${scope} :where(ul ul) { list-style-type: circle; }
${scope} :where(ul ul ul) { list-style-type: square; }
${scope} :where(ol) { list-style-type: decimal; }
${scope} :where(ol ol) { list-style-type: lower-alpha; }
${scope} :where(a) { color: #0000ee; text-decoration: underline; text-underline-offset: 2px; }
${scope} :where(strong) { font-weight: 700; }
${scope} :where(em) { font-style: italic; }
${scope} :where(s) { text-decoration: line-through; }
${scope} :where(blockquote) {
  margin: ${px(18)} 0; padding: ${px(12)} ${px(14)}; border: 1px solid #d7d7d7; background: #fafafa;
  line-height: var(--document-line-height, 1.3); break-inside: avoid; page-break-inside: avoid;
}
${scope} :where(blockquote > :last-child) { margin-bottom: 0; }
${scope} :where(code, pre) { font-family: var(--document-mono-font-family); }
${scope} :where(code) { padding: 1px ${px(4)}; }
${scope} :where(pre) { margin: ${px(18)} 0; padding: ${px(12)}; white-space: pre-wrap; break-inside: avoid; page-break-inside: avoid; }
${scope} :where(pre code) { display: block; padding: 0; }
${scope} :where(table) { width: 100%; border-collapse: collapse; table-layout: fixed; break-inside: avoid; page-break-inside: avoid; }
${scope} :where(tr) { break-inside: avoid; page-break-inside: avoid; }
${scope} :where(th, td) {
  min-width: 4rem; padding: ${px(6)}; border: 1px solid #000; text-align: left; vertical-align: top;
  line-height: var(--document-line-height, 1.3);
}
${scope} :where(th) { font-weight: 700; }
${scope} :where(th, td) > :where(p) { margin: 0; }
${scope} :where([data-slot="document-image"]) {
  display: flex; width: 100%; max-width: 100%; margin: 0 0 ${px(8)}; break-inside: avoid; page-break-inside: avoid;
}
${scope} :where([data-slot="document-image"][data-align="left"]) { justify-content: flex-start; }
${scope} :where([data-slot="document-image"][data-align="center"]) { justify-content: center; }
${scope} :where([data-slot="document-image"][data-align="right"]) { justify-content: flex-end; }
${scope} :where([data-slot="document-image"] img) { display: block; width: 100%; max-width: 100%; height: auto; }
${scope} :where(hr) { margin: ${px(24)} 0; border-top: 1px solid #000; }
${scope} :where(hr[data-slot="document-page-break"]) {
  height: 0; margin: ${px(24)} 0; border-top: 1px dashed #94a3b8; break-after: page; page-break-after: always;
}
${page}-frame { flex-shrink: 0; margin-inline: auto; }
${page} {
  color-scheme: light; display: flex; flex-direction: column; background: #fff; color: #000;
  box-shadow: 0 1rem 2.5rem rgb(0 0 0 / 0.18);
}
${page}-body { flex: 1 1 auto; }
${page} > :where(header, footer) { display: flex; justify-content: space-between; gap: 24px; color: #525252; line-height: 1.2; }
@media print {
  ${scope} :where(hr[data-slot="document-page-break"]) { margin: 0; border: 0; }
  ${page}-frame { width: auto !important; min-height: 0 !important; margin: 0; }
  ${page} { width: auto !important; min-height: 0 !important; zoom: 1 !important; box-shadow: none; }
  ${page}-frame + ${page}-frame { break-before: page; page-break-before: always; }
}
`
  .replace(/\n\s*/g, " ")
  .trim()

function DocumentStyle() {
  return (
    <style href="bridge-document-content" precedence="bridge-document">
      {documentStyleSheet}
    </style>
  )
}

type RenderContext = {
  depth: number
  labels: DocumentLabels
  renderImage?: DocumentContentProps["renderImage"]
}

function renderInline(item: unknown, key: number): ReactNode {
  if (isRecord(item) && item.type === "lineBreak") return <br key={key} />
  if (!isTextRun(item)) return null
  let content: ReactNode = item.text
  if (item.code) content = <code>{content}</code>
  if (item.bold) content = <strong>{content}</strong>
  if (item.italic) content = <em>{content}</em>
  if (item.strike) content = <s>{content}</s>
  if (item.underline) content = <u>{content}</u>
  const href = safeUrl(item.href)
  if (!href) return <span key={key}>{content}</span>
  const external = item.external ? { target: "_blank", rel: "noopener noreferrer" } : {}
  return (
    <a key={key} href={href} {...external}>
      {content}
    </a>
  )
}

function inlineContent(value: unknown) {
  return Array.isArray(value) && hasText(value) ? value.map((item, index) => renderInline(item, index)) : null
}

function blockContent(value: unknown, context: RenderContext) {
  if (!Array.isArray(value)) return null
  const next = { ...context, depth: context.depth + 1 }
  const nodes = value.map((node, index) => renderNode(node, index, next)).filter((node) => node !== null)
  return nodes.length ? nodes : null
}

function mixedContent(inline: unknown, blocks: unknown, context: RenderContext) {
  const text = inlineContent(inline)
  const nested = blockContent(blocks, context)
  if (!text && !nested) return null
  return (
    <>
      {text}
      {nested}
    </>
  )
}

const HeadingTag = ["h1", "h2", "h3", "h4", "h5", "h6"] as const

function renderText(node: Record<string, unknown>, key: number) {
  const content = inlineContent(node.children)
  if (!content) return null
  const align = oneOf(RichContentTextAlign, node.align)
  const style = align ? { textAlign: align } : undefined
  if (node.type === "paragraph")
    return (
      <p key={key} data-align={align} style={style}>
        {content}
      </p>
    )
  const level = integer(node.level)
  const Tag = level !== undefined && level >= 1 ? HeadingTag[level - 1] : undefined
  if (!Tag) return null
  return (
    <Tag key={key} data-align={align} style={style}>
      {content}
    </Tag>
  )
}

function renderQuote(node: Record<string, unknown>, key: number, context: RenderContext) {
  const content = mixedContent(node.children, node.blocks, context)
  return content ? <blockquote key={key}>{content}</blockquote> : null
}

function renderListItem(item: unknown, key: number, context: RenderContext) {
  const content = Array.isArray(item)
    ? inlineContent(item)
    : isRecord(item)
      ? mixedContent(item.children, item.blocks, context)
      : null
  return content ? <li key={key}>{content}</li> : null
}

function renderList(node: Record<string, unknown>, key: number, context: RenderContext) {
  if (!Array.isArray(node.items)) return null
  const items = node.items.map((item, index) => renderListItem(item, index, context)).filter((item) => item !== null)
  if (!items.length) return null
  return node.ordered ? (
    <ol key={key} start={integer(node.start)}>
      {items}
    </ol>
  ) : (
    <ul key={key}>{items}</ul>
  )
}

function renderCodeBlock(node: Record<string, unknown>, key: number) {
  if (typeof node.code !== "string" || !node.code.trim()) return null
  return (
    <pre key={key}>
      <code>{node.code}</code>
    </pre>
  )
}

function renderCell(cell: unknown, key: number, context: RenderContext, rowHasData: boolean) {
  if (!isRecord(cell)) return null
  const content = mixedContent(cell.children, cell.blocks, context)
  const common = { colSpan: span(cell.colSpan), rowSpan: span(cell.rowSpan) }
  return cell.header ? (
    <th key={key} {...common} scope={rowHasData ? "row" : "col"}>
      {content}
    </th>
  ) : (
    <td key={key} {...common}>
      {content}
    </td>
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
    <table key={key} data-slot="document-table">
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
  )
}

function DefaultImage({ image }: { image: RichContentImageRenderProps }) {
  const style: CSSProperties | undefined = image.displayWidth ? { width: image.displayWidth } : undefined
  return (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      srcSet={
        image.sourceSet.length ? image.sourceSet.map((item) => `${item.url} ${item.width}w`).join(", ") : undefined
      }
      sizes={image.sourceSet.length ? image.sizes : undefined}
      // Print must not wait on lazy loading.
      loading="eager"
      decoding="sync"
      style={style}
    />
  )
}

function renderImage(node: Record<string, unknown>, key: number, context: RenderContext) {
  const image = imageProps(node)
  if (!image) return null
  return (
    <figure key={key} data-slot="document-image" data-align={imageAlign(node.align)}>
      {context.renderImage ? context.renderImage(image) : <DefaultImage image={image} />}
    </figure>
  )
}

function renderRule(node: Record<string, unknown>, key: number, context: RenderContext) {
  if (node.type === "pageBreak")
    return <hr key={key} data-slot="document-page-break" aria-label={context.labels.pageBreak} />
  return <hr key={key} />
}

type NodeRenderer = (node: Record<string, unknown>, key: number, context: RenderContext) => ReactNode
// `video` is intentionally absent: print output cannot play embeds.
const NodeRenderer: Record<string, NodeRenderer> = {
  paragraph: renderText,
  heading: renderText,
  quote: renderQuote,
  list: renderList,
  codeBlock: renderCodeBlock,
  table: renderTable,
  image: renderImage,
  horizontalRule: renderRule,
  break: renderRule,
  pageBreak: renderRule
}

function renderNode(node: unknown, key: number, context: RenderContext): ReactNode {
  if (!isRecord(node) || context.depth > RichContentLimit.Depth || typeof node.type !== "string") return null
  const render = Object.hasOwn(NodeRenderer, node.type) ? NodeRenderer[node.type] : undefined
  return render ? render(node, key, context) : null
}

/**
 * Print/document presentation of RichContent nodes: theme-independent, hook-free and `renderToStaticMarkup`-safe, so
 * the browser preview and the PDF HTML share one renderer.
 */
export function DocumentContent({
  content,
  emptyFallback = null,
  fontSize = DocumentDefault.FontSize,
  lineHeight = DocumentDefault.LineHeight,
  fontFamily = DocumentDefault.FontFamily,
  monoFontFamily = DocumentDefault.MonoFontFamily,
  labels,
  renderImage: imageSlot,
  className
}: DocumentContentProps) {
  const context: RenderContext = { depth: 0, labels: { ...DefaultLabel, ...labels }, renderImage: imageSlot }
  const nodes = Array.isArray(content)
    ? content.map((node, index) => renderNode(node, index, context)).filter((node) => node !== null)
    : []
  const style: CSSProperties & Record<`--document-${string}`, string | number> = {
    "--document-font-size": `${fontSize}px`,
    "--document-line-height": lineHeight,
    "--document-font-family": fontFamily,
    "--document-mono-font-family": monoFontFamily,
    fontSize: `${fontSize}px`,
    fontFamily
  }
  return (
    <>
      <DocumentStyle />
      <div
        data-slot="document-content"
        className={["bridge-document", className].filter(Boolean).join(" ")}
        style={style}>
        {nodes.length ? nodes : emptyFallback}
      </div>
    </>
  )
}

/** Split top-level nodes at `pageBreak` for per-page PDF output; consecutive breaks keep their empty page. */
export function splitDocumentPages(content: readonly RichContentNode[] | null | undefined): RichContentNode[][] {
  const pages: RichContentNode[][] = [[]]
  for (const node of Array.isArray(content) ? content : []) {
    if (isRecord(node) && node.type === "pageBreak") pages.push([])
    else pages.at(-1)?.push(node)
  }
  return pages
}

export type DocumentPageMargin = { top?: number; right?: number; bottom?: number; left?: number }

export type DocumentPageProps = Omit<ComponentProps<"article">, "children"> & {
  /** Preset or custom size in CSS px (96 dpi). */
  size?: DocumentPageSize | { width: number; height: number }
  /** Page padding in px; each side defaults to 48. */
  margin?: DocumentPageMargin
  /** Extra space between header/footer and the body. */
  contentMargin?: { top?: number; bottom?: number }
  /** Preview scale; the frame reserves the scaled size. Print ignores it. */
  zoom?: number
  header?: ReactNode
  footer?: ReactNode
  headerHeight?: number
  footerHeight?: number
  children?: ReactNode
}

const nonNegative = (value: number | undefined, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : fallback

/** Page-framed, zoomable read-only preview surface. Prints one page per frame with `break-before: page`. */
export function DocumentPage({
  size = DocumentPageSize.A4,
  margin,
  contentMargin,
  zoom = 1,
  header,
  footer,
  headerHeight,
  footerHeight,
  className,
  style,
  children,
  ...props
}: DocumentPageProps) {
  const dimension = typeof size === "string" ? DocumentPageDimension[size] : size
  const scale = Number.isFinite(zoom) && zoom > 0 ? zoom : 1
  const side = (value: number | undefined) => `${nonNegative(value, DocumentDefault.PageMargin)}px`
  return (
    <>
      <DocumentStyle />
      <div
        data-slot="document-page-frame"
        className="bridge-document-page-frame"
        style={{ width: `${dimension.width * scale}px`, minHeight: `${dimension.height * scale}px` }}>
        <article
          data-slot="document-page"
          {...props}
          className={["bridge-document-page", className].filter(Boolean).join(" ")}
          style={{
            width: `${dimension.width}px`,
            minHeight: `${dimension.height}px`,
            zoom: scale,
            paddingTop: side(margin?.top),
            paddingRight: side(margin?.right),
            paddingBottom: side(margin?.bottom),
            paddingLeft: side(margin?.left),
            ...style
          }}>
          {header ? (
            <header style={{ minHeight: headerHeight ? `${headerHeight}px` : undefined }}>{header}</header>
          ) : null}
          <div
            data-slot="document-page-body"
            className="bridge-document-page-body"
            style={{
              paddingTop: `${nonNegative(contentMargin?.top, 0)}px`,
              paddingBottom: `${nonNegative(contentMargin?.bottom, 0)}px`
            }}>
            {children}
          </div>
          {footer ? (
            <footer style={{ minHeight: footerHeight ? `${footerHeight}px` : undefined }}>{footer}</footer>
          ) : null}
        </article>
      </div>
    </>
  )
}
