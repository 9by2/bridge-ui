import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Popover>
      <UI.PopoverTrigger render={<UI.Button />}>Open popover</UI.PopoverTrigger>
      <UI.PopoverContent>
        <UI.PopoverTitle>Shared popover</UI.PopoverTitle>
        <UI.PopoverDescription>Shared popover content</UI.PopoverDescription>
      </UI.PopoverContent>
    </UI.Popover>
  )
}
