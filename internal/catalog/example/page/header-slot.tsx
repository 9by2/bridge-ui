import { useState } from "react"

import * as UI from "@bridge/ui"

export default function Example() {
  const [attempt, setAttempt] = useState(0)
  return (
    <UI.Page width={UI.PageWidth.content} density={UI.PageDensity.compact}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageEyebrow>Studio</UI.PageEyebrow>
          <UI.PageTitle>Schedule</UI.PageTitle>
          <UI.PageMeta>
            <UI.Badge variant="secondary">12 event</UI.Badge>
            <span>Updated 5 minutes ago</span>
          </UI.PageMeta>
        </UI.PageHeading>
        <UI.PageAction>
          <UI.Button>New event</UI.Button>
        </UI.PageAction>
        <UI.PageFilter role="search" aria-label="Schedule filter">
          <UI.Input aria-label="Search event" placeholder="Search event" className="max-w-xs" />
          <UI.Button variant="outline">This week</UI.Button>
        </UI.PageFilter>
      </UI.PageHeader>
      <UI.PageContent>
        <UI.DataState variant="error" onRetry={() => setAttempt((value) => value + 1)} retryLabel="Try again">
          <UI.DataStateTitle>Unable to load schedule</UI.DataStateTitle>
          <UI.DataStateDescription>Retry attempt: {attempt}</UI.DataStateDescription>
        </UI.DataState>
      </UI.PageContent>
    </UI.Page>
  )
}
