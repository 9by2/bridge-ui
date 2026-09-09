import assert from "node:assert/strict"
import { readdir } from "node:fs/promises"
import path from "node:path"

const output = path.resolve(".eval/0908-stylex-route")
const base = process.env.CATALOG_URL ?? "http://127.0.0.1:6008"
const families = (await readdir("internal/catalog/example")).sort()
let caseCount = 0
try {
  await using view = new Bun.WebView({ backend: { type: "chrome", url: false }, width: 1280, height: 900 })
  const wait = async (expression: string) => {
    await view.evaluate(
      `new Promise((resolve, reject) => { const end = Date.now() + 15000; function check() { if (${expression}) resolve(true); else if (Date.now() > end) reject(new Error('Preview readiness timeout')); else requestAnimationFrame(check); } check(); })`
    )
  }
  await view.navigate(`${base}/#button/default`)
  console.log("Regular route loaded")
  await wait("document.querySelector('nav[aria-label=Component]')")
  const baseline = await view.evaluate(
    "Array.from(document.querySelectorAll('nav[aria-label=Component] a'), node => node.textContent)"
  )
  await view.navigate(`${base}/style-x#button/default`)
  console.log("StyleX route loaded")
  await wait("document.querySelector('[role=status]')")
  await wait("document.querySelector('iframe')")
  assert.deepEqual(
    await view.evaluate(
      "Array.from(document.querySelectorAll('nav[aria-label=Component] a'), node => node.textContent)"
    ),
    baseline
  )
  assert.equal(
    await view.evaluate("document.querySelector('iframe').getAttribute('src').startsWith('/style-x?preview')"),
    true
  )
  await Bun.write(path.join(output, "desktop.png"), await view.screenshot())
  for (const mode of ["light", "dark"])
    for (const width of [390, 1280]) {
      await view.cdp("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false })
      for (const name of [
        "button",
        "input",
        "field",
        "dialog",
        "skeleton",
        "spinner",
        "aspect-ratio",
        "separator",
        "textarea",
        "checkbox",
        "switch",
        "radio-group",
        "toggle",
        "slider",
        "progress",
        "native-select",
        "popover",
        "table",
        "accordion",
        "tabs",
        "collapsible",
        "tooltip",
        "hover-card",
        "scroll-area",
        "resizable",
        "label",
        "toggle-group",
        "input-group",
        "item",
        "select",
        "sheet",
        "alert-dialog"
      ]) {
        console.log(`${name}/${mode}/${width}`)
        await view.cdp("Page.navigate", { url: `${base}/style-x?preview&theme=${mode}#${name}/default` })
        await wait(
          `location.hash === '#${name}/default' && document.querySelector('[data-pilot-theme] [data-slot="${["dialog", "popover", "tooltip", "hover-card", "select", "sheet", "alert-dialog"].includes(name) ? `${name}-trigger` : name === "resizable" ? "resizable-panel-group" : name}"]')`
        )
        assert.equal(await view.evaluate("document.querySelector('[data-pilot-theme]').dataset.pilotTheme"), mode)
        if (name === "button") assert.equal(await view.evaluate("!!document.querySelector('.pilot-button')"), true)
        if (name === "dialog") {
          await view.click("[data-slot=dialog-trigger]")
          await wait("document.querySelector('[role=dialog]')")
          assert.equal(
            await view.evaluate(
              "document.querySelector('[role=dialog]').closest('[data-pilot-theme]').dataset.pilotTheme"
            ),
            mode
          )
          await view.press("Escape")
          await wait("!document.querySelector('[role=dialog]')")
        }
        await Bun.write(path.join(output, `${name}-${mode}-${width}.png`), await view.screenshot())
      }
    }
  await view.navigate(`${base}/style-x#badge/default`)
  await wait("document.querySelector('[role=status]')?.textContent.includes('Parity review remains open')")
  for (const name of families) {
    await view.cdp("Page.navigate", { url: `${base}/style-x?preview#${name}/default` })
    await wait(
      `location.hash === '#${name}/default' && document.querySelector('main') && !document.body.textContent.includes('This example could not render') && document.querySelector('[data-pilot-theme] :is([data-slot], svg, button, input, section, [dir])')`
    )
    await Bun.write(path.join(output, `inventory-${name}.png`), await view.screenshot())
    caseCount++
  }
  await view.navigate(`${base}/?preview#button/default`)
  await wait("document.querySelector('[data-slot=button]')")
  assert.equal(await view.evaluate("!!document.querySelector('.pilot-button')"), false)
  await Bun.write(
    path.join(output, "report.json"),
    JSON.stringify(
      {
        inventory: true,
        candidate: true,
        portal: true,
        baselineUnchanged: true,
        caseCount: 128,
        inventoryCaseCount: caseCount
      },
      null,
      2
    )
  )
} finally {
  Bun.WebView.closeAll()
}
