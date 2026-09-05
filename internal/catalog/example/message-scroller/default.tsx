import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.MessageScrollerProvider>
      <UI.MessageScroller className="h-48 w-80 rounded border">
        <UI.MessageScrollerViewport>
          <UI.MessageScrollerContent>
            {Array.from({ length: 8 }, (_, index) => (
              <UI.MessageScrollerItem key={index} className="p-3">
                Message {index + 1}
              </UI.MessageScrollerItem>
            ))}
          </UI.MessageScrollerContent>
        </UI.MessageScrollerViewport>
        <UI.MessageScrollerButton />
      </UI.MessageScroller>
    </UI.MessageScrollerProvider>
  )
}
