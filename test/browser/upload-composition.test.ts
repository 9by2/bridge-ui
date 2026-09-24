import { expect, openPage, pollUntil, test } from "./support"

test("existing attachment viewer restores focus and removal announces feedback", async () => {
  await using page = await openPage()
  await page.goto("/?preview#upload-list/default")
  const trigger = page.getByRole("button", { name: "Preview Existing attachment.txt" })
  await pollUntil(() => trigger.count())
  await trigger.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.getByRole("button", { name: "Close preview" }).click()
  await expect(trigger).toBeFocused()
  await page.getByRole("button", { name: "Remove Existing attachment.txt" }).click()
  await expect(page.getByRole("button", { name: "Choose attachment" })).toBeFocused()
  await expect(page.getByRole("status")).toContainText("Removed Existing attachment.txt")
})

test("crop supports editing and apply remains separate from upload", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 390, height: 900 })
  await page.goto("/?preview#image-crop/default")
  const png = await page.evaluate<string>(`() => {
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 200
    const context = canvas.getContext("2d")
    context.fillStyle = "#ff0000"
    context.fillRect(0, 0, 200, 200)
    context.fillStyle = "#0000ff"
    context.fillRect(200, 0, 200, 200)
    return canvas.toDataURL().split(",")[1]
  }`)
  const fileInput = page.locator('input[type="file"]')
  await pollUntil(() => fileInput.count())
  await fileInput.setInputFiles([{ name: "photo.png", mimeType: "image/png", content: png }])
  await expect(page.getByRole("button", { name: "Apply crop", exact: true })).toBeEnabled()
  await expect(page.getByRole("button", { name: "Upload applied crop" })).toBeDisabled()
  await page.getByLabel("Aspect ratio").selectOption("banner")
  await page.getByRole("button", { name: "Rotate 90 degrees" }).click()
  await page.getByLabel("Zoom", { exact: true }).fill("2")
  await page.getByLabel("Horizontal position").fill("0.25")
  await page.getByLabel("Vertical position").fill("0.75")
  await page.getByRole("button", { name: "Apply crop", exact: true }).click()
  const applied = page.getByAltText("Applied crop")
  await expect(applied).toBeVisible()
  expect(
    await applied.evaluate<{ width: number; height: number }>(
      `(element) => ({ width: element.naturalWidth, height: element.naturalHeight })`
    )
  ).toEqual({ width: 768, height: 256 })
  await page.getByRole("button", { name: "Upload applied crop" }).click()
  await expect(page.getByRole("status").last()).toContainText("Upload callback received photo-cropped.png")
  expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
})

// Protects upload-validation REQ-003/REQ-005: validator issue renders an inline alert without a toast,
// accepted image renders in the grid, and keyboard remove returns focus to the drop target.
test("validated upload reports inline issue and keyboard remove restores focus", async () => {
  await using page = await openPage()
  await page.goto("/?preview#upload-list/validation")
  const input = page.locator('input[type="file"]')
  await pollUntil(() => input.count())
  await page.evaluate(`() => {
    const input = document.querySelector('input[type="file"]')
    const transfer = new DataTransfer()
    transfer.items.add(new File(["png"], "photo.png", { type: "image/png" }))
    transfer.items.add(new File(["pdf"], "notes.pdf", { type: "application/pdf" }))
    input.files = transfer.files
    input.dispatchEvent(new Event("change", { bubbles: true }))
  }`)
  await expect(page.getByRole("alert")).toContainText("notes.pdf: choose a PNG, JPEG or WebP image")
  expect(await page.locator("[data-sonner-toaster], [data-sonner-toast]").count()).toBe(0)
  const remove = page.getByRole("button", { name: "Remove photo.png" })
  await pollUntil(() => remove.count())
  await remove.focus()
  await page.pressKey("Enter")
  await expect(page.getByRole("button", { name: "Choose image" })).toBeFocused()
  await expect(page.getByRole("status").first()).toContainText("Removed photo.png")
})
