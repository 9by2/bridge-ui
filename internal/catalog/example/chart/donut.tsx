import { Pie, PieChart, Label } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer
      className="h-64 w-full"
      config={{
        complete: { label: "Complete", color: "#818cf8" },
        remaining: { label: "Remaining", color: "#2dd4bf" }
      }}>
      <PieChart>
        <Pie
          data={[
            { name: "complete", value: 75, fill: "var(--color-complete)" },
            { name: "remaining", value: 25, fill: "var(--color-remaining)" }
          ]}
          dataKey="value"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}>
          <Label value="75%" position="center" fill="currentColor" />
        </Pie>
        <UI.ChartTooltip content={<UI.ChartTooltipContent hideLabel />} />
      </PieChart>
    </UI.ChartContainer>
  )
}
