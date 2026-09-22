import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const AppConfig = {
  BASE_URL: "http://127.0.0.1:6013",
  OUTPUT: ".eval/0922-cue-typography"
} as const

const output = path.resolve(AppConfig.OUTPUT)
await mkdir(output, { recursive: true })

await using view = new Bun.WebView({
  width: 390,
  height: 900,
  backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
})
await view.navigate("about:blank")
await view.cdp("Page.navigate", { url: `${AppConfig.BASE_URL}/?preview&theme=cue#typography/default` })
await ready(view, '[data-slot="heading"]')
await view.evaluate("document.fonts.ready")

const typography = await view.evaluate<{ heading: string[]; bodyLineHeight: string; overflow: boolean }>(`(() => ({
  heading: [...document.querySelectorAll('[data-slot="heading"]')].map((node) => node.tagName),
  bodyLineHeight: getComputedStyle(document.querySelector('[data-slot="body"]')).lineHeight,
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
}))()`)
assert.deepEqual(typography.heading, ["H1", "H2", "H3", "H4"])
assert.notEqual(typography.bodyLineHeight, "normal")
assert.equal(typography.overflow, false)

await Bun.write(path.join(output, "typography-mobile.png"), await view.screenshot())

await view.cdp("Page.navigate", { url: `${AppConfig.BASE_URL}/?preview&theme=cue#page/default` })
await ready(view, '[data-slot="page-title"]')
const page = await view.evaluate<{ headingLevel: string | null; tagName: string; overflow: boolean }>(`(() => {
  const title = document.querySelector('[data-slot="page-title"]')
  return {
    headingLevel: title?.getAttribute("data-heading-level") ?? null,
    tagName: title?.tagName ?? "",
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
  }
})()`)
assert.equal(page.headingLevel, "h1")
assert.equal(page.tagName, "H1")
assert.equal(page.overflow, false)

await Bun.write(path.join(output, "page-header-mobile.png"), await view.screenshot())
await Bun.write(path.join(output, "report.json"), JSON.stringify({ typography, page }, null, 2))

async function ready(view: Bun.WebView, selector: string): Promise<void> {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await view.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await Bun.sleep(25)
  }
  throw new Error(`Timed out waiting for ${selector}`)
}
