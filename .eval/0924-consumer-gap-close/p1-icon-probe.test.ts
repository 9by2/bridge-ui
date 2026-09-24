// Repro: bun cmd/run-catalog-test.ts ./.eval/0924-consumer-gap-close/p1-icon-probe.test.ts
// Audit: render a neutral intrinsic-size-free SVG in every icon slot and measure the rendered box.
import { expect, openPage, pollUntil, test } from "../../test/browser/support"

test("P1-4 icon slot audit", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 1100 })
  await page.goto("/?preview&theme=light#item/custom-icon")
  await pollUntil(() => page.locator('[data-testid="placeholder-mark"]').count())
  const report = await page.evaluate<string[]>(`() => [...document.querySelectorAll('[data-testid="placeholder-mark"]')].map((node) => {
    const host = node.parentElement.closest('[data-slot]');
    const r = node.getBoundingClientRect();
    return (host?.getAttribute("data-slot") ?? "?") + " " + Math.round(r.width) + "x" + Math.round(r.height) + " color=" + getComputedStyle(node).color;
  })`)
  console.log(report.join("\n"))
  const expected: Record<string, string> = {
    "metric-tile-icon": "18x18",
    "empty-icon": "16x16",
    "data-state-media": "24x24",
    "settings-nav-item": "16x16",
    "item-media": "16x16",
    "marker-icon": "16x16",
    "sidebar-menu-button": "16x16"
  }
  for (const line of report) {
    const [slot, size] = line.split(" ")
    if (slot && expected[slot]) expect(`${slot} ${size}`).toBe(`${slot} ${expected[slot]}`)
    expect(line).not.toContain("color=rgba(0, 0, 0, 0)")
  }
  await Bun.write(".eval/0924-consumer-gap-close/p1-icon-slot.png", await page.view.screenshot({ encoding: "buffer", format: "png" }))
})

// Regression guard: explicitly sized lucide icons (width attr from `size`) keep their own size.
test("P1-4 explicitly sized icons are untouched", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#metric-tile/variants")
  await pollUntil(() => page.locator('[data-slot="metric-tile-icon"] svg').count())
  const sizes = await page.evaluate<string[]>(
    `() => [...document.querySelectorAll('[data-slot="metric-tile-icon"] svg')].map((node) => Math.round(node.getBoundingClientRect().width) + "")`
  )
  expect(new Set(sizes)).toEqual(new Set(["18"]))
})
