import { RichContent } from "@bridge/ui"

export default function Example() {
  return (
    <RichContent
      content={[
        {
          type: "list",
          ordered: true,
          items: [
            {
              blocks: [
                { type: "paragraph", children: [{ type: "text", text: "Prepare the workspace", bold: true }] },
                {
                  type: "paragraph",
                  children: [{ type: "text", text: "Each step may hold paragraphs and nested lists." }]
                },
                {
                  type: "list",
                  ordered: false,
                  items: [
                    [{ type: "text", text: "Install Bun" }],
                    {
                      children: [{ type: "text", text: "Clone the repository" }],
                      blocks: [
                        {
                          type: "list",
                          ordered: false,
                          items: [[{ type: "text", text: "Use SSH" }], [{ type: "text", text: "Or HTTPS" }]]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            { children: [{ type: "text", text: "Run the checks" }] },
            [{ type: "text", text: "Open a merge request" }]
          ]
        },
        {
          type: "quote",
          blocks: [
            { type: "paragraph", children: [{ type: "text", text: "Quotes can contain blocks too:" }] },
            { type: "list", ordered: false, items: [[{ type: "text", text: "one" }], [{ type: "text", text: "two" }]] }
          ]
        }
      ]}
    />
  )
}
