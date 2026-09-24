import { expect, openPage, pollUntil, test } from "./support"

const highlighted = `() => [...document.querySelectorAll('[data-drop-target="true"] > button')].map((node) => node.getAttribute("aria-label")).join(",")`

const fire = (type: string, day: string, related?: string) => `() => {
  window.__bridgeTransfer ??= new DataTransfer()
  const cell = (value) => document.querySelector('[aria-label="' + value + '"]').parentElement
  cell(${JSON.stringify(day)}).dispatchEvent(new DragEvent(${JSON.stringify(type)}, {
    bubbles: true,
    cancelable: true,
    dataTransfer: window.__bridgeTransfer,
    relatedTarget: ${related ? `cell(${JSON.stringify(related)})` : "null"}
  }))
}`

// Protects bridge-calendar REQ-009: drag-hover is a browser-only DragEvent lifecycle contract.
test("month drag-hover highlights the hovered day and clears after drop", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/?preview&theme=light#bridge-calendar/parity")
  await pollUntil(() => page.locator('[aria-label="2026-09-10"]').count())
  for (const [type, day, related, expected] of [
    ["dragenter", "2026-09-10", undefined, "2026-09-10"],
    ["dragover", "2026-09-10", undefined, "2026-09-10"],
    ["dragenter", "2026-09-11", undefined, "2026-09-11"],
    ["dragleave", "2026-09-10", "2026-09-11", "2026-09-11"],
    ["drop", "2026-09-11", undefined, ""]
  ] as const) {
    await page.evaluate(fire(type, day, related))
    await pollUntil(async () => ((await page.evaluate<string>(highlighted)) === expected ? 1 : 0))
    expect(await page.evaluate<string>(highlighted)).toBe(expected)
  }
  await expect(page.getByLabel("Calendar event log")).toContainText("drop: Fri Sep 11 2026")
})

// Protects bridge-calendar REQ-009: abandoning a drag (dragend without drop) clears the highlight.
test("month drag-hover clears when the drag is abandoned", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#bridge-calendar/parity")
  await pollUntil(() => page.locator('[aria-label="2026-09-10"]').count())
  await page.evaluate(`() => {
    const cell = document.querySelector('[aria-label="2026-09-10"]').parentElement
    cell.dispatchEvent(new DragEvent("dragenter", { bubbles: true, dataTransfer: new DataTransfer() }))
  }`)
  await pollUntil(() => page.locator('[data-drop-target="true"]').count())
  await page.evaluate(`() => document.dispatchEvent(new DragEvent("dragend", { bubbles: true }))`)
  await pollUntil(async () => ((await page.locator('[data-drop-target="true"]').count()) === 0 ? 1 : 0))
  expect(await page.locator('[data-drop-target="true"]').count()).toBe(0)
})

// Protects bridge-calendar REQ-010: keyboard Enter on a focused event maps to onEventActivate.
test("keyboard Enter on an event activates it", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#bridge-calendar/parity")
  const launch = page.getByRole("button", { name: "Brand launch" })
  await pollUntil(() => launch.count())
  await launch.focus()
  await page.pressKey("Enter")
  await expect(page.getByLabel("Calendar event log")).toContainText("activate: launch")
})
