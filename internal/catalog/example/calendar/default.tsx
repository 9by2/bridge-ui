import * as UI from "@bridge/ui"

export default function Example() {
  return <UI.Calendar mode="single" selected={new Date(2026, 8, 4)} />
}
