import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.DirectionProvider direction="rtl">
      <div dir="rtl" className="rounded border p-4">
        واجهة مشتركة
      </div>
    </UI.DirectionProvider>
  )
}
