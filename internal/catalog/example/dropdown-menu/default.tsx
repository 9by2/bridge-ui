import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.DropdownMenu>
      <UI.DropdownMenuTrigger render={<UI.Button />}>Open menu</UI.DropdownMenuTrigger>
      <UI.DropdownMenuContent>
        <UI.DropdownMenuItem>Edit</UI.DropdownMenuItem>
        <UI.DropdownMenuItem>Duplicate</UI.DropdownMenuItem>
        <UI.DropdownMenuSeparator />
        <UI.DropdownMenuCheckboxItem defaultChecked>Show detail</UI.DropdownMenuCheckboxItem>
        <UI.DropdownMenuSub>
          <UI.DropdownMenuSubTrigger>Share</UI.DropdownMenuSubTrigger>
          <UI.DropdownMenuSubContent>
            <UI.DropdownMenuItem>Copy link</UI.DropdownMenuItem>
            <UI.DropdownMenuItem>Email</UI.DropdownMenuItem>
          </UI.DropdownMenuSubContent>
        </UI.DropdownMenuSub>
        <UI.DropdownMenuSeparator />
        <UI.DropdownMenuItem variant="destructive">Delete</UI.DropdownMenuItem>
      </UI.DropdownMenuContent>
    </UI.DropdownMenu>
  )
}
