import { Bar, BarChart } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {(["dot", "line", "dashed"] as const).map((indicator) => (
        <section key={indicator}>
          <UI.Heading as={UI.WAIHeading.H3}>{indicator}</UI.Heading>
          <UI.ChartContainer className="h-48 w-full" config={{ value: { label: "Revenue", color: "#818cf8" } }}>
            <BarChart
              data={[
                { month: "Jan", value: 40 },
                { month: "Feb", value: 70 }
              ]}>
              <Bar dataKey="value" fill="var(--color-value)" />
              <UI.ChartTooltip
                active
                defaultIndex={0}
                cursor={false}
                content={<UI.ChartTooltipContent indicator={indicator} labelFormatter={() => "January"} />}
              />
            </BarChart>
          </UI.ChartContainer>
        </section>
      ))}
    </div>
  )
}
