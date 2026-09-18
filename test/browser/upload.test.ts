import { expect, openPage, pollUntil, test } from "./support"

for (const layout of ["inline", "compact", "media", "file-list", "avatar", "document", "transfer", "crop"]) {
  test(`upload ${layout} selects and removes file on mobile`, async () => {
    await using page = await openPage()
    await page.setViewportSize({ width: 390, height: 800 })
    await page.goto(`/?preview#drop-area/${layout}`)
    const image = ["media", "avatar", "crop"].includes(layout)
    const png = image
      ? await page.evaluate<string>(`() => {
          const canvas = document.createElement("canvas")
          canvas.width = canvas.height = 32
          const context = canvas.getContext("2d")
          context.fillStyle = "#2563eb"
          context.fillRect(0, 0, 32, 32)
          return canvas.toDataURL().split(",")[1]
        }`)
      : ""
    const fileInput = page.locator('input[type="file"]')
    await pollUntil(() => fileInput.count())
    await fileInput.setInputFiles([
      {
        name: image ? "sample.png" : "sample.pdf",
        mimeType: image ? "image/png" : "application/pdf",
        content: image ? png : Buffer.from("sample").toString("base64")
      }
    ])
    await expect(page.getByRole("status")).toContainText("sample")
    if (layout === "crop") {
      await page.getByRole("button", { name: "Crop and upload" }).click()
      await expect(page.getByRole("status")).toContainText("Upload callback received cropped.png")
    }
    if (layout === "transfer") {
      await page.getByRole("button", { name: "Trigger upload callback" }).click()
      await expect(page.getByRole("status")).toContainText("Upload callback received sample.pdf")
    }
    await page.getByRole("button", { name: "Remove sample" }).click()
    await expect(page.getByRole("status")).toContainText("No file selected")
    expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
  })
}
