import * as UI from "@bridge/ui"

const cardStyle = { display: "grid", gap: 9 } as const
const metaStyle = {
  display: "flex",
  justifyContent: "space-between",
  color: "var(--bridge-color-muted-foreground)",
  fontSize: 10,
  fontWeight: 700
} as const
const titleStyle = { fontSize: 12, fontWeight: 700, lineHeight: 1.35 } as const
const footStyle = {
  display: "flex",
  justifyContent: "space-between",
  color: "var(--bridge-color-muted-foreground)",
  fontSize: 10
} as const
const tagStyle = {
  padding: "2px 6px",
  borderRadius: 999,
  background: "color-mix(in oklab, var(--bridge-color-primary) 14%, transparent)",
  color: "var(--bridge-color-primary)"
} as const

function Ticket({
  id,
  title,
  tag,
  detail,
  status
}: {
  id: string
  title: string
  tag: string
  detail: string
  status: string
}) {
  return (
    <div style={cardStyle}>
      <div style={metaStyle}>
        <span>{id}</span>
        <span>{status}</span>
      </div>
      <div style={titleStyle}>{title}</div>
      <div style={footStyle}>
        <span style={tagStyle}>{tag}</span>
        <span>{detail}</span>
      </div>
    </div>
  )
}

export default function Example() {
  return (
    <UI.SwimLaneBoard
      label="Platform roadmap"
      autoCollapse="never"
      onItemMove={(intent) => window.alert(JSON.stringify(intent, null, 2))}>
      <UI.SwimLaneBoardColumn id="backlog" label="Backlog" count={3} />
      <UI.SwimLaneBoardColumn id="progress" label="In progress" count={2} />
      <UI.SwimLaneBoardColumn id="review" label="In review" count={1} />
      <UI.SwimLaneBoardColumn id="done" label="Done" count={2} />
      <UI.SwimLaneBoardLane id="api" label="API reliability" count={4}>
        <UI.SwimLaneBoardCell columnId="backlog">
          <UI.SwimLaneBoardItem id="PLAT-184">
            <Ticket
              id="PLAT-184"
              title="Retry failed webhook deliveries"
              tag="Backend"
              detail="3 pts · AR"
              status="Urgent"
            />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
        <UI.SwimLaneBoardCell columnId="progress">
          <UI.SwimLaneBoardItem id="PLAT-176">
            <Ticket
              id="PLAT-176"
              title="Expose request trace in API logs"
              tag="Observability"
              detail="2 pts · JM"
              status="Today"
            />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
        <UI.SwimLaneBoardCell columnId="review" />
        <UI.SwimLaneBoardCell columnId="done">
          <UI.SwimLaneBoardItem id="PLAT-151">
            <Ticket
              id="PLAT-151"
              title="Rate limit partner tokens"
              tag="Security"
              detail="5 pts · AR"
              status="Completed"
            />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
      </UI.SwimLaneBoardLane>
      <UI.SwimLaneBoardLane id="experience" label="Developer experience" count={4}>
        <UI.SwimLaneBoardCell columnId="backlog">
          <UI.SwimLaneBoardItem id="PLAT-190">
            <Ticket id="PLAT-190" title="Document package migration" tag="Docs" detail="2 pts · TN" status="Next" />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
        <UI.SwimLaneBoardCell columnId="progress">
          <UI.SwimLaneBoardItem id="PLAT-168">
            <Ticket id="PLAT-168" title="Package export smoke test" tag="Tooling" detail="3 pts · LC" status="Today" />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
        <UI.SwimLaneBoardCell columnId="review">
          <UI.SwimLaneBoardItem id="PLAT-160">
            <Ticket id="PLAT-160" title="Review release automation" tag="Release" detail="2 pts · TN" status="Review" />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
        <UI.SwimLaneBoardCell columnId="done">
          <UI.SwimLaneBoardItem id="PLAT-139">
            <Ticket
              id="PLAT-139"
              title="Align repository lint command"
              tag="Maintenance"
              detail="2 pts · TN"
              status="Completed"
            />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
      </UI.SwimLaneBoardLane>
      <UI.SwimLaneBoardLane id="design" label="Design system" count={0} />
    </UI.SwimLaneBoard>
  )
}
