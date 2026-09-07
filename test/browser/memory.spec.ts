import { expect, test } from "@playwright/test"

test("chart navigation releases preview resource after warmup", async ({ page, context }, testInfo) => {
  test.setTimeout(120_000)
  await page.goto("/#button/default")
  const session = await context.newCDPSession(page)
  const samples: { heap: number; documents: number; nodes: number }[] = []
  try {
    for (let cycle = 0; cycle < 8; cycle++) {
      await page.evaluate(() => {
        location.hash = "ts-chart/default"
      })
      await expect(page.locator("[data-preview]")).toHaveCount(190)
      const preview = page.locator('[data-preview="TsChart Basic Sankey preview"]')
      await preview.scrollIntoViewIfNeeded()
      await expect(preview.locator("iframe").contentFrame().locator("svg.ts-chart").first()).toBeVisible()
      await page.evaluate(() => {
        location.hash = "button/default"
        window.scrollTo(0, 0)
      })
      await expect(page.locator("[data-preview]")).toHaveCount(4)
      await expect(page.locator('iframe[src*="ts-chart"]')).toHaveCount(0)
      await expect(page.locator("iframe").first().contentFrame().getByRole("button").first()).toBeVisible()
      await session.send("HeapProfiler.collectGarbage")
      const heap = await session.send("Runtime.getHeapUsage")
      const dom = await session.send("Memory.getDOMCounters")
      samples.push({ heap: heap.usedSize, documents: dom.documents, nodes: dom.nodes })
    }
    const baseline = samples[2]!
    // Warm module/cache loading is excluded; allow bounded browser bookkeeping growth.
    for (const sample of samples.slice(3)) {
      expect(sample.heap - baseline.heap).toBeLessThan(2_000_000)
      expect(sample.documents - baseline.documents).toBeLessThanOrEqual(2)
      expect(sample.nodes - baseline.nodes).toBeLessThan(500)
    }
  } finally {
    await testInfo.attach("memory-sample", { body: JSON.stringify(samples, null, 2), contentType: "application/json" })
    await session.detach()
  }
})
