import { ResponsiveImage } from "@cue/web/app/component/global/responsive-image.component"
import { SocialEmbedComponent } from "@cue/web/app/component/global/social-embed.component"
import { UnknownTextDirectiveLiteral } from "@cue/web/shared/lib/markdown-directive"
import { ReadSocialEmbedDirective } from "@cue/web/shared/lib/social-embed"
import { slugify } from "@cue/web/shared/lib/string"
import { Children, isValidElement, type ReactNode } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkDirective from "remark-directive"
import remarkGfm from "remark-gfm"
import { visit } from "unist-util-visit"

export interface MarkdownPreviewComponentProps {
  readonly markdown: string
}

// react-markdown's `Components` type only accepts real HTML tag names, so the directive maps
// onto a plain `<div data-social-embed-platform="..." data-social-embed-url="...">` and the `div`
// override below reads those attributes back out.
const SocialEmbedHastTag = "div"
const SocialEmbedPlatformAttribute = "data-social-embed-platform"
const SocialEmbedUrlAttribute = "data-social-embed-url"

export function MarkdownPreviewComponent({ markdown }: MarkdownPreviewComponentProps) {
  return (
    <div className="markdown-preview">
      <ReactMarkdown
        components={MarkdownComponents}
        remarkPlugins={[remarkGfm, remarkBreaks, remarkDirective, RemarkSocialEmbedDirective]}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

/**
 * Remark transform: maps a recognized `::embed[url]{platform="..."}` leaf directive onto a
 * `<social-embed>` hast node carrying `platform`/`url` props, read back out by the `social-embed`
 * entry in `MarkdownComponents` below — keeps the read-only preview in parity with the editor's
 * `SocialEmbedDirectiveDescriptor` for the same directive shape (`shared/lib/social-embed.ts`).
 */
function RemarkSocialEmbedDirective() {
  return (tree: unknown, file: { readonly value: unknown }) => {
    visit(tree as Parameters<typeof visit>[0], (node, index, parent) => {
      const embed = ReadSocialEmbedDirective(node as never)
      if (embed) {
        const directiveNode = node as { data?: { hName?: string; hProperties?: Record<string, string> } }
        directiveNode.data ??= {}
        directiveNode.data.hName = SocialEmbedHastTag
        directiveNode.data.hProperties = {
          [SocialEmbedPlatformAttribute]: embed.platform,
          [SocialEmbedUrlAttribute]: embed.url
        }
        return
      }

      if (node.type !== "textDirective" || typeof index !== "number" || !parent) return

      const directiveParent = parent as unknown as { children: Array<{ type: string; value?: string }> }
      directiveParent.children[index] = {
        type: "text",
        value: UnknownTextDirectiveLiteral(node, String(file.value))
      }
    })
  }
}

const MarkdownComponents = {
  a: ({ href, children, node: _node, ...props }) => {
    const externalLinkProps = IsExternalHref(href) ? { target: "_blank", rel: "noreferrer" } : {}

    return (
      <a href={href} {...externalLinkProps} {...props}>
        {children}
      </a>
    )
  },
  div: ({ node: _node, children, ...props }) => {
    const attributes = props as Record<string, unknown>
    const embedPlatform = attributes[SocialEmbedPlatformAttribute]
    const embedUrl = attributes[SocialEmbedUrlAttribute]
    if (typeof embedPlatform === "string" && typeof embedUrl === "string") {
      return <SocialEmbedComponent platform={embedPlatform as never} url={embedUrl} />
    }

    return <div {...props}>{children}</div>
  },
  img: ({ node: _node, src, alt, title }) => {
    if (!src) return null

    return (
      <ResponsiveImage
        src={src}
        alt={alt ?? ""}
        title={title}
        loading="lazy"
        sizes="100vw"
        className="h-auto w-full rounded-lg"
      />
    )
  },
  h1: ({ children, node: _node, ...props }) => (
    <h1 id={CreateHeadingId(children)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, node: _node, ...props }) => (
    <h2 id={CreateHeadingId(children)} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, node: _node, ...props }) => (
    <h3 id={CreateHeadingId(children)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, node: _node, ...props }) => (
    <h4 id={CreateHeadingId(children)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, node: _node, ...props }) => (
    <h5 id={CreateHeadingId(children)} {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, node: _node, ...props }) => (
    <h6 id={CreateHeadingId(children)} {...props}>
      {children}
    </h6>
  )
} satisfies Components

function CreateHeadingId(children: ReactNode): string {
  return slugify(ReactNodeText(children))
}

function ReactNodeText(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") return String(child)
      if (isValidElement<{ readonly children?: ReactNode }>(child)) return ReactNodeText(child.props.children)
      return ""
    })
    .join(" ")
}

function IsExternalHref(href: string | undefined): boolean {
  if (!href) return false
  if (href.startsWith("/") || href.startsWith("#")) return false

  try {
    const url = new URL(href, CurrentOrigin())
    return IsHttpUrl(url) && url.origin !== CurrentOrigin()
  } catch {
    return false
  }
}

function CurrentOrigin(): string {
  return globalThis.location?.origin ?? "http://localhost"
}

function IsHttpUrl(url: URL): boolean {
  return url.protocol === "http:" || url.protocol === "https:"
}
