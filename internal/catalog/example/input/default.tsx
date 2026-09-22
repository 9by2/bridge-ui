import { SearchIcon } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return <UI.Input icon={<SearchIcon />} aria-label="Search" placeholder="Search" />
}
