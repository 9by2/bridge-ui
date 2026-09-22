import * as UI from "@bridge/ui"

const ItemList = Array.from({ length: 12 }, (_, index) => ({
  id: `QUEUE-${index + 1}`,
  title: `Queued item ${index + 1}`
}))

export default function Example() {
  return (
    <UI.SwimLaneBoard label="Scrollable queue" autoCollapse="never" rowMaxHeight="260px">
      <UI.SwimLaneBoardColumn id="queue" label="Queue" count={ItemList.length} />
      <UI.SwimLaneBoardColumn id="active" label="Active" count={1} />
      <UI.SwimLaneBoardLane id="priority" label="Priority" count={ItemList.length + 1}>
        <UI.SwimLaneBoardCell columnId="queue">
          {ItemList.map((item) => (
            <UI.SwimLaneBoardItem key={item.id} id={item.id}>
              {item.title}
            </UI.SwimLaneBoardItem>
          ))}
        </UI.SwimLaneBoardCell>
        <UI.SwimLaneBoardCell columnId="active">
          <UI.SwimLaneBoardItem id="QUEUE-ACTIVE">Active item</UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
      </UI.SwimLaneBoardLane>
    </UI.SwimLaneBoard>
  )
}
