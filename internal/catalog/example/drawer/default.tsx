import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      {(["down", "up", "left", "right"] as const).map((side) => (
        <UI.Drawer key={side} swipeDirection={side}>
          <UI.DrawerTrigger render={<UI.Button variant="outline" />}>
            {side === "down" ? "Open drawer" : `Open ${side}`}
          </UI.DrawerTrigger>
          <UI.DrawerContent>
            <UI.DrawerHeader>
              <UI.DrawerTitle>{side} drawer</UI.DrawerTitle>
              <UI.DrawerDescription>Drawer positioned from the {side} edge.</UI.DrawerDescription>
            </UI.DrawerHeader>
          </UI.DrawerContent>
        </UI.Drawer>
      ))}
    </div>
  )
}
