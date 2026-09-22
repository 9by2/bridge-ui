import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-6">
      <UI.ResizablePanelGroup orientation="horizontal" className="h-40 w-80 rounded border">
        <UI.ResizablePanel defaultSize={50}>
          <div className="p-4">Left</div>
        </UI.ResizablePanel>
        <UI.ResizableHandle withHandle />
        <UI.ResizablePanel defaultSize={50}>
          <div className="p-4">Right</div>
        </UI.ResizablePanel>
      </UI.ResizablePanelGroup>
      <UI.ResizablePanelGroup orientation="vertical" className="h-56 w-80 rounded border">
        <UI.ResizablePanel defaultSize={50}>
          <div tabIndex={0} className="p-4">
            Top
          </div>
        </UI.ResizablePanel>
        <UI.ResizableHandle withHandle />
        <UI.ResizablePanel defaultSize={50}>
          <div tabIndex={0} className="p-4">
            Bottom
          </div>
        </UI.ResizablePanel>
      </UI.ResizablePanelGroup>
    </div>
  )
}
