import { useState } from "react"

import * as UI from "@bridge/ui"

type Item = { id: string; title: string }
type Value = Record<string, Item[]>

const initialValue: Value = {
  todo: [
    { id: "SORT-1", title: "First sortable item" },
    { id: "SORT-2", title: "Second sortable item" }
  ],
  done: [{ id: "SORT-3", title: "Completed item" }],
  empty: []
}

export default function Example() {
  const [value, setValue] = useState(initialValue)

  return (
    <UI.SwimLaneBoard
      label="Sortable workflow"
      autoCollapse="never"
      onItemMove={(intent) => {
        window.alert(JSON.stringify(intent, null, 2))
        const { itemId, source, destination } = intent
        setValue((current) => {
          const sourceItem = current[source.columnId]?.find((item) => item.id === itemId)
          if (!sourceItem) return current
          const next: Value = {
            ...current,
            [source.columnId]: current[source.columnId]?.filter((item) => item.id !== itemId) ?? [],
            [destination.columnId]: [...(current[destination.columnId] ?? [])]
          }
          next[destination.columnId]?.splice(destination.index, 0, sourceItem)
          return next
        })
      }}>
      <UI.SwimLaneBoardColumn id="todo" label="Todo" count={value.todo?.length ?? 0} />
      <UI.SwimLaneBoardColumn id="done" label="Done" count={value.done?.length ?? 0} />
      <UI.SwimLaneBoardColumn id="empty" label="Empty" count={value.empty?.length ?? 0} />
      <UI.SwimLaneBoardCell columnId="todo">
        {value.todo?.map((item) => (
          <UI.SwimLaneBoardItem key={item.id} id={item.id}>
            {item.title}
          </UI.SwimLaneBoardItem>
        ))}
      </UI.SwimLaneBoardCell>
      <UI.SwimLaneBoardCell columnId="done">
        {value.done?.map((item) => (
          <UI.SwimLaneBoardItem key={item.id} id={item.id}>
            {item.title}
          </UI.SwimLaneBoardItem>
        ))}
      </UI.SwimLaneBoardCell>
      <UI.SwimLaneBoardCell columnId="empty">
        {value.empty?.map((item) => (
          <UI.SwimLaneBoardItem key={item.id} id={item.id}>
            {item.title}
          </UI.SwimLaneBoardItem>
        ))}
      </UI.SwimLaneBoardCell>
    </UI.SwimLaneBoard>
  )
}
