import { barY, defineChart } from "@tanstack/charts"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import { TsChart } from "@bridge/ui"

const definition = defineChart({
  marks: [
    barY(
      [
        { month: "Jan", value: 40 },
        { month: "Feb", value: 70 },
        { month: "Mar", value: 55 }
      ],
      { x: "month", y: "value", fill: "#818cf8" }
    )
  ],
  scales: { x: { scale: scaleBand }, y: { scale: scaleLinear, nice: true, grid: true } }
})

export default function Example() {
  return (
    <div className="w-full">
      <TsChart definition={definition} ariaLabel="Monthly volume" />
    </div>
  )
}
