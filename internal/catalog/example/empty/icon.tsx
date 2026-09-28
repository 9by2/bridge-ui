import { FolderIcon, PlusIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Empty variant={UI.EmptyVariant.outline}>
      <UI.EmptyHeader>
        <UI.EmptyMedia variant="icon">
          <FolderIcon />
        </UI.EmptyMedia>
        <UI.EmptyTitle>No project yet</UI.EmptyTitle>
        <UI.EmptyDescription>Create a project to organize your work.</UI.EmptyDescription>
      </UI.EmptyHeader>
      <UI.EmptyContent>
        <UI.Button>
          <PlusIcon />
          Create project
        </UI.Button>
      </UI.EmptyContent>
    </UI.Empty>
  )
}
