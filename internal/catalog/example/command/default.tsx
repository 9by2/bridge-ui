import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Command className="w-80 rounded-lg border">
      <UI.CommandInput placeholder="Search commands" />
      <UI.CommandList>
        <UI.CommandGroup heading="Actions">
          <UI.CommandItem>Open dashboard</UI.CommandItem>
          <UI.CommandItem>Create project</UI.CommandItem>
        </UI.CommandGroup>
      </UI.CommandList>
    </UI.Command>
  )
}
