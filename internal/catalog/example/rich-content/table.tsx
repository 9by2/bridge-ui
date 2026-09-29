import { RichContent, type RichContentTableRow } from "@bridge/ui"

const cell = (text: string, extra: Partial<RichContentTableRow["cells"][number]> = {}) => ({
  children: [{ type: "text" as const, text }],
  ...extra
})

const rows: RichContentTableRow[] = [
  {
    cells: [
      cell("Plan", { header: true }),
      cell("Monthly", { header: true }),
      cell("Annual", { header: true }),
      cell("Notes", { header: true })
    ]
  },
  { cells: [cell("Starter", { header: true }), cell("฿290"), cell("฿2,900"), cell("Single seat", { rowSpan: 2 })] },
  { cells: [cell("Team", { header: true }), cell("฿990"), cell("฿9,900")] },
  {
    cells: [
      cell("Enterprise", { header: true }),
      cell("Contact sales for volume pricing and a custom agreement", { colSpan: 2 }),
      {
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [[{ type: "text", text: "SSO" }], [{ type: "text", text: "Audit log" }]]
          }
        ]
      }
    ]
  }
]

export default function Example() {
  return (
    <RichContent
      labels={{ table: "Pricing table" }}
      content={[
        { type: "heading", level: 3, children: [{ type: "text", text: "Pricing" }] },
        { type: "table", columnWidths: [20, 20, 20, 40], rows },
        { type: "pageBreak" },
        {
          type: "table",
          rows: Array.from({ length: 4 }, (_, row) => ({
            cells: Array.from({ length: 8 }, (__, column) =>
              cell(row === 0 ? `Column ${column + 1}` : `Value ${row}.${column + 1}`, { header: row === 0 })
            )
          }))
        }
      ]}
    />
  )
}
