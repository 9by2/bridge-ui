import assert from "node:assert/strict"
import path from "node:path"

const base = process.env.CATALOG_URL ?? "http://localhost:6018"
const output = path.resolve(".eval/0909-stylex-axe")
const axe = await Bun.file(new URL(import.meta.resolve("axe-core/axe.min.js"))).text()
const entries = [
  ["dialog", "[data-slot=dialog-trigger]"],
  ["alert-dialog", "[data-slot=alert-dialog-trigger]"],
  ["sheet", "[data-slot=sheet-trigger]"],
  ["drawer", "[data-slot=drawer-trigger]"],
  ["popover", "[data-slot=popover-trigger]"],
  ["select", "[data-slot=select-trigger]"],
  ["combobox", "[data-slot=combobox-trigger]"],
  ["dropdown-menu", "[data-slot=dropdown-menu-trigger]"],
  ["context-menu", "[data-slot=context-menu-trigger]"],
  ["menubar", "[data-slot=menubar-trigger]"],
  ["multi-select", "[role=combobox]"]
] as const
const reports = []
try {
  await using view = new Bun.WebView({ backend: { type: "chrome", url: false }, width: 390, height: 900 })
  await view.navigate(base)
  for (const theme of ["light", "dark"])
    for (const [name, selector] of entries) {
      await view.cdp("Page.navigate", { url: `${base}/style-x?preview&theme=${theme}#${name}/default` })
      await view.evaluate(
        `new Promise((resolve,reject)=>{const end=Date.now()+15000;function check(){if(document.querySelector('${selector}'))resolve(true);else if(Date.now()>end)reject(new Error('Readiness ${name}'));else requestAnimationFrame(check)}check()})`
      )
      await view.evaluate(`(()=>{${axe};return true})()`)
      if (name === "context-menu")
        await view.evaluate(
          `document.querySelector('${selector}').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,clientX:100,clientY:100,button:2}))`
        )
      else await view.click(selector)
      await Bun.sleep(300)
      const audit = await view.evaluate<{ violations: unknown[] }>(
        "axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } })"
      )
      assert.deepEqual(audit.violations, [], `${name}/${theme}`)
      reports.push({ name, theme, violations: audit.violations })
      await view.press("Escape")
    }
  await Bun.write(path.join(output, "report.json"), JSON.stringify(reports, null, 2))
} finally {
  Bun.WebView.closeAll()
}
