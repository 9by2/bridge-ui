import { expect, test } from "@playwright/test"

for (const theme of ["light", "dark"])
  test(`candidate layout interaction ${theme}`, async ({ page }) => {
    await page.goto(`/style-x?preview&theme=${theme}#accordion/default`)
    const trigger = page.locator('[data-slot="accordion-trigger"]').first()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(page.locator('[data-slot="accordion-content"]').first()).toBeVisible()
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await page.goto(`/style-x?preview&theme=${theme}#tabs/default`)
    const tab = page.getByRole("tab").last()
    await tab.click()
    await expect(tab).toHaveAttribute("aria-selected", "true")
    await expect(page.getByRole("tabpanel", { name: "Two" })).toBeVisible()
    await expect(page.getByRole("tabpanel", { name: "One" })).toHaveCount(0)
    await page.goto(`/style-x?preview&theme=${theme}#table/default`)
    await expect(page.getByRole("table")).toBeVisible()
    await expect(page.getByRole("row").first()).toBeVisible()
    for (const name of ["tooltip", "hover-card"]) {
      await page.mouse.move(0, 0)
      await page.goto(`/style-x?preview&theme=${theme}#${name}/default`)
      await page.locator(`[data-slot=${name}-trigger]`).hover()
      await expect(page.locator(`[data-pilot-theme=${theme}] [data-slot=${name}-content]`)).toBeVisible()
      await page.mouse.move(0, 0)
      await expect(page.locator(`[data-slot=${name}-content]`)).toHaveCount(0)
      if (name === "tooltip") {
        await page.keyboard.press("Tab")
        await expect(page.locator('[data-slot="tooltip-trigger"]')).toBeFocused()
        await expect(page.locator('[data-slot="tooltip-content"]')).toBeVisible()
        await page.keyboard.press("Escape")
        await expect(page.locator('[data-slot="tooltip-content"]')).toHaveCount(0)
      }
    }
  })

test("active sidebar submenu button fills the available row width", async ({ page }) => {
  await page.goto("/style-x?preview&theme=light#sidebar/default")

  const button = page.locator('[data-slot="sidebar-menu-sub-button"][data-active]')
  const item = button.locator("..").first()
  const inactive = page.locator('[data-slot="sidebar-menu-sub-button"]:not([data-active])').first()
  await expect(button).toBeVisible()
  await expect(button).toHaveCSS("width", `${await item.evaluate((node) => node.clientWidth)}px`)
  expect(await button.evaluate((node) => getComputedStyle(node).backgroundColor)).not.toBe(
    await inactive.evaluate((node) => getComputedStyle(node).backgroundColor)
  )
  await expect(button).toHaveCSS("font-weight", "500")
})

for (const collapsible of ["offcanvas", "icon"] as const)
  test(`sidebar renders and toggles the ${collapsible} shell`, async ({ page }) => {
    await page.goto(`/style-x?preview&theme=light#sidebar/collapsible-${collapsible}`)

    const sidebar = page.locator('[data-slot="sidebar"]')
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
    await page.locator('[data-slot="sidebar-trigger"]').click()
    await expect(sidebar).toHaveAttribute("data-state", "collapsed")
    await expect(sidebar).toHaveAttribute("data-collapsible", collapsible)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
      await page.evaluate(() => document.documentElement.clientWidth)
    )
  })

test("sidebar renders the persistent full shell", async ({ page }) => {
  await page.goto("/style-x?preview&theme=light#sidebar/collapsible-none")

  await expect(page.locator('[data-slot="sidebar"]')).toBeVisible()
  await expect(page.locator('[data-slot="sidebar-trigger"]')).toHaveCount(0)
  await expect(page.locator('[data-slot="sidebar-inset"]')).toBeVisible()
})

for (const side of ["left", "right"] as const)
  for (const variant of ["sidebar", "floating", "inset"] as const)
    test(`sidebar renders the ${side} ${variant} full shell`, async ({ page }) => {
      await page.goto(`/style-x?preview&theme=light#sidebar/${side}-${variant}`)

      const sidebar = page.locator('[data-slot="sidebar"]')
      const inset = page.locator('[data-slot="sidebar-inset"]')
      await expect(sidebar).toHaveAttribute("data-side", side)
      await expect(sidebar).toHaveAttribute("data-variant", variant)
      await expect(inset).toBeVisible()
      const sidebarBox = await page.locator('[data-slot="sidebar-container"]').boundingBox()
      const insetBox = await inset.boundingBox()
      expect(sidebarBox).not.toBeNull()
      expect(insetBox).not.toBeNull()
      if (side === "left") expect(insetBox!.x).toBeGreaterThanOrEqual(sidebarBox!.x + sidebarBox!.width)
      else expect(insetBox!.x + insetBox!.width).toBeLessThanOrEqual(sidebarBox!.x)
      if (variant === "inset") {
        await expect(inset).toHaveCSS("margin-top", "12px")
        await expect(inset).toHaveCSS("border-top-width", "1px")
        expect(await inset.evaluate((node) => getComputedStyle(node).boxShadow)).not.toBe("none")
      } else {
        await expect(inset).toHaveCSS("margin-top", "0px")
        await expect(inset).toHaveCSS("box-shadow", "none")
      }
      const container = page.locator('[data-slot="sidebar-container"]')
      await expect(container).toHaveCSS("padding-top", variant === "floating" ? "8px" : "0px")
      await page.locator('[data-slot="sidebar-trigger"]').click()
      await expect(sidebar).toHaveAttribute("data-state", "collapsed")
      await expect(sidebar).toHaveAttribute("data-collapsible", "icon")
      await expect(page.locator('[data-slot="sidebar-gap"]')).toHaveCSS(
        "width",
        variant === "floating" ? "64px" : "48px"
      )
      await expect(container).toHaveCSS("width", variant === "floating" ? "66px" : "48px")
      const inner = page.locator('[data-slot="sidebar-inner"]')
      expect(await inner.evaluate((node) => node.scrollWidth)).toBeLessThanOrEqual(
        await inner.evaluate((node) => node.clientWidth)
      )
      const collapsedSidebarBox = await container.boundingBox()
      const collapsedInsetBox = await inset.boundingBox()
      expect(collapsedSidebarBox).not.toBeNull()
      expect(collapsedInsetBox).not.toBeNull()
      if (side === "left")
        expect(collapsedInsetBox!.x).toBeGreaterThanOrEqual(collapsedSidebarBox!.x + collapsedSidebarBox!.width)
      else expect(collapsedInsetBox!.x + collapsedInsetBox!.width).toBeLessThanOrEqual(collapsedSidebarBox!.x)
      if (variant === "inset") {
        await expect(inset).toHaveCSS("margin-top", "12px")
        await expect(inset).toHaveCSS("border-top-width", "1px")
        expect(await inset.evaluate((node) => getComputedStyle(node).boxShadow)).not.toBe("none")
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
        await page.evaluate(() => document.documentElement.clientWidth)
      )
    })
