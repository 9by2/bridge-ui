import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, ZAxis } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer className="h-64 w-full" config={{ point: { label: "Observation", color: "#818cf8" } }}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis type="number" dataKey="x" name="Effort" />
        <YAxis type="number" dataKey="y" name="Impact" />
        <ZAxis dataKey="size" range={[60, 300]} />
        <Scatter
          name="Observation"
          fill="var(--color-point)"
          data={[
            { x: 20, y: 40, size: 10 },
            { x: 50, y: 80, size: 30 },
            { x: 80, y: 60, size: 20 }
          ]}
        />
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
      </ScatterChart>
    </UI.ChartContainer>
  )
}
