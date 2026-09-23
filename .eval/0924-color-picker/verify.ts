import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const AppConfig = {
  BASE_URL: process.env.CATALOG_URL ?? "http://127.0.0.1:6007",
  OUTPUT: ".eval/0924-color-picker"
} as const

const output = path.resolve(AppConfig.OUTPUT)
await mkdir(output, { recursive: true })
const report: unknown[] = []

async function ready(view: Bun.WebView, selector: string) {
  for (let attempt = 0; attempt < 200; attempt++) {
    if (await view.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await Bun.sleep(25)
  }
  throw new Error(`Timed out waiting for ${selector}`)
}

async function open(view: Bun.WebView, route: string, theme = "light") {
  await view.cdp("Page.navigate", { url: `${AppConfig.BASE_URL}/?preview&theme=${theme}#${route}` })
  await ready(view, '[data-slot="color-picker"]')
  await view.evaluate("document.fonts.ready")
  await Bun.sleep(150)
}

for (const viewport of [
  { name: "desktop", width: 1024, height: 900 },
  { name: "mobile", width: 390, height: 900 }
]) {
  await using view = new Bun.WebView({
    width: viewport.width,
    height: viewport.height,
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
  })
  await view.navigate("about:blank")

  // 1. Reference layout: 23 preset + custom trigger, white selected.
  await open(view, "color-picker/default")
  const initial = await view.evaluate<{ radio: number; checked: string | null; more: number; overflow: boolean }>(`(() => ({
    radio: document.querySelectorAll('[role="radio"]').length,
    checked: document.querySelector('[role="radio"][aria-checked="true"]')?.getAttribute('aria-label') ?? null,
    more: document.querySelectorAll('[data-slot="color-picker-custom"]').length,
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
  }))()`)
  assert.equal(initial.radio, 23)
  assert.equal(initial.checked, "White")
  assert.equal(initial.more, 1)
  await Bun.write(path.join(output, `default-${viewport.name}.png`), await view.screenshot())

  // 2. Keyboard: arrow key moves selection.
  await view.evaluate(`document.querySelector('[role="radio"][aria-checked="true"]').focus()`)
  await view.press("ArrowRight")
  await Bun.sleep(80)
  const keyboard = await view.evaluate<string | null>(
    `document.activeElement?.getAttribute('aria-checked') === 'true' ? document.activeElement.getAttribute('aria-label') : null`
  )
  assert.equal(keyboard, "Slate")

  // 3. Custom popover commits valid hex.
  await open(view, "color-picker/custom")
  await view.evaluate(`document.querySelector('[data-slot="color-picker-custom"]').click()`)
  await ready(view, '[data-slot="popover-content"] input:not([type="color"])')
  await view.evaluate(`(() => {
    const input = document.querySelector('[data-slot="popover-content"] input:not([type="color"])')
    input.focus()
    input.select()
  })()`)
  await view.type("#3366cc")
  await Bun.sleep(150)
  await Bun.write(path.join(output, `custom-open-${viewport.name}.png`), await view.screenshot())
  const custom = await view.evaluate<{ output: string | undefined; checked: string | null }>(`(() => ({
    output: document.querySelector('output')?.textContent ?? undefined,
    checked: document.querySelector('[role="radio"][aria-checked="true"]')?.getAttribute('aria-label') ?? null
  }))()`)
  assert.equal(custom.output, "#3366cc")
  assert.equal(custom.checked, "#3366cc")
  await view.press("Escape")
  await Bun.sleep(150)
  const focusBack = await view.evaluate<string | null>(`document.activeElement?.getAttribute('data-slot') ?? null`)
  assert.equal(focusBack, "color-picker-custom")

  // 4. Variants and states; row layout must not overflow document.
  await open(view, "color-picker/variants")
  const variants = await view.evaluate<{ overflow: boolean }>(`({ overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth })`)
  assert.equal(variants.overflow, false)
  await Bun.write(path.join(output, `variants-${viewport.name}.png`), await view.screenshot())
  await open(view, "color-picker/states")
  await Bun.write(path.join(output, `states-${viewport.name}.png`), await view.screenshot())

  report.push({ viewport, initial, keyboard, custom, focusBack, variants })
}

await Bun.write(path.join(output, "report.json"), JSON.stringify(report, null, 2))
console.log("ok")
