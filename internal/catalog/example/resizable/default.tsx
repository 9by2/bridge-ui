import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-6">
      <div className="h-40 w-80 border">
        <UI.ResizablePanelGroup orientation="horizontal">
          <UI.ResizablePanel defaultSize={50}>
            <div className="p-4">Left</div>
          </UI.ResizablePanel>
          <UI.ResizableHandle withHandle />
          <UI.ResizablePanel defaultSize={50}>
            <div className="p-4">Right</div>
          </UI.ResizablePanel>
        </UI.ResizablePanelGroup>
      </div>
      <div className="h-56 w-80 border">
        <UI.ResizablePanelGroup orientation="vertical">
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
    </div>
  )
}
