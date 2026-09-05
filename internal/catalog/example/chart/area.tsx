import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer className="h-64 w-full" config={{ value: { label: "Volume", color: "#818cf8" } }}>
      <AreaChart
        data={[
          { month: "Jan", value: 40 },
          { month: "Feb", value: 80 },
          { month: "Mar", value: 55 },
          { month: "Apr", value: 100 }
        ]}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" />
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
        <Area type="monotone" dataKey="value" fill="var(--color-value)" fillOpacity={0.3} stroke="var(--color-value)" />
      </AreaChart>
    </UI.ChartContainer>
  )
}
