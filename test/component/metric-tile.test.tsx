import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { MetricTile } from "../../app/component/brand/stylex/metric-tile"

afterEach(cleanup)

test("metric tile exposes the supplied label, formatted value and description", () => {
  render(<MetricTile variants="featured" label="Revenue" value="฿204,215" description="Successful orders" />)
  expect(screen.getByText("Revenue")).toBeDefined()
  expect(screen.getByText("฿204,215")).toBeDefined()
  expect(screen.getByText("Successful orders")).toBeDefined()
})

test("loading metric tile announces progress instead of reporting stale value", () => {
  render(<MetricTile variants="standard" label="Orders" value="753" loading loadingLabel="Loading orders" />)
  expect(screen.getByRole("status").textContent).toBe("Loading orders")
  expect(screen.queryByText("753")).toBeNull()
})

test("metric tile keeps its icon decorative and supports compact metrics without a description", () => {
  const view = render(<MetricTile variants="compact" label="Staff" value="7" icon={<span>Person</span>} />)
  expect(screen.getByText("Staff")).toBeDefined()
  expect(screen.getByText("7")).toBeDefined()
  expect(view.container.querySelector('[aria-hidden="true"]')?.textContent).toBe("Person")
})
