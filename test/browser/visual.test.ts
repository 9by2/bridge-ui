import { expectScreenshot, openPage, pollUntil, test } from "./support"

for (const theme of ["light", "dark"]) {
  for (const width of [390, 1280]) {
    test(`owned presentation ${theme} ${width}`, async () => {
      await using page = await openPage()
      await page.setViewportSize({ width, height: 800 })
      await page.goto(`/?preview&theme=${theme}&motion=reduced#drop-area/default`)
      const dropArea = page.locator('[data-slot="drop-area"]')
      await pollUntil(() => dropArea.count())
      await pollUntil(() => dropArea.isVisible())
      await page.evaluate(`() => document.fonts.ready`)
      const stage = page.locator(".example-stage")
      const box = await stage.boundingBox()
      if (!box) throw new Error("example-stage not found for screenshot")
      await expectScreenshot(page.view, `drop-area-${theme}-${width}`, { clip: box })
    })
  }
}
