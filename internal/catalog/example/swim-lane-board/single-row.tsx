import * as UI from "@bridge/ui"

const leadStyle = { display: "grid", gap: 8 } as const
const leadMetaStyle = {
  display: "flex",
  justifyContent: "space-between",
  color: "var(--bridge-color-muted-foreground)",
  fontSize: 10
} as const
const leadTitleStyle = { fontSize: 12, fontWeight: 700 } as const

function Lead({ id, title, value }: { id: string; title: string; value: string }) {
  return (
    <UI.SwimLaneBoardItem id={id}>
      <div style={leadStyle}>
        <div style={leadMetaStyle}>
          <strong>{id}</strong>
          <span>{value}</span>
        </div>
        <div style={leadTitleStyle}>{title}</div>
      </div>
    </UI.SwimLaneBoardItem>
  )
}

export default function Example() {
  return (
    <UI.SwimLaneBoard label="CRM inbox">
      <UI.SwimLaneBoardColumn id="inbox" label="Inbox" count={12} />
      <UI.SwimLaneBoardColumn id="triage" label="Triage" count={6} />
      <UI.SwimLaneBoardColumn id="qualified" label="Qualified" count={8} />
      <UI.SwimLaneBoardColumn id="discovery" label="Discovery" count={4} />
      <UI.SwimLaneBoardColumn id="proposal" label="Proposal" count={3} />
      <UI.SwimLaneBoardColumn id="negotiation" label="Negotiation" count={2} />
      <UI.SwimLaneBoardColumn id="won" label="Won" count={17} />
      <UI.SwimLaneBoardColumn id="lost" label="Lost" count={0} />
      <UI.SwimLaneBoardCell columnId="inbox">
        <Lead id="LEAD-442" title="Studio North" value="$24k" />
      </UI.SwimLaneBoardCell>
      <UI.SwimLaneBoardCell columnId="triage">
        <Lead id="LEAD-437" title="Arcade Events" value="$18k" />
      </UI.SwimLaneBoardCell>
      <UI.SwimLaneBoardCell columnId="qualified">
        <Lead id="LEAD-418" title="Signal House" value="$42k" />
      </UI.SwimLaneBoardCell>
      <UI.SwimLaneBoardCell columnId="discovery">
        <Lead id="DEAL-201" title="Analog Assembly" value="$36k" />
      </UI.SwimLaneBoardCell>
      <UI.SwimLaneBoardCell columnId="proposal">
        <Lead id="DEAL-166" title="Night Shift Collective" value="$28k" />
      </UI.SwimLaneBoardCell>
      <UI.SwimLaneBoardCell columnId="negotiation">
        <Lead id="DEAL-152" title="Field Notes Live" value="$55k" />
      </UI.SwimLaneBoardCell>
      <UI.SwimLaneBoardCell columnId="won">
        <Lead id="DEAL-131" title="Morrow Studio" value="$64k" />
      </UI.SwimLaneBoardCell>
    </UI.SwimLaneBoard>
  )
}
