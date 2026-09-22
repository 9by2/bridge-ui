import { useState } from "react"

import * as UI from "@bridge/ui"

type Task = { id: string; title: string; owner: string }

const initialValue: Record<string, Task[]> = {
  backlog: [
    { id: "WEB-184", title: "Consolidate UI package exports", owner: "TN" },
    { id: "WEB-191", title: "Review accessibility states", owner: "AR" }
  ],
  progress: [{ id: "WEB-176", title: "Publish component catalog", owner: "JM" }],
  done: [{ id: "WEB-151", title: "Define package release gate", owner: "TN" }]
}

const columnStyle = {
  display: "flex",
  flexDirection: "column",
  padding: 12,
  borderRadius: 12,
  background: "var(--bridge-color-muted)",
  minHeight: 320
} as const
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 12,
  fontSize: 12,
  fontWeight: 700
} as const
const cardStyle = { padding: 12, borderRadius: 10, background: "var(--bridge-color-surface)", fontSize: 12 } as const

export default function Example() {
  const [value, setValue] = useState(initialValue)
  return (
    <UI.Kanban value={value} onValueChange={setValue} getItemValue={(task) => task.id}>
      <UI.KanbanBoard style={{ gridTemplateColumns: "repeat(3, minmax(200px, 1fr))" }}>
        {Object.entries(value).map(([columnId, tasks]) => (
          <UI.KanbanColumn key={columnId} value={columnId} style={columnStyle}>
            <div style={headerStyle}>
              <span>{columnId}</span>
              <span>{tasks.length}</span>
            </div>
            <UI.KanbanColumnContent value={columnId} aria-label={`Drop tasks in ${columnId}`}>
              {tasks.map((task) => (
                <UI.KanbanItem key={task.id} value={task.id} style={cardStyle}>
                  <UI.KanbanItemHandle>
                    {task.id}: {task.title} ({task.owner})
                  </UI.KanbanItemHandle>
                </UI.KanbanItem>
              ))}
            </UI.KanbanColumnContent>
          </UI.KanbanColumn>
        ))}
      </UI.KanbanBoard>
      <UI.KanbanOverlay>
        {({ value: itemId }) => {
          const task = Object.values(value)
            .flat()
            .find((candidate) => candidate.id === itemId)
          return task ? (
            <UI.KanbanItem value={task.id} style={cardStyle}>
              <UI.KanbanItemHandle cursor={false}>
                {task.id}: {task.title} ({task.owner})
              </UI.KanbanItemHandle>
            </UI.KanbanItem>
          ) : null
        }}
      </UI.KanbanOverlay>
    </UI.Kanban>
  )
}
