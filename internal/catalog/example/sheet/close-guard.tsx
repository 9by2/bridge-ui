import { useState } from "react"

import * as UI from "@bridge/ui"

export default function Example() {
  const [open, setOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  return (
    <UI.Sheet open={open} onOpenChange={setOpen} onClose={() => confirmed}>
      <UI.SheetTrigger render={<UI.Button />} onClick={() => setConfirmed(false)}>
        Open guarded sheet
      </UI.SheetTrigger>
      <UI.SheetContent>
        <UI.SheetHeader>
          <UI.SheetTitle>Confirmation required</UI.SheetTitle>
          <UI.SheetDescription>
            Confirm before the close button, Escape, or backdrop can dismiss this sheet.
          </UI.SheetDescription>
        </UI.SheetHeader>
        <div className="p-4">
          <UI.Checkbox checked={confirmed} onCheckedChange={(value) => setConfirmed(value === true)}>
            I confirm this action
          </UI.Checkbox>
        </div>
      </UI.SheetContent>
    </UI.Sheet>
  )
}
