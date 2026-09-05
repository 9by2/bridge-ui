import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.InputGroup>
      <UI.InputGroupInput aria-label="Search" placeholder="Search" />
      <UI.InputGroupAddon>⌘K</UI.InputGroupAddon>
    </UI.InputGroup>
  )
}
