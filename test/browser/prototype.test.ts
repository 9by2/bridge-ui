import { expect, openPage, pollUntil, test } from "./support"

// Protects spec console-prototype REQ-003: each console prototype renders every navigation page from package
// defaults without a runtime error, keeps the shell title in sync with navigation, and never overflows a 390px
// viewport (regression: an implicit auto grid track sized to MetricTile content pushed the Backstage dashboard 62px
// wide; caller layout grids must use `grid-cols-1` / minmax(0, 1fr)).
const Prototype = { backstage: "default", admin: "admin" } as const

for (const [name, example] of Object.entries(Prototype)) {
  test(`${name} console renders every page without error`, async () => {
    await using page = await openPage({ width: 1440, height: 900 })
    await page.goto(`/?preview&theme=light#prototype/${example}`)
    await pollUntil(() => page.locator('[data-slot="sidebar-menu-button"][data-page]').count())
    const route = await page.evaluate<string[]>(
      `() => [...document.querySelectorAll('[data-page]')].map((node) => node.getAttribute('data-page'))`
    )
    expect(route.length).toBeGreaterThan(8)
    for (const id of route) {
      const label = await page.evaluate<string>(
        `() => { const node = document.querySelector('[data-page="${id}"]'); node.click(); return node.textContent.trim() }`
      )
      await pollUntil(
        async () =>
          (await page.evaluate<string>(
            `() => document.querySelector('[data-slot="shell-header-title"]')?.textContent ?? ""`
          )) === label
      )
      const state = await page.evaluate<{ current: string | null; crashed: boolean }>(`() => ({
        current: document.querySelector('[aria-current="page"][data-page]')?.getAttribute('data-page') ?? null,
        crashed: [...document.querySelectorAll('[role="alert"]')].some((node) => /could not render/.test(node.textContent ?? ''))
      })`)
      expect(state).toEqual({ current: id, crashed: false })
    }
    expect(page.errors).toEqual([])
  })

  test(`${name} console default page fits a 390px viewport`, async () => {
    await using page = await openPage({ width: 390, height: 844 })
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`/?preview&theme=light#prototype/${example}`)
    await pollUntil(() => page.locator('[data-slot="shell-header"]').count())
    await Bun.sleep(300)
    expect(await page.evaluate<boolean>(`() => document.documentElement.scrollWidth > innerWidth`)).toBe(false)
    expect(page.errors).toEqual([])
  })
}
