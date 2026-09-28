import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="h-32 w-64 border">
      <UI.ScrollArea>
        <div className="p-3">
          {Array.from({ length: 12 }, (_, index) => (
            <p key={index}>Shared item {index + 1}</p>
          ))}
        </div>
      </UI.ScrollArea>
    </div>
  )
}
