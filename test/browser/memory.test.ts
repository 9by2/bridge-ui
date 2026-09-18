import path from "node:path"

import { expect, openPage, pollUntil, test, withHeapSession } from "./support"

test("chart navigation releases preview resource after warmup", async () => {
  await using page = await openPage()
  await page.goto("/#button/default")
  const heap = withHeapSession(page.view)
  const samples: { heap: number; documents: number; nodes: number }[] = []
  const previews = page.locator("[data-preview]")
  try {
    for (let cycle = 0; cycle < 8; cycle++) {
      await page.evaluate(`() => { location.hash = "ts-chart/default" }`)
      await pollUntil(() => previews.count())
      const preview = page.locator('[data-preview="TsChart Basic Sankey preview"]')
      await pollUntil(() => preview.count())
      await preview.scrollIntoViewIfNeeded()
      const frame = preview.locator("iframe")
      await pollUntil(() => frame.count())
      await expect(frame.contentFrame().locator("svg.ts-chart").first()).toBeVisible()
      await page.evaluate(`() => {
        location.hash = "button/default"
        window.scrollTo(0, 0)
      }`)
      await expect(previews).toHaveCount(4)
      await expect(page.locator('iframe[src*="ts-chart"]')).toHaveCount(0)
      const firstFrame = page.locator("iframe").first()
      await pollUntil(() => firstFrame.count())
      await expect(firstFrame.contentFrame().getByRole("button").first()).toBeVisible()
      await heap.collectGarbage()
      const usage = await heap.getHeapUsage()
      const dom = await heap.getDomCounters()
      samples.push({ heap: usage.usedSize, documents: dom.documents, nodes: dom.nodes })
    }
    const baseline = samples[2]!
    // Warm module/cache loading is excluded; allow bounded browser bookkeeping growth.
    for (const sample of samples.slice(3)) {
      expect(sample.heap - baseline.heap).toBeLessThan(2_000_000)
      expect(sample.documents - baseline.documents).toBeLessThanOrEqual(2)
      expect(sample.nodes - baseline.nodes).toBeLessThan(500)
    }
  } finally {
    const evalDir = path.join(process.cwd(), ".eval", "0918-webview-migration")
    await Bun.write(path.join(evalDir, "memory-sample.json"), JSON.stringify(samples, null, 2))
  }
})
