import { useState } from "react"

import * as UI from "@bridge/ui"

export default function Example() {
  const [width, setWidth] = useState(384)
  return (
    <UI.Sheet>
      <UI.SheetTrigger render={<UI.Button />}>Open resizable sheet</UI.SheetTrigger>
      <UI.SheetContent side="right" resizable size={width} onSizeChange={setWidth}>
        <UI.SheetHeader>
          <UI.SheetTitle>Resizable inspector</UI.SheetTitle>
          <UI.SheetDescription>Drag the centered handle on the left edge to adjust this sheet.</UI.SheetDescription>
        </UI.SheetHeader>
      </UI.SheetContent>
    </UI.Sheet>
  )
}
