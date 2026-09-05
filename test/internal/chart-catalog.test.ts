import { expect, test } from "bun:test"

test("chart family is available inline", () => {
  const files = [...new Bun.Glob("*.tsx").scanSync({ cwd: "internal/catalog/example/chart" })]
  for (const name of [
    "area",
    "line",
    "bar-stacked",
    "bar-horizontal",
    "pie",
    "donut",
    "radar",
    "radial",
    "scatter",
    "composed",
    "treemap",
    "funnel",
    "sankey",
    "tooltip",
    "legend"
  ]) {
    expect(files).toContain(`${name}.tsx`)
  }
})
