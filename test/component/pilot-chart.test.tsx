import { renderToString } from "react-dom/server"
import { BarChart, Bar } from "recharts"
import { expect, test } from "vitest"

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartStyle
} from "../../app/component/brand/stylex/chart"

test("chart retains engine composition and config style", () => {
  const html = renderToString(
    <ChartContainer config={{ value: { label: "Value", color: "red" } }}>
      <BarChart data={[{ value: 1 }]}>
        <Bar dataKey="value" />
      </BarChart>
    </ChartContainer>
  )
  expect(html).toContain('data-slot="chart"')
  expect(html).toContain("--color-value")
  expect(renderToString(<ChartStyle id="test" config={{}} />)).toBe("")
  expect(() => renderToString(<ChartTooltipContent />)).toThrow("useChart must be used within a <ChartContainer />")
  expect(() => renderToString(<ChartLegendContent />)).toThrow("useChart must be used within a <ChartContainer />")
})

test("chart config emits scoped theme selector and rejects CSS escape", () => {
  const html = renderToString(<ChartStyle id="safe" config={{ value: { theme: { light: "red", dark: "blue" } } }} />)
  expect(html).toContain('data-pilot-theme="dark"')
  expect(() =>
    renderToString(<ChartStyle id="safe" config={{ value: { color: "red; } body { display:none" } }} />)
  ).toThrow("Invalid chart color")
})

test("chart tooltip and legend preserve payload formatter", () => {
  for (const indicator of ["dot", "line", "dashed"] as const) {
    const html = renderToString(
      <ChartContainer config={{ value: { label: "Value" } }}>
        <div>
          <ChartTooltipContent
            active
            label="value"
            indicator={indicator}
            payload={[{ graphicalItemId: "value", name: "value", value: 42, color: "red", dataKey: "value" }]}
          />
          <ChartLegendContent payload={[{ value: "value", dataKey: "value", color: "red", type: "square" }]} />
        </div>
      </ChartContainer>
    )
    expect(html).toContain("Value")
    expect(html).toContain("42")
  }
})

test("chart resolves nested config, icon and hidden payload", () => {
  expect(
    renderToString(
      <ChartContainer config={{}}>
        <ChartTooltipContent active payload={["value" as never]} />
      </ChartContainer>
    )
  ).toBeTypeOf("string")
  expect(
    renderToString(<ChartStyle id="empty-theme" config={{ value: { theme: { light: "", dark: "blue" } } }} />)
  ).toContain("blue")
  const indirect = renderToString(
    <ChartContainer config={{ alias: { label: "Alias" } }}>
      <div>
        <ChartTooltipContent
          active
          labelKey="name"
          nameKey="name"
          payload={[{ graphicalItemId: "alias", name: "alias", value: 1 }]}
        />
        <ChartLegendContent
          payload={[
            { type: "none", value: "hidden" },
            { type: "square", value: "missing" }
          ]}
        />
      </div>
    </ChartContainer>
  )
  expect(indirect).toContain("Alias")
  function Icon() {
    return <svg data-testid="icon" />
  }
  for (const hide of [false, true]) {
    const html = renderToString(
      <ChartContainer id="custom" config={{ alias: { label: "Alias", icon: Icon } }}>
        <div>
          <ChartTooltipContent
            active
            hideLabel={hide}
            hideIndicator={hide}
            labelKey="key"
            nameKey="key"
            payload={[
              { graphicalItemId: "name", name: "name", value: "text", payload: { key: "alias", fill: "blue" } },
              { graphicalItemId: "none", name: "none", type: "none", value: 1 }
            ]}
          />
          <ChartLegendContent
            hideIcon={hide}
            verticalAlign="top"
            nameKey="key"
            payload={[{ value: "alias", type: "square", payload: { key: "alias" } }]}
          />
          <ChartTooltipContent active={false} />
          <ChartLegendContent />
        </div>
      </ChartContainer>
    )
    expect(html).toContain("Alias")
  }
  const html = renderToString(
    <ChartContainer config={{}}>
      <div>
        <ChartTooltipContent
          active
          label="Raw"
          labelFormatter={() => "Formatted label"}
          formatter={() => "Formatted value"}
          payload={[{ graphicalItemId: "name", name: "name", value: 2 }]}
        />
        <ChartTooltipContent active payload={[{ graphicalItemId: "empty" }]} />
        <ChartTooltipContent active payload={[{ graphicalItemId: "plain", name: "plain", value: [1, 2] }]} />
      </div>
    </ChartContainer>
  )
  expect(html).toContain("Formatted value")
  expect(html).toContain("Formatted label")
})
