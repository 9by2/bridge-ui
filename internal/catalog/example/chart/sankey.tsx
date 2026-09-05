import { Sankey } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer className="h-64 w-full" config={{ value: { label: "Flow", color: "#818cf8" } }}>
      <Sankey
        data={{
          nodes: [{ name: "Source" }, { name: "Web" }, { name: "Mobile" }],
          links: [
            { source: 0, target: 1, value: 70 },
            { source: 0, target: 2, value: 30 }
          ]
        }}
        node={{ fill: "var(--color-value)" }}
        link={{ stroke: "#2dd4bf" }}
        nodePadding={40}
        margin={{ left: 30, right: 30, top: 20, bottom: 20 }}>
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
      </Sankey>
    </UI.ChartContainer>
  )
}
