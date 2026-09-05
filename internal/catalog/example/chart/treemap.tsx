import { Treemap } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer className="h-64 w-full" config={{ value: { label: "Size", color: "#818cf8" } }}>
      <Treemap
        data={[
          { name: "Design", value: 40 },
          { name: "Build", value: 70 },
          { name: "Review", value: 30 }
        ]}
        dataKey="value"
        aspectRatio={1.5}
        stroke="var(--background)"
        fill="var(--color-value)">
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
      </Treemap>
    </UI.ChartContainer>
  )
}
