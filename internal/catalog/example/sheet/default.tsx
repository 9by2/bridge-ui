import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Sheet>
      <UI.SheetTrigger render={<UI.Button />}>Open sheet</UI.SheetTrigger>
      <UI.SheetContent>
        <UI.SheetHeader>
          <UI.SheetTitle>Shared sheet</UI.SheetTitle>
          <UI.SheetDescription>Reusable side panel</UI.SheetDescription>
        </UI.SheetHeader>
      </UI.SheetContent>
    </UI.Sheet>
  )
}
