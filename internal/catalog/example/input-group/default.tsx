import { SearchIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.InputGroup>
      <UI.InputGroupAddon>
        <SearchIcon aria-hidden="true" />
      </UI.InputGroupAddon>
      <UI.InputGroupInput aria-label="Search" placeholder="Search" />
      <UI.InputGroupAddon>⌘K</UI.InputGroupAddon>
    </UI.InputGroup>
  )
}
