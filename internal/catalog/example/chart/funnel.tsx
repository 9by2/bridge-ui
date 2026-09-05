import { Funnel, FunnelChart, LabelList } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer className="h-64 w-full" config={{ value: { label: "Count", color: "#818cf8" } }}>
      <FunnelChart>
        <Funnel
          dataKey="value"
          data={[
            { name: "Visit", value: 100, fill: "#818cf8" },
            { name: "Trial", value: 65, fill: "#2dd4bf" },
            { name: "Paid", value: 30, fill: "#fb923c" }
          ]}>
          <LabelList dataKey="name" position="center" fill="#111827" />
        </Funnel>
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
      </FunnelChart>
    </UI.ChartContainer>
  )
}
