import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Card className="w-80">
      <UI.CardHeader>
        <UI.CardTitle>Bridge UI</UI.CardTitle>
        <UI.CardDescription>Shared component library</UI.CardDescription>
      </UI.CardHeader>
      <UI.CardContent>Reusable foundation</UI.CardContent>
    </UI.Card>
  )
}
