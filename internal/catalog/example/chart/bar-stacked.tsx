import { Bar, BarChart, XAxis } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer
      className="h-64 w-full"
      config={{ desktop: { label: "Desktop", color: "#818cf8" }, mobile: { label: "Mobile", color: "#2dd4bf" } }}>
      <BarChart
        data={[
          { month: "Jan", desktop: 40, mobile: 30 },
          { month: "Feb", desktop: 60, mobile: 45 },
          { month: "Mar", desktop: 80, mobile: 50 }
        ]}>
        <XAxis dataKey="month" />
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
        <UI.ChartLegend content={<UI.ChartLegendContent />} />
        <Bar dataKey="desktop" stackId="total" fill="var(--color-desktop)" />
        <Bar dataKey="mobile" stackId="total" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </UI.ChartContainer>
  )
}
