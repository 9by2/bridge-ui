import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { useState } from "react"

import * as UI from "@bridge/ui"

type Job = { id: string; title: string; owner: string }
const QueueColumn = { WAITING: "waiting", PROCESSING: "processing", DONE: "done" } as const
const columnLabel: Record<string, string> = { waiting: "Waiting", processing: "Processing", done: "Done" }
const initialJob: Record<string, Job[]> = {
  [QueueColumn.WAITING]: [
    { id: "Q-5120", title: "Import Spotify statement Aug", owner: "TN" },
    { id: "Q-5121", title: "Map artist ID for Polycat", owner: "AR" }
  ],
  [QueueColumn.PROCESSING]: [{ id: "Q-5117", title: "Monthly breakdown Jul", owner: "JM" }],
  [QueueColumn.DONE]: [{ id: "Q-5102", title: "Daily detail sync", owner: "TN" }]
}

function JobCard({ job }: { job: Job }) {
  return (
    <UI.KanbanItemHandle>
      <UI.Item size="sm">
        <UI.ItemContent>
          <UI.ItemTitle>{job.title}</UI.ItemTitle>
          <UI.ItemDescription>{job.id}</UI.ItemDescription>
        </UI.ItemContent>
        <UI.ItemActions>
          <UI.Avatar size="sm">
            <UI.AvatarFallback>{job.owner}</UI.AvatarFallback>
          </UI.Avatar>
        </UI.ItemActions>
      </UI.Item>
    </UI.KanbanItemHandle>
  )
}

function QueueBoard() {
  const [value, setValue] = useState(initialJob)
  return (
    <UI.Kanban value={value} onValueChange={setValue} getItemValue={(job) => job.id}>
      <UI.KanbanBoard>
        {Object.entries(value).map(([column, job]) => (
          <UI.KanbanColumn key={column} value={column}>
            <UI.Marker variant="border">
              <UI.MarkerContent>
                {columnLabel[column]} · {job.length}
              </UI.MarkerContent>
            </UI.Marker>
            <UI.KanbanColumnContent value={column} aria-label={`Drop job in ${column}`}>
              {job.map((item) => (
                <UI.KanbanItem key={item.id} value={item.id}>
                  <JobCard job={item} />
                </UI.KanbanItem>
              ))}
            </UI.KanbanColumnContent>
          </UI.KanbanColumn>
        ))}
      </UI.KanbanBoard>
      <UI.KanbanOverlay>
        {({ value: id }) => {
          const job = Object.values(value)
            .flat()
            .find((item) => item.id === id)
          return job ? (
            <UI.KanbanItem value={job.id}>
              <JobCard job={job} />
            </UI.KanbanItem>
          ) : null
        }}
      </UI.KanbanOverlay>
    </UI.Kanban>
  )
}

function Ticket({ id, title, detail }: { id: string; title: string; detail: string }) {
  return (
    <div className="grid grid-cols-1 gap-1">
      <UI.Small>{id}</UI.Small>
      <UI.TypographyLabel>{title}</UI.TypographyLabel>
      <UI.Muted>{detail}</UI.Muted>
    </div>
  )
}

function IntegrationLane() {
  return (
    <UI.SwimLaneBoard label="Integration roadmap" onItemMove={(intent) => notify.info(`Move ${intent.itemId}`)}>
      <UI.SwimLaneBoardColumn id="backlog" label="Backlog" count={2} />
      <UI.SwimLaneBoardColumn id="progress" label="In progress" count={1} />
      <UI.SwimLaneBoardColumn id="done" label="Done" count={1} />
      <UI.SwimLaneBoardLane id="backstage" label="Backstage API" count={3}>
        <UI.SwimLaneBoardCell columnId="backlog">
          <UI.SwimLaneBoardItem id="BS-41">
            <Ticket id="BS-41" title="Retry failed royalty import" detail="3 pts · AR" />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
        <UI.SwimLaneBoardCell columnId="progress">
          <UI.SwimLaneBoardItem id="BS-38">
            <Ticket id="BS-38" title="Musician mapping v2" detail="5 pts · JM" />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
        <UI.SwimLaneBoardCell columnId="done">
          <UI.SwimLaneBoardItem id="BS-30">
            <Ticket id="BS-30" title="YTD earning widget" detail="2 pts · TN" />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
      </UI.SwimLaneBoardLane>
      <UI.SwimLaneBoardLane id="ticketing" label="Ticketing" count={1}>
        <UI.SwimLaneBoardCell columnId="backlog">
          <UI.SwimLaneBoardItem id="TK-12">
            <Ticket id="TK-12" title="QR gate scan offline mode" detail="8 pts · LC" />
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
      </UI.SwimLaneBoardLane>
    </UI.SwimLaneBoard>
  )
}

function RetryDrawer() {
  return (
    <UI.Drawer>
      <UI.DrawerTrigger render={<UI.Button variant="outline" />}>Failed job (2)</UI.DrawerTrigger>
      <UI.DrawerContent>
        <UI.DrawerHeader>
          <UI.DrawerTitle>Failed job</UI.DrawerTitle>
          <UI.DrawerDescription>Retry or dismiss job that failed in the last 24 hours.</UI.DrawerDescription>
        </UI.DrawerHeader>
        <div className="grid grid-cols-1 gap-3 px-4">
          <UI.Alert variant="destructive">
            <UI.AlertTitle>Q-5099 · Apple Music import</UI.AlertTitle>
            <UI.AlertDescription>Statement file checksum mismatch.</UI.AlertDescription>
          </UI.Alert>
          <UI.Alert variant="warning">
            <UI.AlertTitle>Q-5101 · Joox import</UI.AlertTitle>
            <UI.AlertDescription>Rate limited; retry after 10 minutes.</UI.AlertDescription>
          </UI.Alert>
        </div>
        <UI.DrawerFooter>
          <UI.Button onClick={() => notify.success("2 job queued for retry")}>Retry all</UI.Button>
          <UI.DrawerClose render={<UI.Button variant="outline" />}>Close</UI.DrawerClose>
        </UI.DrawerFooter>
      </UI.DrawerContent>
    </UI.Drawer>
  )
}

export function QueuePage() {
  usePageAction(<RetryDrawer />)
  return (
    <UI.Page width={UI.PageWidth.full}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>Backstage queue</UI.PageTitle>
          <UI.PageDescription>
            Drag a job between column. Keyboard: focus a handle, Space, arrow, Space.
          </UI.PageDescription>
        </UI.PageHeading>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-8">
          <QueueBoard />
          <UI.Separator />
          <IntegrationLane />
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}
