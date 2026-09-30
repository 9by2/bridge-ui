import * as UI from "@bridge/ui"

const row = { name: "Riverlight Festival", date: "28 November 2026", venue: "Bangkok Riverside" }
const columns = [
  {
    id: "name",
    label: "Proposal",
    render: (item: typeof row) => <UI.TableCellStack primary={item.name} secondary="Concert · Bridge Musician" />
  },
  { id: "date", label: "Date", render: (item: typeof row) => item.date },
  { id: "venue", label: "Venue", render: (item: typeof row) => <UI.TableCellValue>{item.venue}</UI.TableCellValue> },
  {
    id: "action",
    label: "Actions",
    render: () => (
      <UI.TableCellAction>
        <UI.Button size="sm" variant="outline">
          View
        </UI.Button>
      </UI.TableCellAction>
    )
  }
] as const

export default function Example() {
  return (
    <UI.DataList
      title="Inform decision status"
      description="Status is translated into the next action this event organizer should understand."
      status={UI.DataListStatus.ready}
      variants={UI.DataListVariant.auto}
      columns={columns}
      rows={[row]}
      rowKey={(item) => item.name}
    />
  )
}
