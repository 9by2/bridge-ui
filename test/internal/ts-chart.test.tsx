import { expect, test } from "bun:test"

import { barY, defineChart } from "@tanstack/charts"
import { motion } from "@tanstack/charts/motion"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { renderToStaticMarkup } from "react-dom/server"

import { TsChart } from "../../app/component/brand/ts-chart"

test("TsChart renders accessible SVG with default and explicit sizing", () => {
  const definition = defineChart({
    marks: [barY([{ name: "A", value: 40 }], { x: "name", y: "value" })],
    scales: { x: { scale: scaleBand }, y: { scale: scaleLinear } }
  })
  for (const height of [undefined, 240]) {
    const html = renderToStaticMarkup(<TsChart definition={definition} ariaLabel="Volume" height={height} />)
    expect(html).toContain("<svg")
    expect(html).toContain("Volume")
    expect(html).toContain(String(height ?? 256))
  }
  const animated = renderToStaticMarkup(
    <TsChart renderer={motion()} definition={definition} ariaLabel="Animated volume" />
  )
  expect(animated).toContain("Animated volume")
})
