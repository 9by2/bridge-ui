import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Toaster>
      <UI.Button onClick={() => UI.toast.add({ title: "Saved" })}>Show toast</UI.Button>
    </UI.Toaster>
  )
}
