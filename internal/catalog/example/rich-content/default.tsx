import { RichContent } from "@bridge/ui"

export default function Example() {
  return (
    <RichContent
      content={[
        { type: "heading", level: 2, children: [{ type: "text", text: "A field guide to better notes" }] },
        {
          type: "paragraph",
          children: [
            {
              type: "text",
              text: "Readable documents belong to everyone. This short example shows the package typography and spacing without application CSS."
            }
          ]
        },
        {
          type: "list",
          ordered: false,
          items: [
            [{ type: "text", text: "Use headings for structure" }],
            [{ type: "text", text: "Link to the source", href: "https://example.org" }]
          ]
        }
      ]}
    />
  )
}
