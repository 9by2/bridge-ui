import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const AppConfig = {
  BASE_URL: "http://127.0.0.1:61637",
  OUTPUT: ".eval/0922-bridge-calendar-extraction"
} as const

const output = path.resolve(AppConfig.OUTPUT)
await mkdir(output, { recursive: true })

const result = []
for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 900 }
]) {
  await using view = new Bun.WebView({
    width: viewport.width,
    height: viewport.height,
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
  })
  await view.navigate("about:blank")
  await view.cdp("Page.navigate", { url: `${AppConfig.BASE_URL}/?preview&theme=light#bridge-calendar/default` })
  await ready(view, '[data-slot="bridge-calendar"]')
  await view.evaluate("document.fonts.ready")
  await view.evaluate(`Array.from(document.querySelectorAll('[role="tab"]')).find((element) => element.textContent === "Week")?.click()`)
  await ready(view, '[role="tabpanel"][data-view="week"]')

  const page = await view.evaluate<{ overflow: boolean; view: string | undefined; eventCount: number; allDayCount: number; packedOverlap: boolean }>(`(() => ({
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    view: document.querySelector('[role="tabpanel"]')?.getAttribute('data-view') ?? undefined,
    eventCount: document.querySelectorAll('[data-slot="bridge-calendar"] button').length,
    timeCount: document.querySelectorAll('[role="tabpanel"] [data-slot="bridge-calendar-time"]').length,
    hasCurrentTime: Boolean(document.querySelector('[aria-label="Current time"]')),
    allDayCount: document.querySelectorAll('[data-slot="bridge-calendar-all-day"] button').length,
    packedOverlap: Array.from(document.querySelectorAll('[data-slot="bridge-calendar-all-day"] ~ div button')).some((element) => element.parentElement?.style.width === '50%')
  }))()`)
  assert.equal(page.overflow, false)
  assert.equal(page.view, "week")
  assert.ok(page.eventCount > 3)
  assert.equal(page.timeCount, 24)
  assert.equal(page.hasCurrentTime, true)
  assert.equal(page.allDayCount, 1)
  assert.equal(page.packedOverlap, true)
  await Bun.write(path.join(output, `bridge-calendar-${viewport.name}.png`), await view.screenshot())
  result.push({ viewport, page })
}

await Bun.write(path.join(output, "report.json"), JSON.stringify(result, null, 2))

async function ready(view: Bun.WebView, selector: string): Promise<void> {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await view.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await Bun.sleep(25)
  }
  throw new Error(`Timed out waiting for ${selector}`)
}
