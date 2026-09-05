import { Radar, RadarChart, PolarGrid, PolarAngleAxis } from "recharts"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ChartContainer className="h-64 w-full" config={{ score: { label: "Score", color: "#818cf8" } }}>
      <RadarChart
        data={[
          { name: "Speed", score: 80 },
          { name: "Quality", score: 95 },
          { name: "Reach", score: 60 },
          { name: "Value", score: 75 },
          { name: "Trust", score: 90 }
        ]}
        outerRadius={75}>
        <PolarGrid />
        <PolarAngleAxis dataKey="name" tick={{ fill: "currentColor" }} />
        <Radar dataKey="score" fill="var(--color-score)" fillOpacity={0.3} stroke="var(--color-score)" />
        <UI.ChartTooltip content={<UI.ChartTooltipContent />} />
      </RadarChart>
    </UI.ChartContainer>
  )
}
