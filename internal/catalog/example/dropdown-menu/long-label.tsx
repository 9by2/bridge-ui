import * as UI from "@bridge/ui"

const label = [
  "Edit",
  "Invite a collaborator to this workspace",
  "TL;DR — summarize the selected thread for the team",
  "Move this document to the archived records folder, notify every subscriber, and keep a restorable copy for thirty days before permanent removal."
] as const

export default function Example() {
  return (
    <UI.DropdownMenu>
      <UI.DropdownMenuTrigger render={<UI.Button />}>Open long menu</UI.DropdownMenuTrigger>
      <UI.DropdownMenuContent>
        {label.map((text) => (
          <UI.DropdownMenuItem key={text}>{text}</UI.DropdownMenuItem>
        ))}
        <UI.DropdownMenuSeparator />
        <UI.DropdownMenuItem variant="destructive">Delete</UI.DropdownMenuItem>
      </UI.DropdownMenuContent>
    </UI.DropdownMenu>
  )
}
