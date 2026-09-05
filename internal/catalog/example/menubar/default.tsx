import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Menubar>
      <UI.MenubarMenu>
        <UI.MenubarTrigger>File</UI.MenubarTrigger>
        <UI.MenubarContent>
          <UI.MenubarItem>New</UI.MenubarItem>
          <UI.MenubarItem>Open</UI.MenubarItem>
        </UI.MenubarContent>
      </UI.MenubarMenu>
    </UI.Menubar>
  )
}
