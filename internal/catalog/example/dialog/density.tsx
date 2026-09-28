import * as UI from "@bridge/ui"

const densityList = [UI.bridgeDensity.compact, UI.bridgeDensity.default, UI.bridgeDensity.comfortable] as const

export default function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      {densityList.map((density) => (
        <UI.Theme key={density} density={density}>
          <div className="border p-4 shadow-sm">
            <UI.Dialog>
              <UI.DialogTrigger render={<UI.Button variant="outline" />}>{density}</UI.DialogTrigger>
              <UI.DialogContent>
                <UI.DialogHeader>
                  <UI.DialogTitle>{density} dialog</UI.DialogTitle>
                  <UI.DialogDescription>Content and footer share one density-aware surface inset.</UI.DialogDescription>
                </UI.DialogHeader>
                <UI.DialogFooter showCloseButton />
              </UI.DialogContent>
            </UI.Dialog>
          </div>
        </UI.Theme>
      ))}
    </div>
  )
}
