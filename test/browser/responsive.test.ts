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
    "rate-card/plan",
    "page/width",
    "page/header-slot"
  ]) {
    await page.goto(`/?preview&theme=light#${route}`)
    const stage = page.locator(".example-stage")
    await pollUntil(() => stage.count())
    await expect(stage).toBeVisible()
    expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
  }
})

test("DataList auto layout changes from a table to one labelled mobile row without overflow", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 844 })
  await page.goto("/?preview&theme=light#data-list/default")
  await pollUntil(() => page.locator('[data-slot="data-list"]').count())
  expect(await page.locator('[data-slot="data-list"] table').count()).toBe(1)
  expect(await page.locator('[data-slot="data-list"] button').count()).toBe(1)
  await Bun.write(".eval/0930-data-list/desktop.png", await page.view.screenshot({ encoding: "buffer", format: "png" }))

  await page.setViewportSize({ width: 390, height: 844 })
  await pollUntil(() => page.locator('[data-slot="data-list"] article').count())
  expect(await page.locator('[data-slot="data-list"] table').count()).toBe(0)
  expect(await page.locator('[data-slot="data-list"] button').count()).toBe(1)
  expect(
    await page.evaluate<boolean>(
      `() => document.querySelector('[data-slot="data-list"]')?.textContent?.includes("Proposal") ?? false`
    )
  ).toBe(true)
  expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
  await Bun.write(".eval/0930-data-list/mobile.png", await page.view.screenshot({ encoding: "buffer", format: "png" }))
  expect(page.errors).toEqual([])
})

// Regression (0924): the `content` width style collided with the PageContent style key and silently
// dropped max-width. Protects the documented PageWidth max-width contract.
test("page width presets apply their documented max-width", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1600, height: 1000 })
  await page.goto("/?preview&theme=light#page/width")
  await pollUntil(() => page.locator('[data-slot="page"][data-width]').count())
  expect(
    await page.evaluate<Record<string, string>>(
      `() => Object.fromEntries([...document.querySelectorAll('[data-slot="page"][data-width]')].map((node) => [node.getAttribute("data-width"), getComputedStyle(node).maxWidth]))`
    )
  ).toEqual({ full: "none", content: "1280px", form: "768px", editor: "none" })
})

// Protects icon-slot DEC-011: a consumer SVG without intrinsic size (brand/social mark) is sized by
// its slot instead of filling the host box; regression found for MetricTile, DataStateMedia,
// EmptyMedia and SettingsNavItem.
test("consumer icon without intrinsic size is sized by every icon slot", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 1100 })
  await page.goto("/?preview&theme=light#item/custom-icon")
  await pollUntil(() => page.locator('[data-testid="placeholder-mark"]').count())
  const size = await page.evaluate<Record<string, number>>(
    `() => Object.fromEntries([...document.querySelectorAll('[data-testid="placeholder-mark"]')].map((node) => [node.parentElement.closest("[data-slot]").getAttribute("data-slot"), Math.round(node.getBoundingClientRect().width)]))`
  )
  expect(size).toMatchObject({
    "item-media": 16,
    "metric-tile-icon": 18,
    "marker-icon": 16,
    "sidebar-menu-button": 16,
    "settings-nav-item": 24,
    "data-state-media": 24,
    "empty-icon": 16
  })
})
