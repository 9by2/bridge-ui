import { useState } from "react"

import * as UI from "@bridge/ui"

function ScheduleRoute() {
  UI.useShellHeaderAction(<UI.Button size="sm">New event</UI.Button>)
  return <p className="p-4 text-sm">Schedule route publishes “New event”.</p>
}

function ReportRoute() {
  UI.useShellHeaderAction(
    <UI.Button size="sm" variant="outline">
      Export
    </UI.Button>
  )
  return <p className="p-4 text-sm">Report route publishes “Export”.</p>
}

const Route = { schedule: "schedule", report: "report", none: "none" } as const
type Route = (typeof Route)[keyof typeof Route]

export default function Example() {
  const [route, setRoute] = useState<Route>(Route.schedule)
  return (
    <UI.ShellHeaderActionProvider>
      <div className="w-full rounded border">
        <UI.ShellHeader>
          <UI.ShellHeaderTitle>Studio</UI.ShellHeaderTitle>
          <UI.ShellHeaderActionSlot />
        </UI.ShellHeader>
        <UI.ToggleGroup
          aria-label="Route"
          value={[route]}
          onValueChange={(value) => setRoute(Object.values(Route).find((item) => item === value[0]) ?? Route.none)}
          className="p-4">
          <UI.ToggleGroupItem value={Route.schedule}>Schedule</UI.ToggleGroupItem>
          <UI.ToggleGroupItem value={Route.report}>Report</UI.ToggleGroupItem>
          <UI.ToggleGroupItem value={Route.none}>No action</UI.ToggleGroupItem>
        </UI.ToggleGroup>
        {route === Route.schedule ? <ScheduleRoute /> : route === Route.report ? <ReportRoute /> : null}
      </div>
    </UI.ShellHeaderActionProvider>
  )
}
