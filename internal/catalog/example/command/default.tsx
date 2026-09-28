import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="w-80 border">
      <UI.Command>
        <UI.CommandInput placeholder="Search commands" />
        <UI.CommandList>
          <UI.CommandGroup heading="Actions">
            <UI.CommandItem>Open dashboard</UI.CommandItem>
            <UI.CommandItem>Create project</UI.CommandItem>
          </UI.CommandGroup>
        </UI.CommandList>
      </UI.Command>
    </div>
  )
}
