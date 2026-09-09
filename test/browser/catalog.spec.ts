import { readdirSync } from "node:fs"

import AxeBuilder from "@axe-core/playwright"
import { test, expect } from "@playwright/test"

const root = "internal/catalog/example"
test("embedded chart geometry survives full catalog navigation", async ({ page }) => {
  await page.goto("/#chart/default")
  for (const name of ["Treemap", "Scatter", "Sankey"]) {
    const frame = page.getByTitle(`Chart ${name} preview`)
    await page.locator(`[data-preview="Chart ${name} preview"]`).scrollIntoViewIfNeeded()
    await expect(frame.contentFrame().locator("svg").first()).toBeVisible()
    expect(await frame.contentFrame().locator("svg path, svg rect").count()).toBeGreaterThan(1)
  }
})
for (const count of [2, 4]) {
  test(`calendar range with ${count} months`, async ({ page }) => {
    await page.goto(`/?preview#calendar/range-${count}`)
    await expect(page.getByRole("grid")).toHaveCount(count)
    await page.getByRole("button", { name: "Clear range", exact: true }).click()
    await page.locator('[data-day="9/10/2026"]').click()
    await page.locator('[data-day="10/15/2026"]').click()
    await expect(page.getByRole("status", { name: "Selected range" })).toContainText("Sep 10, 2026")
    await expect(page.getByRole("status", { name: "Selected range" })).toContainText("Oct 15, 2026")
  })
}
for (const file of readdirSync(`${root}/chart`)) {
  test(`chart dark ${file}`, async ({ page }) => {
    await page.goto(`/?preview#chart/${file.replace(".tsx", "")}`)
    await expect(page.locator("html")).toHaveClass("dark")
    await expect(page.locator('[data-slot="chart"]').first()).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([])
  })
}
test("attachment media icon identifies image, video and file", async ({ page }) => {
  await page.goto("/?preview#attachment/media")
  for (const label of ["Image", "Video", "File"]) {
    await expect(page.getByRole("img", { name: label, exact: true })).toBeVisible()
  }
  await expect(page.getByText("landscape.png", { exact: true })).toBeVisible()
  await expect(page.getByText("walkthrough.mp4", { exact: true })).toBeVisible()
  await expect(page.getByText("design-system.pdf", { exact: true })).toBeVisible()
})

for (const name of readdirSync(root)) {
  for (const file of readdirSync(`${root}/${name}`)) {
    const example = file.replace(".tsx", "")
    test(`${name}/${example} renders accessibly`, async ({ page }) => {
      const errors: string[] = []
      page.on("pageerror", (error) => errors.push(error.message))
      await page.goto(`/?preview&theme=light#${name}/${example}`)
      await expect(page.locator(".example-stage")).toBeVisible()
      if (name === "ts-chart") {
        await expect(page.locator("svg.ts-chart").first()).toBeVisible()
        await expect(page.locator("svg.ts-chart [data-ts-key=marks] > g").first()).toBeAttached()
        await expect(page.getByText("Loading preview...", { exact: true })).toHaveCount(0)
      }
      await expect(page.getByText("Loading preview...")).toHaveCount(0)
      await expect(page.getByText("This example could not render.", { exact: false })).toHaveCount(0)
      await page.evaluate(() => document.fonts.ready)
      if (name === "dropdown-menu" && example === "item-variant") {
        await page.getByRole("button", { name: "Menu", exact: true }).click()
        await page.getByRole("menuitem", { name: "Default", exact: true }).focus()
      }
      const result = await new AxeBuilder({ page }).analyze()
      if (name === "dropdown-menu" && example === "item-variant") {
        await test.info().attach("menu-accessibility-review", {
          body: JSON.stringify(result.incomplete, null, 2),
          contentType: "application/json"
        })
      }
      expect(result.violations).toEqual([])
      expect(errors).toEqual([])
    })
  }
}

test("browse inline example, source, theme and mobile", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/#button/default")
  await expect(page.locator("html")).toHaveClass("dark")
  await expect(page.getByRole("heading", { name: "Button", exact: true })).toBeVisible()
  await expect(page.getByLabel("Example", { exact: true })).toHaveCount(0)
  await expect(page.locator("[data-preview]")).toHaveCount(4)
  for (const heading of ["Default", "Semantic", "Size", "Variant"]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible()
  }
  await page.getByText("View code", { exact: true }).first().click()
  await expect(page.locator(".code-panel code").first()).toContainText("export default function Example")
  await page.getByRole("button", { name: "Copy code" }).first().click()
  await expect(page.getByRole("button", { name: "Copied", exact: true })).toBeVisible()
  await page.getByLabel("Toggle theme").click()
  await expect(page.locator("html")).not.toHaveClass("dark")
  await page.getByLabel("Find a component").fill("dialog")
  await page.getByRole("link", { name: "Dialog", exact: true }).click()
  await expect(page.getByRole("heading", { name: "Dialog", exact: true })).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole("button", { name: "Browse", exact: true }).click()
  await expect(page.getByLabel("Find a component")).toBeVisible()
  const sidebar = page.locator(".catalog-sidebar")
  expect(await sidebar.evaluate((node) => node.getBoundingClientRect().right)).toBeLessThanOrEqual(390)
  expect(
    await page.locator(".header-action").evaluate((node) => node.getBoundingClientRect().right)
  ).toBeLessThanOrEqual(390)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test("core interaction remains executable", async ({ page }) => {
  await page.goto("/?preview#button/default")
  await page.getByRole("button", { name: "Continue" }).click()
  await expect(page.getByRole("button", { name: "Continue" })).toBeFocused()
  await page.goto("/?preview#input/default")
  await page.getByRole("textbox").fill("Bridge")
  await expect(page.getByRole("textbox")).toHaveValue("Bridge")
  await page.goto("/?preview#checkbox/default")
  await page.getByRole("checkbox").click()
  await expect(page.getByRole("checkbox")).toBeChecked()
  await page.goto("/?preview#select/default")
  await page.getByRole("combobox").click()
  await page.getByRole("option").first().click()
  await expect(page.getByRole("combobox")).not.toHaveText("Select role")
  await page.goto("/?preview#dialog/default")
  await page.getByRole("button", { name: "Open dialog" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await page.goto("/?preview#popover/default")
  await page.getByRole("button", { name: "Open popover" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.goto("/?preview#tabs/default")
  await page.getByRole("tab", { name: "Two" }).click()
  await expect(page.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true")
  await page.goto("/?preview#accordion/default")
  const trigger = page.getByRole("button", { name: "Can I reuse this?" })
  await trigger.click()
  await expect(trigger).toHaveAttribute("aria-expanded", "false")
  await page.goto("/?preview#tooltip/default")
  await page.mouse.move(0, 0)
  await page.getByRole("button", { name: "Hover me" }).hover()
  await expect(page.getByText("Helpful detail", { exact: true })).toBeVisible()
  await page.goto("/?preview#toast/default")
  await page.getByRole("button", { name: "Show toast" }).click()
  await expect(page.getByText("Saved", { exact: true })).toBeVisible()
})
