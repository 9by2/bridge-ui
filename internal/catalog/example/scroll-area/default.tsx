import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ScrollArea className="h-32 w-64 rounded border p-3">
      {Array.from({ length: 12 }, (_, index) => (
        <p key={index}>Shared item {index + 1}</p>
      ))}
    </UI.ScrollArea>
  )
}
