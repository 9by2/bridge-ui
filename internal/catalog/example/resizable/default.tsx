import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ResizablePanelGroup orientation="horizontal" className="h-40 w-80 rounded border">
      <UI.ResizablePanel defaultSize={50}>
        <div className="p-4">Left</div>
      </UI.ResizablePanel>
      <UI.ResizableHandle withHandle />
      <UI.ResizablePanel defaultSize={50}>
        <div className="p-4">Right</div>
      </UI.ResizablePanel>
    </UI.ResizablePanelGroup>
  )
}
