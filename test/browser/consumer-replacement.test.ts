import { expect, openPage, pollUntil, test } from "./support"

// G1: status states render in a real dialog and close restores focus to the opening trigger.
test("viewer status states and close restore focus", async () => {
  await using page = await openPage()
  await page.goto("/?preview#upload-viewer/status")
  const loading = page.getByRole("button", { name: "Preview loading" })
  await pollUntil(() => loading.count())
  await loading.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("dialog").getByRole("status")).toContainText("Loading contract…")
  expect(await page.getByRole("link", { name: "Download" }).count()).toBe(0)
  expect(await page.getByRole("button", { name: "Open in new tab" }).count()).toBe(0)
  await page.pressKey("Escape")
  await expect(loading).toBeFocused()

  const error = page.getByRole("button", { name: "Preview error" })
  await error.click()
  await expect(page.getByRole("alert")).toContainText("This file could not be displayed.")
  expect(await page.getByRole("link", { name: "Download" }).count()).toBe(0)
  await page.getByRole("button", { name: "Close preview" }).click()
  await expect(error).toBeFocused()

  await page.getByRole("button", { name: "Preview ready" }).click()
  await expect(page.getByRole("link", { name: "Download" })).toBeVisible()
  await expect(page.getByRole("button", { name: "Open in new tab" })).toBeVisible()
})

// G5: keyboard removal through a named per-chip remove control.
test("chip remove is named per chip and operable by keyboard", async () => {
  await using page = await openPage()
  await page.goto("/?preview#combobox/chip")
  const remove = page.getByRole("button", { name: "Remove Jazz" })
  await pollUntil(() => remove.count())
  await expect(page.getByRole("button", { name: "Remove Soul" })).toBeVisible()
  await remove.focus()
  await page.pressKey("Enter")
  await expect(page.getByRole("button", { name: "Remove Jazz" })).toHaveCount(0)
  await expect(page.getByRole("button", { name: "Remove Soul" })).toBeVisible()
  expect(await page.evaluate<boolean>(`() => document.activeElement !== document.body`)).toBe(true)
})

// G4: documented visual contract — full fills the row, default stays intrinsic; both open by keyboard.
test("full-width multi-select fills its row and default stays intrinsic", async () => {
  await using page = await openPage()
  await page.goto("/?preview#multi-select/full-width")
  const full = page.getByRole("combobox", { name: "Genre" })
  const intrinsic = page.getByRole("combobox", { name: "Team" })
  await pollUntil(() => full.count())
  const width = await page.evaluate<{ full: number; intrinsic: number; row: number }>(`() => {
    const [full, intrinsic] = [...document.querySelectorAll('[role="combobox"]')]
    return {
      full: full.getBoundingClientRect().width,
      intrinsic: intrinsic.getBoundingClientRect().width,
      row: full.parentElement.getBoundingClientRect().width
    }
  }`)
  expect(Math.abs(width.full - width.row)).toBeLessThanOrEqual(1)
  expect(width.intrinsic).toBeLessThan(width.row - 40)
  await full.focus()
  await page.pressKey("Enter")
  await expect(page.getByRole("option", { name: "Pop" })).toBeVisible()
  await page.pressKey("Escape")
  await expect(full).toBeFocused()
})

// G2: preview=none keeps selection running; raw DropArea recipe reports each file once.
test("upload preview none keeps selection and raw drop surface reports once", async () => {
  await using page = await openPage()
  await page.goto("/?preview#upload-list/preview")
  const none = page.getByRole("button", { name: "none" })
  await pollUntil(() => none.count())
  await none.click()
  expect(await page.getByRole("button", { name: "Remove brief.pdf" }).count()).toBe(0)
  await page.evaluate(`() => {
    const input = document.querySelector('input[type="file"]')
    const transfer = new DataTransfer()
    transfer.items.add(new File(["a"], "cover.png", { type: "image/png" }))
    input.files = transfer.files
    input.dispatchEvent(new Event("change", { bubbles: true }))
  }`)
  await expect(page.getByText("2 attachment(s) in value (items hidden).")).toBeVisible()
  await page.getByRole("button", { name: "thumbnail" }).click()
  await expect(page.getByRole("button", { name: "Remove cover.png" })).toBeVisible()
  // Regression: thumbnail in list layout rendered one full-width square tile per row.
  const tile = await page.evaluate<{ tile: number; row: number }>(`() => {
    const list = document.querySelector('[data-slot="upload-list"] ul')
    return { tile: list.firstElementChild.getBoundingClientRect().width, row: list.getBoundingClientRect().width }
  }`)
  expect(tile.tile).toBeLessThan(tile.row / 2)

  await page.goto("/?preview#drop-area/surface")
  const surface = page.getByRole("button", { name: "Choose CMS media" })
  await pollUntil(() => surface.count())
  await page.evaluate(`() => {
    const input = document.querySelector('input[type="file"]')
    const transfer = new DataTransfer()
    transfer.items.add(new File(["a"], "hero.png", { type: "image/png" }))
    transfer.items.add(new File(["b"], "notes.txt", { type: "text/plain" }))
    input.files = transfer.files
    input.dispatchEvent(new Event("change", { bubbles: true }))
  }`)
  await expect(page.getByRole("status")).toContainText("Accepted hero.png. Rejected notes.txt")
  expect(await page.locator('[data-slot="drop-area"] [data-slot="drop-area"]').count()).toBe(0)
})
