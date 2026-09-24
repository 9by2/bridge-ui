import { expect, openPage, pollUntil, test } from "./support"

test("responsive shell and owned composites remain contained on mobile", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 390, height: 844 })
  for (const route of [
    "shell-header/default",
    "bridge-calendar/month",
    "image-crop/default",
    "metric-tile/variants",
    "rate-card/row",
    "rate-card/plan"
  ]) {
    await page.goto(`/?preview&theme=light#${route}`)
    const stage = page.locator(".example-stage")
    await pollUntil(() => stage.count())
    await expect(stage).toBeVisible()
    expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
  }
})
