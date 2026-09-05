import { Bar, BarChart, XAxis, YAxis, LabelList } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer className="h-64 w-full" config={{ value: { label: "Count", color: "#818cf8" } }}>
      <BarChart
        layout="vertical"
        margin={{ right: 40 }}
        data={[
          { name: "Design", value: 40 },
          { name: "Build", value: 70 },
          { name: "Review", value: 55 }
        ]}>
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={65} />
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" radius={4}>
          <LabelList dataKey="value" position="right" fill="currentColor" />
        </Bar>
      </BarChart>
    </UI.ChartContainer>
  )
}
