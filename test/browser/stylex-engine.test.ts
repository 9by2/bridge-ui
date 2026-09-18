import { expect, openPage, pollUntil, test } from "./support"

test("candidate engine and media route renders without fallback", async () => {
  await using page = await openPage()
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
    const slot = page.locator("[data-pilot-theme] [data-slot]").first()
    await pollUntil(() => slot.count())
    await expect(page.getByRole("alert")).toHaveCount(0)
    await expect(slot).toBeVisible()
  }
})
