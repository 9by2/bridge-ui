import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const root = path.resolve(import.meta.dir, "..")
const output = path.join(root, ".eval/0917-dev-596")
await mkdir(output, { recursive: true })

const port = 6019
const baseUrl = `http://127.0.0.1:${port}/`
const preview = Bun.spawn(
  [
    "bunx",
    "vite",
    "preview",
    "--config",
    "vite.config.ts",
    "--port",
    String(port),
    "--strictPort",
    "--host",
    "127.0.0.1"
  ],
  { cwd: root, stdout: "ignore", stderr: "inherit" }
)
await waitForServer(baseUrl)

const report = []

try {
  for (const theme of ["light", "dark"]) {
    await using view = new Bun.WebView({ width: 390, height: 900, backend: { type: "chrome", url: false } })
    await view.navigate("about:blank")
    await view.cdp("Page.navigate", { url: `${baseUrl}?preview&theme=${theme}&motion=reduced#data-state/default` })
    await ready(view, '[data-slot="data-state"]')
    await view.evaluate("document.fonts.ready")
    const dataState = await view.evaluate<{ count: number; alert: boolean; overflow: boolean }>(`(() => ({
      count: document.querySelectorAll('[data-slot="data-state"]').length,
      alert: Boolean(document.querySelector('[data-slot="data-state"][role="alert"]')),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }))()`)
    assert.equal(dataState.count, 2)
    assert.equal(dataState.alert, true)
    assert.equal(dataState.overflow, false)
    await Bun.write(path.join(output, `data-state-${theme}-390.png`), await view.screenshot())

    await view.cdp("Page.navigate", { url: `${baseUrl}?preview&theme=${theme}&motion=reduced#timeline-step/default` })
    await ready(view, '[data-slot="timeline-step"]')
    const timeline = await view.evaluate<{ count: number; overflow: boolean; horizontalOverflow: boolean }>(`(() => {
      const horizontal = document.querySelector('[data-slot="timeline-step"][data-orientation="horizontal"]')
      return {
        count: document.querySelectorAll('[data-slot="timeline-step"]').length,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        horizontalOverflow: horizontal.scrollWidth >= horizontal.clientWidth
      }
    })()`)
    assert.equal(timeline.count, 2)
    assert.equal(timeline.overflow, false)
    assert.equal(timeline.horizontalOverflow, true)
    await Bun.write(path.join(output, `timeline-step-${theme}-390.png`), await view.screenshot())

    await view.cdp("Page.navigate", { url: `${baseUrl}?preview&theme=${theme}&motion=reduced#table-frame/default` })
    await ready(view, '[data-slot="table-frame"]')
    const table = await view.evaluate<{ hint: string; overflow: boolean; viewportOverflow: boolean }>(`(() => {
      const hint = document.querySelector('[data-slot="table-frame-hint"]')
      const viewport = document.querySelector('[data-slot="table-frame-viewport"]')
      return {
        hint: getComputedStyle(hint).display,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        viewportOverflow: viewport.scrollWidth > viewport.clientWidth
      }
    })()`)
    assert.equal(table.hint, "block")
    assert.equal(table.overflow, false)
    assert.equal(table.viewportOverflow, true)
    await Bun.write(path.join(output, `table-frame-${theme}-390.png`), await view.screenshot())

    report.push({ theme, dataState, timeline, table })
  }

  await using page = new Bun.WebView({ width: 390, height: 700, backend: { type: "chrome", url: false } })
  await page.navigate("about:blank")
  await page.cdp("Page.navigate", { url: `${baseUrl}?preview&theme=light#page/default` })
  await ready(page, '[data-slot="page-toolbar"]')
  const toolbar = await page.evaluate<{ display: string; overflow: boolean }>(`(() => {
    const node = document.querySelector('[data-slot="page-toolbar"]')
    return {
      display: getComputedStyle(node).display,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    }
  })()`)
  assert.equal(toolbar.display, "flex")
  assert.equal(toolbar.overflow, false)
  await Bun.write(path.join(output, "page-toolbar-light-390.png"), await page.screenshot())

  await Bun.write(path.join(output, "report.json"), JSON.stringify({ bun: Bun.version, report, toolbar }, null, 2))
  await Bun.write(
    path.join(output, "README.md"),
    "# DEV-596 reusable presentation evidence\n\nRun `bun catalog:build && bun cmd/verify-reusable-presentation.ts`. Evidence covers 390px light/dark DataState, TimelineStep and TableFrame, Thai/long copy, error semantics, reduced motion, contained horizontal overflow, and PageToolbar wrapping.\n"
  )
  console.log(`Verified ${report.length} theme case and page toolbar with Bun.WebView`)
} finally {
  preview.kill()
  Bun.WebView.closeAll()
}

async function ready(view: Bun.WebView, selector: string): Promise<void> {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await view.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await Bun.sleep(25)
  }
  throw new Error(`Timed out waiting for ${selector}`)
}

async function waitForServer(url: string): Promise<void> {
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {}
    await Bun.sleep(50)
  }
  throw new Error(`Timed out waiting for ${url}`)
}
