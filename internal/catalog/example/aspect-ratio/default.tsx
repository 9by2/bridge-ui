import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="w-80">
      <UI.AspectRatio ratio={16 / 9}>
        <div className="size-full bg-muted" />
      </UI.AspectRatio>
    </div>
  )
}
