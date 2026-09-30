import { notify, usePageAction } from "@catalog-prototype/shared/console-shell"
import { GitBranchIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

import * as UI from "@bridge/ui"

type Task = { id: string; title: string; point: number }
const Column = { TODO: "todo", DOING: "doing", REVIEW: "review" } as const
const columnLabel: Record<string, string> = { todo: "To do", doing: "In progress", review: "In review" }
const initialTask: Record<string, Task[]> = {
  [Column.TODO]: [
    { id: "ACME-88", title: "SSO for enterprise tenant", point: 8 },
    { id: "ACME-91", title: "Audit log export", point: 3 }
  ],
  [Column.DOING]: [{ id: "ACME-84", title: "Usage-based billing meter", point: 5 }],
  [Column.REVIEW]: [{ id: "ACME-79", title: "Role permission matrix", point: 3 }]
}
const milestone = [
  { title: "Discovery", time: "2026-08-04", label: "4 Aug", state: "completed" },
  { title: "Beta", time: "2026-09-15", label: "15 Sep", state: "current" },
  { title: "General availability", time: "2026-10-20", label: "20 Oct", state: "upcoming" }
] as const

function TaskDetail({ task }: { task: Task }) {
  return (
    <UI.Drawer swipeDirection="right">
      <UI.DrawerTrigger render={<UI.Button variant="ghost" size="sm" />}>Detail</UI.DrawerTrigger>
      <UI.DrawerContent>
        <UI.DrawerHeader>
          <UI.DrawerTitle>{task.title}</UI.DrawerTitle>
          <UI.DrawerDescription>
            {task.id} · {task.point} point
          </UI.DrawerDescription>
        </UI.DrawerHeader>
        <UI.DrawerFooter>
          <UI.DrawerClose render={<UI.Button variant="outline" />}>Close</UI.DrawerClose>
        </UI.DrawerFooter>
      </UI.DrawerContent>
    </UI.Drawer>
  )
}

function TaskCard({ task }: { task: Task }) {
  return (
    <UI.ContextMenu>
      <UI.ContextMenuTrigger>
        <TaskHandle task={task} />
      </UI.ContextMenuTrigger>
      <UI.ContextMenuContent>
        <UI.ContextMenuItem onClick={() => notify.info(`${task.id} link copied`)}>Copy link</UI.ContextMenuItem>
        <UI.ContextMenuSub>
          <UI.ContextMenuSubTrigger>Estimate</UI.ContextMenuSubTrigger>
          <UI.ContextMenuSubContent>
            <UI.ContextMenuRadioGroup value={String(task.point)}>
              {["1", "3", "5", "8"].map((value) => (
                <UI.ContextMenuRadioItem key={value} value={value}>
                  {value} point
                </UI.ContextMenuRadioItem>
              ))}
            </UI.ContextMenuRadioGroup>
          </UI.ContextMenuSubContent>
        </UI.ContextMenuSub>
        <UI.ContextMenuSeparator />
        <UI.ContextMenuItem variant="destructive">Delete</UI.ContextMenuItem>
      </UI.ContextMenuContent>
    </UI.ContextMenu>
  )
}

function TaskHandle({ task }: { task: Task }) {
  return (
    <UI.KanbanItemHandle>
      <UI.Item size="sm" variant="outline">
        <UI.ItemContent>
          <UI.ItemTitle>{task.title}</UI.ItemTitle>
          <UI.ItemDescription>{task.id}</UI.ItemDescription>
        </UI.ItemContent>
        <UI.ItemActions>
          <UI.Badge variant="secondary">{task.point}</UI.Badge>
          <TaskDetail task={task} />
        </UI.ItemActions>
      </UI.Item>
    </UI.KanbanItemHandle>
  )
}

function SprintBoard() {
  const [value, setValue] = useState(initialTask)
  return (
    <UI.Kanban
      value={value}
      onValueChange={setValue}
      getItemValue={(task) => task.id}
      onMove={(event) => notify.info(`Moved ${String(event.activeContainer)} → ${String(event.overContainer)}`)}>
      <UI.KanbanBoard>
        {Object.entries(value).map(([column, task]) => (
          <UI.KanbanColumn key={column} value={column}>
            <UI.KanbanColumnHandle>
              <UI.TypographyLabel>
                {columnLabel[column]} ({task.length})
              </UI.TypographyLabel>
            </UI.KanbanColumnHandle>
            <UI.KanbanColumnContent value={column} aria-label={`Drop task in ${columnLabel[column]}`}>
              {task.map((item) => (
                <UI.KanbanItem key={item.id} value={item.id}>
                  <TaskCard task={item} />
                </UI.KanbanItem>
              ))}
            </UI.KanbanColumnContent>
          </UI.KanbanColumn>
        ))}
      </UI.KanbanBoard>
      <UI.KanbanOverlay>
        {({ value: id }) => {
          const task = Object.values(value)
            .flat()
            .find((item) => item.id === id)
          return task ? (
            <UI.KanbanItem value={task.id}>
              <TaskCard task={task} />
            </UI.KanbanItem>
          ) : null
        }}
      </UI.KanbanOverlay>
    </UI.Kanban>
  )
}

function Roadmap() {
  return (
    <UI.SwimLaneBoard label="Quarter roadmap" autoCollapse="never">
      <UI.SwimLaneBoardColumn id="q3" label="Q3" count={2} />
      <UI.SwimLaneBoardColumn id="q4" label="Q4" count={2} />
      <UI.SwimLaneBoardLane id="core" label="Core platform" count={2}>
        <UI.SwimLaneBoardCell columnId="q3">
          <UI.SwimLaneBoardItem id="road-1">
            <UI.TypographyLabel>Multi-region failover</UI.TypographyLabel>
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
        <UI.SwimLaneBoardCell columnId="q4">
          <UI.SwimLaneBoardItem id="road-2">
            <UI.TypographyLabel>Data residency EU</UI.TypographyLabel>
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
      </UI.SwimLaneBoardLane>
      <UI.SwimLaneBoardLane id="growth" label="Growth" count={2}>
        <UI.SwimLaneBoardCell columnId="q3">
          <UI.SwimLaneBoardItem id="road-3">
            <UI.TypographyLabel>Self-serve upgrade</UI.TypographyLabel>
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
        <UI.SwimLaneBoardCell columnId="q4">
          <UI.SwimLaneBoardItem id="road-4">
            <UI.TypographyLabel>Referral program</UI.TypographyLabel>
          </UI.SwimLaneBoardItem>
        </UI.SwimLaneBoardCell>
      </UI.SwimLaneBoardLane>
    </UI.SwimLaneBoard>
  )
}

function Milestone() {
  return (
    <UI.TimelineStep orientation="horizontal" aria-label="Release milestone">
      {milestone.map((item, index) => (
        <UI.TimelineStepItem key={item.title} orientation="horizontal" state={item.state}>
          <UI.TimelineStepHeader>
            <UI.TimelineStepIndicator tone={item.state === "completed" ? "primary" : "outline"}>
              {index + 1}
            </UI.TimelineStepIndicator>
            <UI.TimelineStepTitle>{item.title}</UI.TimelineStepTitle>
          </UI.TimelineStepHeader>
          {index < milestone.length - 1 ? (
            <UI.TimelineStepConnector orientation="horizontal" state={item.state} />
          ) : null}
          <UI.TimelineStepContent>
            <UI.TimelineStepDescription>Target date</UI.TimelineStepDescription>
            <UI.TimelineStepTime dateTime={item.time}>{item.label}</UI.TimelineStepTime>
          </UI.TimelineStepContent>
        </UI.TimelineStepItem>
      ))}
    </UI.TimelineStep>
  )
}

export function ProjectPage() {
  usePageAction(
    <UI.Button onClick={() => notify.success("Task ACME-92 created")}>
      <PlusIcon aria-hidden="true" />
      New task
    </UI.Button>
  )
  return (
    <UI.Page width={UI.PageWidth.full}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageEyebrow>Acme Cloud</UI.PageEyebrow>
          <UI.PageTitle>Sprint 42</UI.PageTitle>
          <UI.PageMeta>
            <GitBranchIcon aria-hidden="true" />
            <span>release/2026.10</span>
          </UI.PageMeta>
        </UI.PageHeading>
      </UI.PageHeader>
      <UI.Tabs defaultValue="board">
        <UI.PageToolbar aria-label="Project view">
          <UI.TabsList variant="line">
            <UI.TabsTrigger value="board">Board</UI.TabsTrigger>
            <UI.TabsTrigger value="roadmap">Roadmap</UI.TabsTrigger>
            <UI.TabsTrigger value="milestone">Milestone</UI.TabsTrigger>
          </UI.TabsList>
        </UI.PageToolbar>
        <UI.PageContent>
          <UI.DataList
            status={UI.DataListStatus.ready}
            variants={UI.DataListVariant.card}
            framed={false}
            columns={[{ id: "task", label: "Featured task", render: (task: Task) => task.title }]}
            rows={initialTask[Column.TODO]?.slice(0, 1) ?? []}
            rowKey={(task) => task.id}
          />
          <UI.TabsContent value="board">
            <SprintBoard />
          </UI.TabsContent>
          <UI.TabsContent value="roadmap">
            <Roadmap />
          </UI.TabsContent>
          <UI.TabsContent value="milestone">
            <Milestone />
          </UI.TabsContent>
        </UI.PageContent>
      </UI.Tabs>
    </UI.Page>
  )
}
