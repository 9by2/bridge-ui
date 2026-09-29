import { RichContent, type RichContentNode } from "@bridge/ui"

const content: RichContentNode[] = [
  { type: "heading", level: 1, children: [{ type: "text", text: "Long-form reading" }] },
  ...Array.from({ length: 12 }, (_, index): RichContentNode => ({
    type: "paragraph",
    children: [
      {
        type: "text",
        text: `Section ${index + 1}: a longer paragraph about composing readable documents with accessible text, wrapping links and predictable spacing on narrow screens. `.repeat(
          3
        )
      }
    ]
  })),
  { type: "quote", children: [{ type: "text", text: "Make it easy to read." }] }
]

export default function Example() {
  return <RichContent content={content} />
}
