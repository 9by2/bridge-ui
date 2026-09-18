import { expect, openPage, pollUntil, pollValue, test } from "./support"

test("candidate scroll and resize preserve engine geometry", async () => {
  await using page = await openPage()
  await page.goto("/style-x?preview#scroll-area/default")
  const viewport = page.locator('[data-slot="scroll-area-viewport"]')
  await pollUntil(() => viewport.count())
  await expect(viewport).toBeVisible()
  await viewport.evaluate(`(node) => {
    node.scrollTop = 80
  }`)
  await pollValue(
    () => viewport.evaluate<number>(`(node) => node.scrollTop`),
    (value) => value > 0
  )

  await page.goto("/style-x?preview#resizable/default")
  const handle = page.getByRole("separator")
  await pollUntil(() => handle.count())
  await expect(handle).toBeVisible()
  const panel = page.locator('[data-slot="resizable-panel"]').first()
  const before = await panel.evaluate<number>(`(node) => node.getBoundingClientRect().width`)
  await handle.focus()
  await page.pressKey("ArrowRight")
  await pollValue(
    () => panel.evaluate<number>(`(node) => node.getBoundingClientRect().width`),
    (value) => value !== before
  )
})
