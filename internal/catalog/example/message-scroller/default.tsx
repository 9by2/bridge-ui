import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.MessageScrollerProvider>
      <div className="h-80 w-full max-w-lg border">
        <UI.MessageScroller>
          <UI.MessageScrollerViewport>
            <UI.MessageScrollerContent>
              {Array.from({ length: 8 }, (_, index) => (
                <UI.MessageScrollerItem key={index} data-side={index % 2 === 0 ? "left" : "right"}>
                  <div className={`flex p-3 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] rounded-xl p-3 text-sm ${index % 2 === 0 ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
                      <p className="mb-1 text-xs font-semibold">{index % 2 === 0 ? "Alex" : "You"}</p>
                      {index % 2 === 0 ? "Can you review the latest draft?" : "Yes, I will send feedback shortly."}
                      <p className="mt-1 text-xs">09:{String(index + 10)}</p>
                    </div>
                  </div>
                </UI.MessageScrollerItem>
              ))}
            </UI.MessageScrollerContent>
          </UI.MessageScrollerViewport>
          <UI.MessageScrollerButton />
        </UI.MessageScroller>
      </div>
    </UI.MessageScrollerProvider>
  )
}
