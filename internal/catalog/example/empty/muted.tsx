import { BellOffIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Empty className="bg-muted/50">
      <UI.EmptyHeader>
        <UI.EmptyMedia>
          <BellOffIcon className="size-10" />
        </UI.EmptyMedia>
        <UI.EmptyTitle>You are all caught up</UI.EmptyTitle>
        <UI.EmptyDescription>New activity will appear here.</UI.EmptyDescription>
      </UI.EmptyHeader>
    </UI.Empty>
  )
}
