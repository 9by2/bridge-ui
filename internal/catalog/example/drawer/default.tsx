import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Drawer>
      <UI.DrawerTrigger render={<UI.Button />}>Open drawer</UI.DrawerTrigger>
      <UI.DrawerContent>
        <UI.DrawerHeader>
          <UI.DrawerTitle>Shared drawer</UI.DrawerTitle>
          <UI.DrawerDescription>Reusable drawer content</UI.DrawerDescription>
        </UI.DrawerHeader>
      </UI.DrawerContent>
    </UI.Drawer>
  )
}
