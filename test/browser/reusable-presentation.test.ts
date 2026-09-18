import { expect, openPage, pollUntil, test } from "./support"

for (const theme of ["light", "dark"]) {
  test(`reusable presentation ${theme} mobile`, async () => {
    await using page = await openPage()
    await page.setViewportSize({ width: 390, height: 900 })

    await page.goto(`/?preview&theme=${theme}&motion=reduced#data-state/default`)
    const dataState = page.locator('[data-slot="data-state"]')
    await pollUntil(() => dataState.count())
    await expect(dataState).toHaveCount(2)
    await expect(page.getByRole("alert")).toBeVisible()
    await expect(page.locator("html")).toHaveJSProperty("scrollWidth", 390)

    await page.goto(`/?preview&theme=${theme}&motion=reduced#timeline-step/default`)
    const timelineStep = page.locator('[data-slot="timeline-step"]')
    await pollUntil(() => timelineStep.count())
    await expect(timelineStep).toHaveCount(2)
    await expect(page.getByLabel("Horizontal release progress")).toBeVisible()
    expect(await page.locator("html").evaluate<boolean>(`(node) => node.scrollWidth <= node.clientWidth`)).toBe(true)

    await page.goto(`/?preview&theme=${theme}&motion=reduced#table-frame/default`)
    const hint = page.locator('[data-slot="table-frame-hint"]')
    await pollUntil(() => hint.count())
    await expect(hint).toBeVisible()
    const viewport = page.locator('[data-slot="table-frame-viewport"]')
    await expect(viewport).toBeVisible()
    expect(await viewport.evaluate<boolean>(`(node) => node.scrollWidth > node.clientWidth`)).toBe(true)
    expect(await page.locator("html").evaluate<boolean>(`(node) => node.scrollWidth <= node.clientWidth`)).toBe(true)
  })
}

test("page toolbar wraps caller content without document overflow", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto("/?preview&theme=light#page/default")
  const toolbar = page.locator('[data-slot="page-toolbar"]')
  await pollUntil(() => toolbar.count())
  await expect(toolbar).toBeVisible()
  expect(await page.locator("html").evaluate<boolean>(`(node) => node.scrollWidth <= node.clientWidth`)).toBe(true)
})
