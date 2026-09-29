import type { RichContentNode } from "@bridge/ui"

const text = (value: string, mark: Record<string, unknown> = {}) => ({ type: "text" as const, text: value, ...mark })

/** Representative contract template, as an application Tiptap mapper would produce it. */
export const contractContent: RichContentNode[] = [
  { type: "heading", level: 1, align: "center", children: [text("Employment Agreement")] },
  {
    type: "paragraph",
    align: "justify",
    children: [
      text("This agreement is made between "),
      text("Bridge Co., Ltd.", { bold: true }),
      text(" (the “Company”) and "),
      text("Nara Wongsa", { bold: true }),
      text(" (the “Employee”). สัญญาฉบับนี้ทำขึ้นระหว่างบริษัทและพนักงาน")
    ]
  },
  { type: "heading", level: 2, children: [text("1. Position and duties")] },
  {
    type: "list",
    ordered: true,
    items: [
      [text("The Employee is appointed as "), text("Senior Engineer", { italic: true }), text(".")],
      {
        children: [text("Duties include:")],
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [[text("Design and build product features")], [text("Review code")]]
          }
        ]
      }
    ]
  },
  { type: "heading", level: 2, children: [text("2. Compensation")] },
  {
    type: "table",
    columnWidths: [40, 30, 30],
    rows: [
      {
        cells: [
          { header: true, children: [text("Item")] },
          { header: true, children: [text("Monthly")] },
          { header: true, children: [text("Annual")] }
        ]
      },
      { cells: [{ children: [text("Base salary")] }, { children: [text("80,000")] }, { children: [text("960,000")] }] },
      { cells: [{ children: [text("Allowance")] }, { colSpan: 2, children: [text("Per company policy")] }] }
    ]
  },
  {
    type: "quote",
    children: [text("Confidential information stays confidential after employment ends.")]
  },
  { type: "pageBreak" },
  { type: "heading", level: 2, children: [text("3. Signatures")] },
  { type: "paragraph", children: [text("Signed by both parties on the date below.")] },
  {
    type: "image",
    src: "https://placehold.co/480x160/ffffff/000000?text=Signature",
    alt: "Company signature",
    width: 480,
    height: 160,
    align: "right",
    displayWidth: "40%"
  },
  { type: "horizontalRule" },
  { type: "paragraph", align: "right", children: [text("Date: 29 September 2026")] }
]
