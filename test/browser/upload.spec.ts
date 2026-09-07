import { expect, test } from "@playwright/test"

for (const layout of ["inline", "compact", "media", "file-list", "avatar", "document", "transfer", "crop"]) {
  test(`upload ${layout} selects and removes file on mobile`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 })
    await page.goto(`/?preview#drop-area/${layout}`)
    const image = ["media", "avatar", "crop"].includes(layout)
    const png = image
      ? await page.evaluate(() => {
          const canvas = document.createElement("canvas")
          canvas.width = canvas.height = 32
          const context = canvas.getContext("2d")!
          context.fillStyle = "#2563eb"
          context.fillRect(0, 0, 32, 32)
          return canvas.toDataURL().split(",")[1]!
        })
      : ""
    await page.locator('input[type="file"]').setInputFiles({
      name: image ? "sample.png" : "sample.pdf",
      mimeType: image ? "image/png" : "application/pdf",
      buffer: image ? Buffer.from(png, "base64") : Buffer.from("sample")
    })
    await expect(page.getByRole("status")).toContainText("sample")
    if (layout === "crop") {
      await page.getByRole("button", { name: "Crop and upload" }).click()
      await expect(page.getByRole("status")).toContainText("Upload callback received cropped.png")
    }
    if (layout === "transfer") {
      await page.getByRole("button", { name: "Trigger upload callback" }).click()
      await expect(page.getByRole("status")).toContainText("Upload callback received sample.pdf")
    }
    await page.getByRole("button", { name: "Remove sample", exact: false }).click()
    await expect(page.getByRole("status")).toContainText("No file selected")
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
