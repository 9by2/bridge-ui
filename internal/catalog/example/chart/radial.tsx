import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer className="h-64 w-full" config={{ value: { label: "Progress", color: "#818cf8" } }}>
      <RadialBarChart
        data={[{ name: "Progress", value: 75, fill: "var(--color-value)" }]}
        innerRadius={65}
        outerRadius={95}
        startAngle={90}
        endAngle={-270}>
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar dataKey="value" background cornerRadius={8} />
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
      </RadialBarChart>
    </UI.ChartContainer>
  )
}
