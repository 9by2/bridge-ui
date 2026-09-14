import { Circle, Clock3 } from "lucide-react"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="grid gap-8">
      <UI.Tabs defaultValue="assets">
        <UI.TabsList variant="capsule">
          <UI.TabsTrigger value="assets">Assets</UI.TabsTrigger>
          <UI.TabsTrigger value="layout">Layout packs</UI.TabsTrigger>
          <UI.TabsTrigger value="media">Media</UI.TabsTrigger>
        </UI.TabsList>
        <UI.TabsContent value="assets">Asset content</UI.TabsContent>
      </UI.Tabs>

      <UI.Tabs defaultValue="colors">
        <UI.TabsList variant="capsule">
          <UI.TabsTrigger value="colors">
            Colors <UI.Badge variant="secondary">32</UI.Badge>
          </UI.TabsTrigger>
          <UI.TabsTrigger value="typography">
            Typography <UI.Badge variant="secondary">4</UI.Badge>
          </UI.TabsTrigger>
        </UI.TabsList>
        <UI.TabsContent value="colors">Color content</UI.TabsContent>
      </UI.Tabs>

      <UI.Tabs defaultValue="todo">
        <UI.TabsList variant="capsule">
          <UI.TabsTrigger value="todo">
            <Circle aria-hidden="true" /> Todo 4
          </UI.TabsTrigger>
          <UI.TabsTrigger value="snoozed">
            <Clock3 aria-hidden="true" /> Snoozed 0
          </UI.TabsTrigger>
        </UI.TabsList>
        <UI.TabsContent value="todo">Todo content</UI.TabsContent>
      </UI.Tabs>
    </div>
  )
}
