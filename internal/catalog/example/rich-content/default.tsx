import { RichContent } from "@bridge/ui"

export default function Example() {
  return (
    <RichContent
      content={[
        { type: "heading", level: 2, children: [{ type: "text", text: "A field guide to better notes" }] },
        {
          type: "paragraph",
          children: [
            { type: "text", text: "Readable documents belong to everyone. Mix " },
            { type: "text", text: "bold", bold: true },
            { type: "text", text: ", " },
            { type: "text", text: "italic", italic: true },
            { type: "text", text: ", " },
            { type: "text", text: "underline", underline: true },
            { type: "text", text: ", " },
            { type: "text", text: "strike", strike: true },
            { type: "text", text: ", and " },
            { type: "text", text: "bun test", code: true, copyable: true },
            { type: "text", text: " inline." }
          ]
        },
        {
          type: "list",
          ordered: false,
          items: [
            [{ type: "text", text: "Use headings for structure" }],
            [
              { type: "text", text: "Link to the " },
              { type: "text", text: "external source", href: "https://example.org", external: true }
            ]
          ]
        },
        { type: "horizontalRule" },
        {
          type: "paragraph",
          align: "center",
          children: [{ type: "text", text: "Centered closing note.", italic: true }]
        }
      ]}
    />
  )
}
