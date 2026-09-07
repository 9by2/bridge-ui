import { expect, test } from "@playwright/test"

test("existing attachment viewer restores focus and removal announces feedback", async ({ page }) => {
  await page.goto("/?preview#upload-list/default")
  const trigger = page.getByRole("button", { name: "Preview Existing attachment.txt" })
  await trigger.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.getByRole("button", { name: "Close preview" }).click()
  await expect(trigger).toBeFocused()
  await page.getByRole("button", { name: "Remove Existing attachment.txt" }).click()
  await expect(page.getByRole("button", { name: "Choose attachment" })).toBeFocused()
  await expect(page.getByRole("status")).toContainText("Removed Existing attachment.txt")
})

test("crop supports editing and apply remains separate from upload", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto("/?preview#image-crop/default")
  const png = await page.evaluate(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 200
    const context = canvas.getContext("2d")!
    context.fillStyle = "#ff0000"
    context.fillRect(0, 0, 200, 200)
    context.fillStyle = "#0000ff"
    context.fillRect(200, 0, 200, 200)
    return canvas.toDataURL().split(",")[1]!
  })
  await page
    .locator('input[type="file"]')
    .setInputFiles({ name: "photo.png", mimeType: "image/png", buffer: Buffer.from(png, "base64") })
  await expect(page.getByRole("button", { name: "Apply crop", exact: true })).toBeEnabled()
  await expect(page.getByRole("button", { name: "Upload applied crop" })).toBeDisabled()
  await page.getByLabel("Aspect ratio").selectOption("banner")
  await page.getByRole("button", { name: "Rotate 90 degrees" }).click()
  await page.getByLabel("Zoom", { exact: true }).fill("2")
  await page.getByLabel("Horizontal position").fill("0.25")
  await page.getByLabel("Vertical position").fill("0.75")
  await page.getByRole("button", { name: "Apply crop", exact: true }).click()
  await expect(page.getByAltText("Applied crop")).toBeVisible()
  expect(
    await page.getByAltText("Applied crop").evaluate((element) => ({
      width: (element as HTMLImageElement).naturalWidth,
      height: (element as HTMLImageElement).naturalHeight
    }))
  ).toEqual({ width: 768, height: 256 })
  await page.getByRole("button", { name: "Upload applied crop" }).click()
  await expect(page.getByRole("status").last()).toContainText("Upload callback received photo-cropped.png")
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
