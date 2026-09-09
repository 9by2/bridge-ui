import { expect, test } from "vitest"

import { TsChart as Baseline } from "../../app/component/brand/ts-chart"
import { TsChart } from "../../internal/pilot/ts-chart"

test("unstyled chart wrapper retains exact implementation identity", () => {
  expect(TsChart).toBe(Baseline)
})
