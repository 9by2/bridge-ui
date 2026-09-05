import { Line, LineChart, CartesianGrid, XAxis } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer
      className="h-64 w-full"
      config={{ value: { label: "Actual", color: "#818cf8" }, target: { label: "Target", color: "#2dd4bf" } }}>
      <LineChart
        data={[
          { month: "Jan", value: 40, target: 50 },
          { month: "Feb", value: 80, target: 60 },
          { month: "Mar", value: 55, target: 70 },
          { month: "Apr", value: 100, target: 80 }
        ]}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" />
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
        <Line type="monotone" dataKey="value" stroke="var(--color-value)" strokeWidth={2} />
        <Line type="step" dataKey="target" stroke="var(--color-target)" strokeDasharray="4 4" dot={false} />
      </LineChart>
    </UI.ChartContainer>
  )
}
