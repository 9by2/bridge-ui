import { SearchIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Empty className="border bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:12px_12px]">
      <UI.EmptyHeader className="rounded-xl bg-background p-4">
        <UI.EmptyMedia variant="icon">
          <SearchIcon />
        </UI.EmptyMedia>
        <UI.EmptyTitle>No matching result</UI.EmptyTitle>
        <UI.EmptyDescription>Try a different search or clear the current filter.</UI.EmptyDescription>
      </UI.EmptyHeader>
      <UI.EmptyContent>
        <UI.Button variant="outline">Clear filter</UI.Button>
      </UI.EmptyContent>
    </UI.Empty>
  )
}
