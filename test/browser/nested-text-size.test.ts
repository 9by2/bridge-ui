import { expect, openPage, pollUntil, test } from "./support"

// Regression (0925, nested-text-size REQ-001/002): em font sizes compounded inside Card > SwimLaneBoardItem,
// dropping Muted/Badge/StatusStamp to 10.5px. Text must stay >= 12px at any depth.
test("nested text inside Card > SwimLaneBoardItem never drops below 12px", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/?preview&theme=light#swim-lane-board/nested-text")
  await pollUntil(() => page.locator('[data-slot="swim-lane-board"] [data-slot="muted"]').count())

  const size = await page.evaluate<Record<string, number>>(
    `() => {
      const board = document.querySelector('[data-slot="swim-lane-board"]');
      const px = (selector) => parseFloat(getComputedStyle(board.querySelector(selector)).fontSize);
      return {
        muted: px('[data-slot="swim-lane-board-item"] [data-slot="card"] [data-slot="muted"]'),
        small: px('[data-slot="swim-lane-board-item"] [data-slot="small"]'),
        badge: px('[data-slot="swim-lane-board-item"] [data-slot="badge"]'),
        stamp: px('[data-slot="swim-lane-board-item"] [data-slot="status-stamp"]'),
        column: px('[data-slot="swim-lane-board-column"] span'),
      };
    }`
  )
  for (const value of Object.values(size)) expect(value).toBeGreaterThanOrEqual(12)
  expect(size.muted).toBe(14)
  expect(page.errors).toEqual([])
})

// nested-text-size REQ-003: one expanded lane fits a 390px phone with a peek of the next lane, and a
// lone expanded lane never stretches past columnMaxWidth (was minmax(220px, 1fr) -> 783px in bridge-web).
test("swim lane column fits a phone and never stretches past its maximum", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/?preview&theme=light#swim-lane-board/single-row")
  await pollUntil(() => page.locator('[data-slot="swim-lane-board-cell"]').count())
  const phone = await page.evaluate<{ lane: number; right: number; next: number }>(
    `() => {
      const board = document.querySelector('[data-slot="swim-lane-board"]').getBoundingClientRect();
      const [lane, next] = [...document.querySelectorAll('[data-slot="swim-lane-board-cell"]')].map((node) => node.getBoundingClientRect());
      return { lane: lane.width, right: board.right - lane.right, next: Math.min(next.right, board.right) - next.left };
    }`
  )
  expect(phone.lane).toBeGreaterThanOrEqual(260)
  expect(phone.right).toBeGreaterThanOrEqual(0)
  expect(phone.next).toBeGreaterThan(0)
  expect(phone.next).toBeLessThanOrEqual(80)

  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/?preview&theme=light#swim-lane-board/nested-text")
  await pollUntil(() => page.locator('[data-slot="swim-lane-board-cell"]').count())
  await page.locator('button[aria-label="Collapse In progress"]').click()
  await page.locator('button[aria-label="Collapse Done"]').click()
  await pollUntil(async () => (await page.locator('[data-slot="swim-lane-board-cell"]').count()) === 1)
  const lone = await page.evaluate<number>(
    `() => document.querySelector('[data-slot="swim-lane-board-cell"]').getBoundingClientRect().width`
  )
  expect(lone).toBeLessThanOrEqual(320)
  expect(page.errors).toEqual([])
})
