import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"

import { token } from "./token.stylex"

export type RichContentText = {
  type: "text"
  text: string
  bold?: boolean
  italic?: boolean
  code?: boolean
  href?: string
}
export type RichContentNode =
  | { type: "paragraph" | "quote"; children: readonly RichContentText[] }
  | { type: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; children: readonly RichContentText[] }
  | { type: "list"; ordered: boolean; items: readonly (readonly RichContentText[])[] }
  | { type: "image"; src: string; alt: string; width?: number; height?: number }
  | { type: "break" }

export type RichContentProps = {
  content?: readonly RichContentNode[] | null
  emptyFallback?: ReactNode
  variant?: "default" | "compact"
  className?: string
}

const style = stylex.create({
  root: { color: token.foreground, lineHeight: 1.65, overflowWrap: "anywhere", minWidth: 0 },
  compact: { lineHeight: 1.45 },
  block: { marginBlock: "0.75em" },
  heading: { fontFamily: token.fontHeading, fontWeight: 700, lineHeight: 1.2, marginBlock: "1em 0.5em" },
  list: { paddingInlineStart: "1.5em", marginBlock: "0.75em" },
  bullet: { listStyleType: "disc" },
  ordered: { listStyleType: "decimal" },
  link: { color: token.primary, textDecoration: "underline" },
  quote: { borderInlineStart: `3px solid ${token.border}`, paddingInlineStart: "1em" },
  image: { display: "block", maxWidth: "100%", height: "auto" }
})

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

function renderText(item: RichContentText, key: number): ReactNode {
  if (!item || item.type !== "text" || typeof item.text !== "string") return null
  let content: ReactNode = item.text
  if (item.bold) content = <strong>{content}</strong>
  if (item.italic) content = <em>{content}</em>
  if (item.code) content = <code>{content}</code>
  const href = safeUrl(item.href)
  if (href)
    content = (
      <a href={href} className={stylex.props(style.link).className}>
        {content}
      </a>
    )
  return <span key={key}>{content}</span>
}

function textContent(value: unknown) {
  return Array.isArray(value) ? value.map(renderText) : null
}

function hasText(value: unknown) {
  return (
    Array.isArray(value) &&
    value.some((item) => item?.type === "text" && typeof item.text === "string" && item.text.trim())
  )
}

function renderNode(node: RichContentNode, key: number): ReactNode {
  if (!node || typeof node !== "object") return null
  if (node.type === "paragraph" && hasText(node.children))
    return (
      <p key={key} className={stylex.props(style.block).className}>
        {textContent(node.children)}
      </p>
    )
  if (node.type === "quote" && hasText(node.children))
    return (
      <blockquote key={key} className={stylex.props(style.block, style.quote).className}>
        {textContent(node.children)}
      </blockquote>
    )
  if (
    node.type === "heading" &&
    hasText(node.children) &&
    Number.isInteger(node.level) &&
    node.level >= 1 &&
    node.level <= 6
  ) {
    const Tag = ({ 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const)[node.level]
    return (
      <Tag key={key} className={stylex.props(style.heading).className}>
        {textContent(node.children)}
      </Tag>
    )
  }
  if (node.type === "list" && Array.isArray(node.items) && node.items.some(hasText)) {
    const Tag = node.ordered ? "ol" : "ul"
    return (
      <Tag key={key} className={stylex.props(style.list, node.ordered ? style.ordered : style.bullet).className}>
        {node.items.filter(hasText).map((item, index) => (
          <li key={index}>{textContent(item)}</li>
        ))}
      </Tag>
    )
  }
  if (node.type === "image") {
    const src = safeUrl(node.src, true)
    return src && typeof node.alt === "string" ? (
      <img
        key={key}
        src={src}
        alt={node.alt}
        width={node.width}
        height={node.height}
        loading="lazy"
        className={stylex.props(style.image).className}
      />
    ) : null
  }
  if (node.type === "break") return <hr key={key} />
  return null
}

export function RichContent({ content, emptyFallback = null, variant = "default", className }: RichContentProps) {
  const nodes = Array.isArray(content) ? content.map(renderNode).filter((node) => node !== null) : []
  return (
    <div
      data-slot="rich-content"
      className={[stylex.props(style.root, variant === "compact" && style.compact).className, className]
        .filter(Boolean)
        .join(" ")}>
      {nodes.length ? nodes : emptyFallback}
    </div>
  )
}
