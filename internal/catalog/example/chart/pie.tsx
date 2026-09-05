import { Pie, PieChart } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer
      className="h-64 w-full"
      config={{
        design: { label: "Design", color: "#818cf8" },
        build: { label: "Build", color: "#2dd4bf" },
        review: { label: "Review", color: "#fb923c" }
      }}>
      <PieChart>
        <Pie
          data={[
            { name: "design", value: 40, fill: "var(--color-design)" },
            { name: "build", value: 70, fill: "var(--color-build)" },
            { name: "review", value: 30, fill: "var(--color-review)" }
          ]}
          dataKey="value"
          nameKey="name"
          outerRadius={85}
        />
        <UI.ChartTooltip content={<UI.ChartTooltipContent nameKey="name" hideLabel />} />
        <UI.ChartLegend content={<UI.ChartLegendContent nameKey="name" />} />
      </PieChart>
    </UI.ChartContainer>
  )
}
