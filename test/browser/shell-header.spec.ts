import { expect, test } from "@playwright/test"

const preview = (example: string, theme = "light") => `/?preview&theme=${theme}#shell-header/${example}`

test("shell header tracks expanded and collapsed sidebar width without document overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto(preview("default"))

  const header = page.locator('[data-slot="shell-header"]')
  const inset = page.locator('[data-slot="sidebar-inset"]')
  const root = page.locator("html")
  const expandedWidth = await inset.evaluate((node) => node.getBoundingClientRect().width)

  await expect(header).toHaveCSS("position", "sticky")
  await expect(header).toHaveCSS("height", "64px")
  await expect(inset).toHaveCSS("min-width", "0px")
  expect(await root.evaluate((node) => node.scrollWidth)).toBe(await root.evaluate((node) => node.clientWidth))

  await page.getByRole("button", { name: "Toggle navigation" }).click()
  await expect(page.locator('[data-slot="sidebar"][data-state="collapsed"]')).toBeVisible()
  await expect
    .poll(() => inset.evaluate((node) => node.getBoundingClientRect().width))
    .toBeGreaterThan(expandedWidth + 200)
  await expect(header).toHaveCSS("width", `${await inset.evaluate((node) => node.getBoundingClientRect().width)}px`)
  expect(await root.evaluate((node) => node.scrollWidth)).toBe(await root.evaluate((node) => node.clientWidth))
})

test("shell header remains at the viewport top while route content scrolls", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 500 })
  await page.goto(preview("default"))
  const header = page.locator('[data-slot="shell-header"]')

  await page.evaluate(() => scrollTo(0, 500))

  await expect.poll(() => header.evaluate((node) => node.getBoundingClientRect().top)).toBe(0)
})

test("default shell header keeps the route title centered between independent controls", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto(preview("default"))

  const header = page.locator('[data-slot="shell-header"]')
  const title = page.locator('[data-slot="shell-header-title"]')
  await expect(page.getByRole("button", { name: "Select project" })).toContainText("All Projects")
  await expect(page.getByRole("button", { name: "Open agent" })).toContainText("Agent")
  await expect
    .poll(async () => {
      const headerBox = await header.boundingBox()
      const titleBox = await title.boundingBox()
      if (!headerBox || !titleBox) return Number.POSITIVE_INFINITY
      return Math.abs(titleBox.x + titleBox.width / 2 - (headerBox.x + headerBox.width / 2))
    })
    .toBeLessThanOrEqual(1)

  await page.setViewportSize({ width: 390, height: 700 })
  await page.reload()
  await expect(page.getByRole("button", { name: "Select project" })).toBeHidden()
  await expect(page.getByRole("button", { name: "Open agent" }).getByText("Agent", { exact: true })).toBeHidden()
  const mobileTitleBox = await title.boundingBox()
  const mobileTriggerBox = await page.getByRole("button", { name: "Toggle navigation" }).boundingBox()
  const mobileAgentBox = await page.getByRole("button", { name: "Open agent" }).boundingBox()
  expect(mobileTitleBox && mobileTriggerBox && mobileTitleBox.x).toBeGreaterThan(
    mobileTriggerBox ? mobileTriggerBox.x + mobileTriggerBox.width : Number.POSITIVE_INFINITY
  )
  expect(mobileTitleBox && mobileAgentBox && mobileTitleBox.x + mobileTitleBox.width).toBeLessThan(
    mobileAgentBox?.x ?? Number.NEGATIVE_INFINITY
  )
})

test("shell header supports title-only, long title, mobile and token theme", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto(preview("collapsed", "light"))

  const titleOnly = page.locator('[data-slot="shell-header"]')
  await expect(titleOnly.locator('[data-slot="shell-header-action"]')).toHaveCount(0)
  await expect(titleOnly).toHaveCSS("padding-left", "16px")
  const lightBackground = await titleOnly.evaluate((node) => getComputedStyle(node).backgroundColor)
  expect(await page.locator("html").evaluate((node) => node.scrollWidth)).toBe(
    await page.locator("html").evaluate((node) => node.clientWidth)
  )

  await page.getByRole("button", { name: "Toggle navigation" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()

  await page.goto(preview("long-title", "dark"))
  const longTitle = page.locator('[data-slot="shell-header-title"]')
  await expect(longTitle).toHaveCSS("text-overflow", "ellipsis")
  await expect(longTitle).toHaveCSS("white-space", "nowrap")
  expect(
    await page.locator('[data-slot="shell-header"]').evaluate((node) => getComputedStyle(node).backgroundColor)
  ).not.toBe(lightBackground)
  expect(await longTitle.evaluate((node) => node.scrollWidth > node.clientWidth)).toBe(true)
})

test("avatar remains fully rounded at every public size", async ({ page }) => {
  await page.goto("/?preview&theme=light#avatar/size")

  const avatar = page.locator('[data-slot="avatar"]')
  await expect(avatar).toHaveCount(3)
  for (const item of await avatar.all()) {
    await expect(item).toHaveCSS("border-radius", "9999px")
    expect(await item.evaluate((node) => getComputedStyle(node, "::after").borderRadius)).toBe("9999px")
  }
})
