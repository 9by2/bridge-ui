import { RichContent } from "@bridge/ui"

export default function Example() {
  return (
    <RichContent
      labels={{ code: "Code", copyCode: "Copy code", copiedCode: "Copied" }}
      content={[
        { type: "heading", level: 3, children: [{ type: "text", text: "Install" }] },
        {
          type: "paragraph",
          children: [
            { type: "text", text: "Run " },
            { type: "text", text: "bun add @bridge/ui", code: true, copyable: true },
            { type: "text", text: " then import the stylesheet." }
          ]
        },
        {
          type: "codeBlock",
          language: "tsx",
          code: 'import { RichContent } from "@bridge/ui/rich-content"\nimport "@bridge/ui/style.css"\n\nexport function Article({ nodes }: { nodes: RichContentNode[] }) {\n  return <RichContent content={nodes} emptyFallback="No content" />\n}'
        },
        {
          type: "codeBlock",
          code: "a-very-long-single-line-command --with-many-flags --that-should-scroll-horizontally --instead-of-overflowing-the-page --on-narrow-screens"
        },
        { type: "codeBlock", code: "Read-only snippet without copy action", copyable: false }
      ]}
    />
  )
}
