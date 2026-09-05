import { defineChart, lineY, dot } from "@tanstack/charts"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import { TsChart } from "@bridge/ui"

const data = [
  { day: 1, value: 40 },
  { day: 2, value: 70 },
  { day: 3, value: 55 },
  { day: 4, value: 90 }
]
const definition = defineChart({
  marks: [
    lineY(data, { x: "day", y: "value", stroke: "#818cf8" }),
    dot(data, { x: "day", y: "value", fill: "#2dd4bf" })
  ],
  scales: { x: { scale: scaleLinear }, y: { scale: scaleLinear, nice: true, grid: true } }
})

export default function Example() {
  return (
    <div className="w-full">
      <TsChart definition={definition} ariaLabel="Daily volume trend" />
    </div>
  )
}
