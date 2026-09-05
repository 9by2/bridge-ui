import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Tabs defaultValue="one">
      <UI.TabsList>
        <UI.TabsTrigger value="one">One</UI.TabsTrigger>
        <UI.TabsTrigger value="two">Two</UI.TabsTrigger>
      </UI.TabsList>
      <UI.TabsContent value="one">First panel</UI.TabsContent>
      <UI.TabsContent value="two">Second panel</UI.TabsContent>
    </UI.Tabs>
  )
}
