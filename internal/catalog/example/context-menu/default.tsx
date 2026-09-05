import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ContextMenu>
      <UI.ContextMenuTrigger className="rounded-lg border border-dashed p-8">Right click area</UI.ContextMenuTrigger>
      <UI.ContextMenuContent>
        <UI.ContextMenuItem>Copy</UI.ContextMenuItem>
        <UI.ContextMenuItem>Paste</UI.ContextMenuItem>
      </UI.ContextMenuContent>
    </UI.ContextMenu>
  )
}
