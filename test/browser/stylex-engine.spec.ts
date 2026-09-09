import { expect, test } from "@playwright/test"

test("candidate engine and media route renders without fallback", async ({ page }) => {
  for (const name of [
    "chart",
    "calendar",
    "sidebar",
    "carousel",
    "attachment",
    "message",
    "bubble",
    "questionnaire",
    "drop-area",
    "upload-preview",
    "upload-viewer",
    "upload-list",
    "image-crop"
  ]) {
    await page.goto(`/style-x?preview#${name}/default`)
    await expect(page.getByRole("alert")).toHaveCount(0)
    await expect(page.locator("[data-pilot-theme] [data-slot]").first()).toBeVisible()
  }
})
