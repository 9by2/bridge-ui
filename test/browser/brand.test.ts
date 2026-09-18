import { expect, openPage, pollUntil, test } from "./support"

test("Sonner demonstrates notification feedback", async () => {
  await using page = await openPage()
  await page.goto("/?preview#sonner/default")
  const trigger = page.getByRole("button", { name: "Success", exact: true })
  await pollUntil(() => trigger.count())
  await trigger.click()
  await expect(page.getByText("Change saved", { exact: true })).toBeVisible()
})

test("menu and conversation show context", async () => {
  await using page = await openPage()
  await page.goto("/?preview#menubar/default")
  for (const name of ["File", "Edit", "View"]) {
    const item = page.getByRole("menuitem", { name, exact: true })
    await pollUntil(() => item.count())
    await expect(item).toBeVisible()
  }
  await page.goto("/?preview#message-scroller/default")
  const left = page.locator('[data-side="left"]').first()
  await pollUntil(() => left.count())
  await expect(left).toBeVisible()
  await expect(page.locator('[data-side="right"]').first()).toBeVisible()
})

test("DropArea accepts selection and exposes disabled state", async () => {
  await using page = await openPage()
  await page.goto("/?preview#drop-area/default")
  const fileInput = page.locator('input[type="file"]')
  await pollUntil(() => fileInput.count())
  await fileInput.setInputFiles([
    { name: "sample.txt", mimeType: "text/plain", content: Buffer.from("example").toString("base64") }
  ])
  await expect(page.getByRole("status")).toContainText("sample.txt")
  await fileInput.setInputFiles([
    { name: "one.txt", mimeType: "text/plain", content: Buffer.from("one").toString("base64") },
    { name: "two.txt", mimeType: "text/plain", content: Buffer.from("two").toString("base64") }
  ])
  await expect(page.getByRole("status")).toContainText("File rejected")
  await page.goto("/?preview#drop-area/disabled")
  const disabled = page.locator('[data-slot="drop-area"]')
  await pollUntil(() => disabled.count())
  await expect(disabled).toBeDisabled()
})

test("selection badge and borderless pagination remain distinct", async () => {
  await using page = await openPage()
  await page.goto("/?preview#multi-select/default")
  const selected = page.locator("[data-selected-item]")
  await pollUntil(() => selected.count())
  await expect(selected).toHaveCount(2)
  expect(await selected.first().evaluate<string>(`(element) => getComputedStyle(element).backgroundColor`)).not.toBe(
    "rgba(0, 0, 0, 0)"
  )
  await page.goto("/?preview#pagination/borderless")
  const page3 = page.getByRole("button", { name: "3", exact: true })
  await pollUntil(() => page3.count())
  await page3.click()
  await expect(page.getByRole("button", { name: "3", exact: true })).toHaveAttribute("aria-current", "page")
})

test("long TsChart page renders a distant preview", async () => {
  await using page = await openPage()
  await page.goto("/#ts-chart/default")
  const previews = page.locator("[data-preview]")
  await pollUntil(() => previews.count())
  await expect(previews).toHaveCount(190)
  expect(await page.locator("iframe").count()).toBeLessThan(8)
  const frame = page.getByTitle("TsChart Basic Sankey preview", { exact: true })
  await page.locator('[data-preview="TsChart Basic Sankey preview"]').scrollIntoViewIfNeeded()
  await pollUntil(() => frame.count(), { timeout: 15_000 })
  await expect(frame.contentFrame().locator("svg.ts-chart").first()).toBeVisible()
  expect(await page.locator("iframe[src]").count()).toBeLessThan(12)
  await expect(page.locator(".code-panel pre")).toHaveCount(0)
  await page.goto("/#button/default")
  await pollUntil(() => previews.count())
  await expect(previews).toHaveCount(4)
  expect(await page.locator("iframe").count()).toBeLessThan(5)
})
