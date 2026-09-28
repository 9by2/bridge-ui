import { SearchIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Empty variant={UI.EmptyVariant.outline}>
      {/* Example-only decoration: dotted backdrop behind the package EmptyHeader. */}
      <div className="bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:12px_12px] p-4">
        <UI.EmptyHeader>
          <UI.EmptyMedia variant="icon">
            <SearchIcon />
          </UI.EmptyMedia>
          <UI.EmptyTitle>No matching result</UI.EmptyTitle>
          <UI.EmptyDescription>Try a different search or clear the current filter.</UI.EmptyDescription>
        </UI.EmptyHeader>
      </div>
      <UI.EmptyContent>
        <UI.Button variant="outline">Clear filter</UI.Button>
      </UI.EmptyContent>
    </UI.Empty>
  )
}
