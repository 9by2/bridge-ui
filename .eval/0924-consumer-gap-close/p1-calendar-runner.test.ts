// Repro: bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p1-calendar-runner.test.ts
// Uses CDP Input.dispatchDragEvent (browser-level drag input), not synthetic DOM events.
import { expect, openPage, pollUntil, test } from "../../test/browser/support"

const out = ".eval/0924-consumer-gap-close"

test("P1-2 calendar color, muted, holiday render and real drag-hover", async () => {
  await using page = await openPage()
  for (const theme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 1280, height: 1000 })
    await page.goto(`/?preview&theme=${theme}#bridge-calendar/parity`)
    await pollUntil(() => page.locator('[aria-label="2026-09-10"]').count())
    expect(
      await page.evaluate<string>(
        `() => getComputedStyle(document.querySelector('[aria-label="Brand launch"]')).borderLeftColor`
      )
    ).toBe("rgb(124, 58, 237)")
    expect(await page.locator('[data-muted="true"]').count()).toBe(1)
    await expect(page.getByText("Office closed").first()).toBeVisible()
    await Bun.write(`${out}/p1-calendar-${theme}.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
  }
  const point = await page.evaluate<{ x: number; y: number }>(
    `() => { const r = document.querySelector('[aria-label="2026-09-10"]').parentElement.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }`
  )
  const data = { items: [{ mimeType: "text/plain", data: "queue-item" }], dragOperationsMask: 1 }
  await page.view.cdp("Input.dispatchDragEvent", { type: "dragEnter", x: point.x, y: point.y, data })
  await page.view.cdp("Input.dispatchDragEvent", { type: "dragOver", x: point.x, y: point.y, data })
  await pollUntil(() => page.locator('[data-drop-target="true"]').count())
  await Bun.write(`${out}/p1-calendar-drag-hover.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
  await page.view.cdp("Input.dispatchDragEvent", { type: "drop", x: point.x, y: point.y, data })
  await expect(page.getByLabel("Calendar event log")).toContainText("drop: Thu Sep 10 2026")
  expect(await page.locator('[data-drop-target="true"]').count()).toBe(0)
  await Bun.write(`${out}/p1-calendar-drop.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
})
