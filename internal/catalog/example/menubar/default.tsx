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
      <UI.MenubarMenu>
        <UI.MenubarTrigger>Edit</UI.MenubarTrigger>
        <UI.MenubarContent>
          <UI.MenubarItem>Undo</UI.MenubarItem>
          <UI.MenubarItem>Redo</UI.MenubarItem>
          <UI.MenubarSeparator />
          <UI.MenubarItem>Cut</UI.MenubarItem>
          <UI.MenubarItem>Copy</UI.MenubarItem>
          <UI.MenubarItem>Paste</UI.MenubarItem>
        </UI.MenubarContent>
      </UI.MenubarMenu>
      <UI.MenubarMenu>
        <UI.MenubarTrigger>View</UI.MenubarTrigger>
        <UI.MenubarContent>
          <UI.MenubarCheckboxItem defaultChecked>Show toolbar</UI.MenubarCheckboxItem>
          <UI.MenubarCheckboxItem>Full screen</UI.MenubarCheckboxItem>
          <UI.MenubarSeparator />
          <UI.MenubarItem>Zoom in</UI.MenubarItem>
        </UI.MenubarContent>
      </UI.MenubarMenu>
    </UI.Menubar>
  )
}
