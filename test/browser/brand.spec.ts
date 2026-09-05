import { test, expect } from "@playwright/test"

test("Sonner demonstrates notification feedback", async ({ page }) => {
  await page.goto("/?preview#sonner/default")
  await page.getByRole("button", { name: "Success", exact: true }).click()
  await expect(page.getByText("Change saved", { exact: true })).toBeVisible()
})

test("menu and conversation show context", async ({ page }) => {
  await page.goto("/?preview#menubar/default")
  for (const name of ["File", "Edit", "View"])
    await expect(page.getByRole("menuitem", { name, exact: true })).toBeVisible()
  await page.goto("/?preview#message-scroller/default")
  await expect(page.locator('[data-side="left"]').first()).toBeVisible()
  await expect(page.locator('[data-side="right"]').first()).toBeVisible()
})

test("DropArea accepts selection and exposes disabled state", async ({ page }) => {
  await page.goto("/?preview#drop-area/default")
  await page
    .locator('input[type="file"]')
    .setInputFiles({ name: "sample.txt", mimeType: "text/plain", buffer: Buffer.from("example") })
  await expect(page.getByRole("status")).toContainText("sample.txt")
  await page.locator('input[type="file"]').setInputFiles([
    { name: "one.txt", mimeType: "text/plain", buffer: Buffer.from("one") },
    { name: "two.txt", mimeType: "text/plain", buffer: Buffer.from("two") }
  ])
  await expect(page.getByRole("status")).toContainText("File rejected")
  await page.goto("/?preview#drop-area/disabled")
  await expect(page.locator('[data-slot="drop-area"]')).toBeDisabled()
})

test("selection badge and borderless pagination remain distinct", async ({ page }) => {
  await page.goto("/?preview#multi-select/default")
  await expect(page.locator("[data-selected-item]")).toHaveCount(2)
  expect(
    await page
      .locator("[data-selected-item]")
      .first()
      .evaluate((element) => getComputedStyle(element).backgroundColor)
  ).not.toBe("rgba(0, 0, 0, 0)")
  await page.goto("/?preview#pagination/borderless")
  await page.getByRole("button", { name: "3", exact: true }).click()
  await expect(page.getByRole("button", { name: "3", exact: true })).toHaveAttribute("aria-current", "page")
})

test("long TsChart page renders a distant preview", async ({ page }) => {
  await page.goto("/#ts-chart/default")
  await expect(page.locator("[data-preview]")).toHaveCount(190)
  expect(await page.locator("iframe").count()).toBeLessThan(8)
  const frame = page.getByTitle("TsChart Basic Sankey preview", { exact: true })
  await page.locator('[data-preview="TsChart Basic Sankey preview"]').scrollIntoViewIfNeeded()
  await expect(frame.contentFrame().locator("svg.ts-chart").first()).toBeVisible()
  expect(await page.locator("iframe[src]").count()).toBeLessThan(12)
  await expect(page.locator(".code-panel pre")).toHaveCount(0)
  await page.goto("/#button/default")
  await expect(page.locator("[data-preview]")).toHaveCount(4)
  expect(await page.locator("iframe").count()).toBeLessThan(5)
})
