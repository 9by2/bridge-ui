import { expect, test } from "bun:test"

test("custom component uses brand source", async () => {
  expect(await Bun.file("app/component/brand/ts-chart.tsx").exists()).toBe(true)
  expect(await Bun.file("app/component/brand/drop-area.tsx").exists()).toBe(true)
  expect(await Bun.file("app/component/global/ts-chart.tsx").exists()).toBe(false)
})

test("TanStack inventory matches the pinned upstream catalog", async () => {
  const inventory = await Bun.file("internal/catalog/vendor/tanstack/catalog-index.json").json()
  expect(inventory.cases).toHaveLength(188)
  for (const entry of inventory.cases) {
    expect(await Bun.file(`internal/catalog/example/ts-chart/${entry.id}.tsx`).exists()).toBe(true)
  }
})
