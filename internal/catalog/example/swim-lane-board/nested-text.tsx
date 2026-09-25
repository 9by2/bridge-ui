import * as UI from "@bridge/ui"

function Ticket({ id, title, detail }: { id: string; title: string; detail: string }) {
  return (
    <UI.SwimLaneBoardItem id={id}>
      <UI.Card size="sm">
        <UI.CardContent>
          <UI.Heading as={UI.WAIHeading.H3}>{title}</UI.Heading>
          <UI.Muted>{detail}</UI.Muted>
          <UI.Small>{id}</UI.Small>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <UI.Badge variant="secondary">Design</UI.Badge>
            <UI.StatusStamp tone="pending">Pending</UI.StatusStamp>
          </div>
        </UI.CardContent>
      </UI.Card>
    </UI.SwimLaneBoardItem>
  )
}

export default function Example() {
  return (
    <UI.Card>
      <UI.CardContent>
        <UI.SwimLaneBoard label="Nested text board" autoCollapse="never">
          <UI.SwimLaneBoardColumn id="todo" label="To do" count={2} />
          <UI.SwimLaneBoardColumn id="progress" label="In progress" count={1} />
          <UI.SwimLaneBoardColumn id="done" label="Done" count={1} />
          <UI.SwimLaneBoardCell columnId="todo">
            <Ticket id="TASK-101" title="Audit tokens" detail="Muted copy nested in Card inside an item." />
            <Ticket id="TASK-102" title="Lane width" detail="Bounded column track." />
          </UI.SwimLaneBoardCell>
          <UI.SwimLaneBoardCell columnId="progress">
            <Ticket id="TASK-103" title="Changeset" detail="Patch release note." />
          </UI.SwimLaneBoardCell>
          <UI.SwimLaneBoardCell columnId="done">
            <Ticket id="TASK-104" title="Spec" detail="Accepted." />
          </UI.SwimLaneBoardCell>
        </UI.SwimLaneBoard>
      </UI.CardContent>
    </UI.Card>
  )
}
