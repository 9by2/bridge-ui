import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Sheet>
      <UI.SheetTrigger render={<UI.Button />}>Open long sheet</UI.SheetTrigger>
      <UI.SheetContent>
        <UI.SheetHeader>
          <UI.SheetTitle>Sticky sheet header</UI.SheetTitle>
          <UI.SheetDescription>The header and close button stay available.</UI.SheetDescription>
        </UI.SheetHeader>
        <div style={{ height: "300vh", padding: 16 }}>Extra long content</div>
      </UI.SheetContent>
    </UI.Sheet>
  )
}
