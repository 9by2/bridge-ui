import { expect, openPage, pollUntil, test } from "./support"

// Regression (catalog-consumer-parity): the catalog rendered SidebarHeader/Footer padding 16px/12px and menu
// button text 12.25px while a consumer rendering the same components got 8px/8px and a different size, because
// catalog utilities out-ranked package StyleX. The catalog example and an independent consumer fixture built
// from dist/ with a consumer CSS order must compute the same slot geometry and typography.
const CONSUMER_URL = process.env.CONSUMER_URL ?? "http://127.0.0.1:6008"
const Slot = [
  "sidebar-wrapper",
  "sidebar",
  "sidebar-inset",
  "sidebar-header",
  "sidebar-footer",
  "sidebar-group",
  "sidebar-group-label",
  "sidebar-menu-button",
  "sidebar-menu-sub-button",
  "dropdown-menu-content",
  "dropdown-menu-item"
] as const
const probe = `() => {
  const out = { overflow: document.documentElement.scrollWidth > innerWidth }
  for (const slot of ${JSON.stringify(Slot)}) {
    const el = document.querySelector('[data-slot="' + slot + '"]'); if (!el) continue
    const s = getComputedStyle(el); const r = el.getBoundingClientRect()
    out[slot] = [s.padding, s.gap, s.fontSize, s.lineHeight, s.fontWeight, Math.round(r.width), Math.round(r.height)].join(" ")
  }
  return out
}`

async function capture(url: string, width: number, menu: boolean) {
  await using page = await openPage()
  await page.setViewportSize({ width, height: 844 })
  await page.goto(url)
  const ready = page.locator(menu ? '[data-slot="dropdown-menu-trigger"]' : '[data-slot="sidebar-menu-button"]')
  await pollUntil(() => ready.count())
  if (menu) {
    await ready.click()
    await pollUntil(() => page.locator('[data-slot="dropdown-menu-item"]').count())
    await Bun.sleep(200)
  }
  const result = await page.evaluate<Record<string, string | boolean>>(probe)
  expect(page.errors).toEqual([])
  return result
}

for (const width of [1440, 390]) {
  for (const menu of [false, true]) {
    test(`${menu ? "dropdown menu" : "sidebar"} catalog example matches a consumer at ${width}px`, async () => {
      const route = menu ? "dropdown-menu/default" : "sidebar/default"
      const catalog = await capture(`/?preview&theme=dark#${route}`, width, menu)
      const consumer = await capture(`${CONSUMER_URL}/?view=${menu ? "menu" : "sidebar"}`, width, menu)
      expect(consumer).toEqual(catalog)
      expect(catalog.overflow).toBe(false)
      if (!menu) {
        // Accepted package default: 0.5rem (--bridge-space-2) header/footer inset, 14px root-relative menu text.
        expect(String(catalog["sidebar-header"]).split(" ")[0]).toBe("8px")
        expect(String(catalog["sidebar-footer"]).split(" ")[0]).toBe("8px")
        expect(String(catalog["sidebar-menu-button"]).split(" ")[2]).toBe("14px")
      }
    })
  }
}

// Long, TL;DR and paragraph labels stay inside the sidebar and viewport and never push a menu off-screen.
test("long sidebar and menu labels stay contained on desktop and mobile", async () => {
  for (const width of [1440, 390]) {
    await using page = await openPage()
    await page.setViewportSize({ width, height: 844 })
    await page.goto("/?preview&theme=dark#sidebar/long-label")
    await pollUntil(() => page.locator('[data-slot="sidebar-menu-button"]').count())
    const sidebar = await page.evaluate<{ overflow: boolean; height: number[]; outside: number }>(`() => {
      const bar = document.querySelector('[data-slot="sidebar"]').getBoundingClientRect()
      const button = [...document.querySelectorAll('[data-slot="sidebar-menu-button"]')].map((node) => node.getBoundingClientRect())
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        height: [...new Set(button.map((rect) => Math.round(rect.height)))],
        outside: button.filter((rect) => rect.right > bar.right + 0.5).length
      }
    }`)
    expect(sidebar).toEqual({ overflow: false, height: [32], outside: 0 })

    await page.goto("/?preview&theme=dark#dropdown-menu/long-label")
    const trigger = page.getByRole("button", { name: "Open long menu" })
    await pollUntil(() => trigger.count())
    await trigger.click()
    await pollUntil(() => page.locator('[data-slot="dropdown-menu-item"]').count())
    const menu = await page.evaluate<{ overflow: boolean; left: number; right: number; clipped: number }>(`() => {
      const rect = document.querySelector('[data-slot="dropdown-menu-content"]').getBoundingClientRect()
      const item = [...document.querySelectorAll('[data-slot="dropdown-menu-item"]')]
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        left: Math.floor(rect.left),
        right: Math.ceil(innerWidth - rect.right),
        clipped: item.filter((node) => node.scrollWidth > node.clientWidth + 1).length
      }
    }`)
    expect(menu.overflow).toBe(false)
    expect(menu.left).toBeGreaterThanOrEqual(0)
    expect(menu.right).toBeGreaterThanOrEqual(0)
    expect(menu.clipped).toBe(0)
    // The paragraph item wraps inside the menu instead of being truncated or widening it past the viewport.
    expect(
      await page.evaluate<boolean>(`() => {
        const item = [...document.querySelectorAll('[data-slot="dropdown-menu-item"]')].find((node) => node.textContent.includes("thirty days"))
        return Boolean(item) && item.getBoundingClientRect().height > 40
      }`)
    ).toBe(true)
  }
})

// bridge-web squares every control through Theme radius; that override must still reach sidebar and menu parts.
test("consumer Theme square radius reaches sidebar and menu parts", async () => {
  for (const menu of [false, true]) {
    await using page = await openPage()
    await page.goto(`${CONSUMER_URL}/?square&view=${menu ? "menu" : "sidebar"}`)
    const ready = page.locator(menu ? '[data-slot="dropdown-menu-trigger"]' : '[data-slot="sidebar-menu-button"]')
    await pollUntil(() => ready.count())
    if (menu) {
      await ready.click()
      await pollUntil(() => page.locator('[data-slot="dropdown-menu-item"]').count())
    }
    const radius = await page.evaluate<string[]>(`() => [...new Set([...document.querySelectorAll(
      '[data-slot="sidebar-menu-button"], [data-slot="sidebar-group-label"], [data-slot="dropdown-menu-content"], [data-slot="dropdown-menu-item"]'
    )].map((node) => getComputedStyle(node).borderRadius))]`)
    expect(radius).toEqual(["0px"])
  }
})
