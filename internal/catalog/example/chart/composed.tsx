import { ComposedChart, Bar, Line, Area, XAxis, CartesianGrid, ReferenceLine, Brush } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer
      className="h-64 w-full"
      config={{ actual: { label: "Actual", color: "#818cf8" }, target: { label: "Target", color: "#2dd4bf" } }}>
      <ComposedChart
        data={[
          { name: "Jan", actual: 40, target: 50 },
          { name: "Feb", actual: 80, target: 60 },
          { name: "Mar", actual: 55, target: 70 },
          { name: "Apr", actual: 100, target: 80 }
        ]}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" />
        <Area dataKey="target" fill="var(--color-target)" fillOpacity={0.15} stroke="none" />
        <Bar dataKey="actual" fill="var(--color-actual)" barSize={24} />
        <Line dataKey="target" stroke="var(--color-target)" />
        <ReferenceLine y={60} stroke="currentColor" strokeDasharray="3 3" />
        <Brush dataKey="name" height={20} />
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
      </ComposedChart>
    </UI.ChartContainer>
  )
}
