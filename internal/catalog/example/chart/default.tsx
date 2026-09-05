import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer className="h-48 w-80" config={{ value: { color: "var(--primary)", label: "Value" } }}>
      <BarChart
        data={[
          { name: "A", value: 40 },
          { name: "B", value: 70 }
        ]}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" />
        <Bar dataKey="value" fill="var(--color-value)" radius={4} />
      </BarChart>
    </UI.ChartContainer>
  )
}
