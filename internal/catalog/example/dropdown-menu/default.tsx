import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.DropdownMenu>
      <UI.DropdownMenuTrigger render={<UI.Button />}>Open menu</UI.DropdownMenuTrigger>
      <UI.DropdownMenuContent>
        <UI.DropdownMenuItem>Edit</UI.DropdownMenuItem>
        <UI.DropdownMenuItem>Duplicate</UI.DropdownMenuItem>
      </UI.DropdownMenuContent>
    </UI.DropdownMenu>
  )
}
