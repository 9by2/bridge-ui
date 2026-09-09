import { expect, test } from "@playwright/test"

for (const theme of ["light", "dark"])
  for (const width of [390, 1280])
    for (const name of ["button-group", "avatar", "card", "calendar", "sidebar", "carousel", "input-group", "tabs"]) {
      test(`${name} baseline candidate root geometry ${theme} ${width}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        const slot = name
        const measurements = []
        for (const route of ["/", "/style-x"]) {
          await page.goto(`${route}?preview&theme=${theme}#${name}/default`)
          const node = page.locator(`[data-slot="${slot}"]`).first()
          await expect(node).toBeVisible()
          measurements.push(
            await node.evaluate((element) => {
              const computed = getComputedStyle(element)
              const rect = element.getBoundingClientRect()
              return {
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                padding: computed.padding,
                gap: computed.gap === "normal" ? "0px" : computed.gap,
                fontSize: computed.fontSize,
                borderRadius: Math.min(parseFloat(computed.borderRadius), Math.min(rect.width, rect.height) / 2)
              }
            })
          )
        }
        expect(measurements[1]).toEqual(measurements[0])
      })
    }
