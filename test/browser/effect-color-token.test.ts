import { expect, openPage, pollUntil, test } from "./support"

// Protects: host CSS can retint the compiled modal backdrop and elevation shadow (effect-color-token REQ-001).
test("host backdrop and shadow overrides reach compiled Dialog", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#dialog/default")
  await pollUntil(() => page.getByRole("button", { name: "Open dialog" }).count())
  await page.evaluate(`() => {
    const style = document.createElement('style');
    style.textContent = '[data-bridge-theme] { --bridge-color-backdrop: rgb(12, 34, 56); --bridge-color-shadow: rgb(200, 0, 0); }';
    document.head.append(style);
  }`)
  await page.getByRole("button", { name: "Open dialog" }).click()
  await pollUntil(() => page.locator('[data-slot="dialog-overlay"]').count())

  const overlay = page.locator('[data-slot="dialog-overlay"]')
  await pollUntil(
    async () =>
      (await overlay.evaluate<string>(`(element) => getComputedStyle(element).backgroundColor`)) === "rgb(12, 34, 56)"
  )
  expect(await overlay.evaluate<string>(`(element) => getComputedStyle(element).backgroundColor`)).toBe(
    "rgb(12, 34, 56)"
  )
  expect(page.errors).toEqual([])
  if (process.env.BRIDGE_CAPTURE_EFFECT === "1") {
    await Bun.write(
      ".eval/0925-effect-color-token/dialog-override.png",
      await page.view.screenshot({ encoding: "buffer", format: "png" })
    )
  }
})

// Protects: owned elevation shadows derive their color from --bridge-color-shadow.
test("host shadow override reaches compiled Popover", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#popover/default")
  const trigger = page.locator('.example-stage [data-slot="popover-trigger"]')
  await pollUntil(() => trigger.count())
  await trigger.click()
  const content = page.locator('[data-slot="popover-content"]')
  await pollUntil(() => content.count())
  const read = () => content.evaluate<string>(`(element) => getComputedStyle(element).boxShadow`)
  const before = await read()
  await page.evaluate(
    `() => {
      const style = document.createElement('style');
      style.textContent = '[data-bridge-theme] { --bridge-color-shadow: rgb(200, 0, 0); }';
      document.head.append(style);
    }`
  )
  const after = await pollUntil(async () => {
    const value = await read()
    return value !== before ? value : undefined
  })
  // Chrome serializes color-mix output in oklab; rgb(200 0 0) has a strongly positive a-axis.
  expect(after).toMatch(/oklab\(0\.52\d* 0\.18/)
  expect(before).not.toMatch(/oklab\(0\.52\d* 0\.18/)
  expect(page.errors).toEqual([])
  if (process.env.BRIDGE_CAPTURE_EFFECT === "1") {
    await Bun.write(
      ".eval/0925-effect-color-token/popover-override.png",
      await page.view.screenshot({ encoding: "buffer", format: "png" })
    )
  }
})
