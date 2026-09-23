import { expect, openPage, pollUntil, test } from "./support"

test("generated, owned and lazy previews render without catalog fallback", async () => {
  await using page = await openPage()
  for (const route of ["button/default", "bridge-calendar/month", "drop-area/media"]) {
    await page.goto(`/?preview#${route}`)
    const stage = page.locator(".example-stage")
    await pollUntil(() => stage.count())
    await expect(stage).toBeVisible()
    await expect(page.getByText("This example could not render.", { exact: false })).toHaveCount(0)
  }

  await page.goto("/#ts-chart/default")
  const preview = page.locator('[data-preview="TsChart Basic Sankey preview"]')
  await pollUntil(() => preview.count())
  await preview.scrollIntoViewIfNeeded()
  const frame = page.getByTitle("TsChart Basic Sankey preview", { exact: true })
  await pollUntil(() => frame.count(), { timeout: 15_000 })
  await expect(frame.contentFrame().locator("svg.ts-chart").first()).toBeVisible()
  await page.goto("/#button/default")
  await expect(page.locator('iframe[src*="ts-chart"]')).toHaveCount(0)
})

test("embedded catalog applies its locale and motion setting", async () => {
  await using page = await openPage()
  await page.goto("/?preview&lang=th&motion=reduced#button/default")
  await expect(page.locator("html[lang='th'][data-motion='reduced']")).toHaveCount(1)
})
