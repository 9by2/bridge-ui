import { expect, test } from "vitest"

import { TsChart as Baseline, TsChart } from "../../app/component/brand/ts-chart"

test("unstyled chart wrapper retains exact implementation identity", () => {
  expect(TsChart).toBe(Baseline)
})
