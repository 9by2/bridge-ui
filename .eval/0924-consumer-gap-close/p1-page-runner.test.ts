// Repro: bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p1-page-runner.test.ts
import { expect, openPage, pollUntil, test } from "../../test/browser/support"

const out = ".eval/0924-consumer-gap-close"

test("P1-1 page width presets resolve and never overflow on mobile", async () => {
  await using page = await openPage()
  for (const theme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 1600, height: 1000 })
    await page.goto(`/?preview&theme=${theme}#page/width`)
    await pollUntil(() => page.locator('[data-slot="page"][data-width]').count())
    const measured = await page.evaluate<Record<string, string>>(
      `() => Object.fromEntries([...document.querySelectorAll('[data-slot="page"][data-width]')].map((node) => [node.getAttribute("data-width"), getComputedStyle(node).maxWidth + "|" + getComputedStyle(node).paddingLeft]))`
    )
    expect(measured).toEqual({ full: "none|16px", content: "1280px|16px", form: "768px|16px", editor: "none|0px" })
    await Bun.write(`${out}/p1-page-width-${theme}-desktop.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
    await page.setViewportSize({ width: 390, height: 844 })
    expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
    await Bun.write(`${out}/p1-page-width-${theme}-mobile.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
  }
})

test("P1-1 header slot composes, filter spans the row and retry is operable", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/?preview&theme=light#page/header-slot")
  await pollUntil(() => page.getByRole("button", { name: "Try again" }).count())
  expect(
    await page.evaluate<boolean>(
      `() => { const header = document.querySelector('[data-slot="page-header"]').getBoundingClientRect(); const filter = document.querySelector('[data-slot="page-filter"]').getBoundingClientRect(); return Math.abs(header.width - filter.width) < 1 }`
    )
  ).toBe(true)
  await page.getByRole("button", { name: "Try again" }).click()
  await pollUntil(() => page.getByText("Retry attempt: 1").count())
  await Bun.write(`${out}/p1-page-header-slot.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth <= innerWidth`)).toBe(true)
  await Bun.write(`${out}/p1-page-header-slot-mobile.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
})

test("P1-1 sticky form action stays visible at the scroll container bottom", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/?preview&theme=light#page/form")
  await pollUntil(() => page.locator('[data-slot="page-form-action"]').count())
  const pinned = await page.evaluate<boolean>(`() => {
    const action = document.querySelector('[data-slot="page-form-action"]');
    const scroller = action.closest('.overflow-auto');
    scroller.scrollTop = 0;
    const a = action.getBoundingClientRect(); const s = scroller.getBoundingClientRect();
    return scroller.scrollHeight > scroller.clientHeight && Math.abs(a.bottom - s.bottom) < 2;
  }`)
  expect(pinned).toBe(true)
  await Bun.write(`${out}/p1-page-form-sticky.png`, await page.view.screenshot({ encoding: "buffer", format: "png" }))
})
