import { expect, test } from "@playwright/test"

test("candidate scroll and resize preserve engine geometry", async ({ page }) => {
  await page.goto("/style-x?preview#scroll-area/default")
  const viewport = page.locator('[data-slot="scroll-area-viewport"]')
  await expect(viewport).toBeVisible()
  await viewport.evaluate((node) => {
    node.scrollTop = 80
  })
  await expect.poll(() => viewport.evaluate((node) => node.scrollTop)).toBeGreaterThan(0)
  await page.goto("/style-x?preview#resizable/default")
  const handle = page.getByRole("separator")
  await expect(handle).toBeVisible()
  const panel = page.locator('[data-slot="resizable-panel"]').first()
  const before = await panel.evaluate((node) => node.getBoundingClientRect().width)
  await handle.focus()
  await page.keyboard.press("ArrowRight")
  await expect.poll(() => panel.evaluate((node) => node.getBoundingClientRect().width)).not.toBe(before)
})
