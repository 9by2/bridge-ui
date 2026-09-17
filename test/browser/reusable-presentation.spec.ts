import { expect, test } from "@playwright/test"

for (const theme of ["light", "dark"]) {
  test(`reusable presentation ${theme} mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })

    await page.goto(`/?preview&theme=${theme}&motion=reduced#data-state/default`)
    await expect(page.locator('[data-slot="data-state"]')).toHaveCount(2)
    await expect(page.getByRole("alert")).toBeVisible()
    await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 390)

    await page.goto(`/?preview&theme=${theme}&motion=reduced#timeline-step/default`)
    await expect(page.locator('[data-slot="timeline-step"]')).toHaveCount(2)
    await expect(page.getByLabel("Horizontal release progress")).toBeVisible()
    expect(await page.locator("html").evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)

    await page.goto(`/?preview&theme=${theme}&motion=reduced#table-frame/default`)
    await expect(page.locator('[data-slot="table-frame-hint"]')).toBeVisible()
    const viewport = page.locator('[data-slot="table-frame-viewport"]')
    await expect(viewport).toBeVisible()
    expect(await viewport.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true)
    expect(await page.locator("html").evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
  })
}

test("page toolbar wraps caller content without document overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto("/?preview&theme=light#page/default")
  await expect(page.locator('[data-slot="page-toolbar"]')).toBeVisible()
  expect(await page.locator("html").evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true)
})
