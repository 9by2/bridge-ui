import { expect, openPage, pollUntil, runAxe, test } from "./support"

const evidence = ".eval/0929-rich-content-parity"
const route = ["default", "long", "table", "code", "nested-list", "media", "mobile"].map(
  (name) => `rich-content/${name}`
)

// Protects: wide tables and long code scroll inside their own region instead of overflowing the page.
test("rich content stays within the viewport on desktop and mobile", async () => {
  await using page = await openPage()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 844 })
    for (const path of route) {
      await page.goto(`/?preview&theme=light#${path}`)
      await pollUntil(() => page.locator('[data-slot="rich-content"]').count())
      expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`), path).toBe(true)
      await pollUntil(() =>
        page.evaluate<boolean>(
          `() => [...document.images].filter((image) => image.getBoundingClientRect().top < innerHeight).every((image) => image.complete && image.naturalWidth > 0)`
        )
      )
      await Bun.write(
        `${evidence}/${path.replace("/", "-")}-${width}.png`,
        await page.view.screenshot({ encoding: "buffer", format: "png" })
      )
    }
  }
  expect(page.errors).toEqual([])
})

// Protects: code copy works through the real Clipboard API and keyboard activation.
test("code block copy writes to the clipboard and confirms", async () => {
  await using page = await openPage()
  await page.grantClipboardPermission()
  await page.goto("/?preview&theme=light#rich-content/code")
  const button = page.locator('[data-slot="rich-content-code-block"] [data-slot="rich-content-copy"]').first()
  await pollUntil(() => button.count())
  await button.focus()
  await page.pressKey("Enter")
  await expect(page.getByRole("button", { name: "Copied", exact: true })).toBeVisible()
  const copied = await page.evaluate<string>(`() => navigator.clipboard.readText()`)
  expect(copied).toContain('import { RichContent } from "@bridge/ui/rich-content"')
  expect(page.errors).toEqual([])
})

// Protects: table region, header scopes, page-break separator and copy buttons compose accessibly.
test("table and code archetypes are accessible", async () => {
  await using page = await openPage()
  for (const path of ["rich-content/table", "rich-content/code", "rich-content/nested-list"]) {
    await page.goto(`/?preview&theme=light#${path}`)
    await pollUntil(() => page.locator('[data-slot="rich-content"]').count())
    const result = await runAxe(page.view)
    expect(result.violations, path).toEqual([])
  }
  expect(page.errors).toEqual([])
})
