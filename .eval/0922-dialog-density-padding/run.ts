import assert from "node:assert/strict"
import path from "node:path"

const root = path.resolve(import.meta.dir, "../..")
const catalog = path.join(root, "catalog-dist")
const output = import.meta.dir
const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 6110,
  async fetch(request) {
    const url = new URL(request.url)
    const file = Bun.file(path.join(catalog, url.pathname === "/" ? "index.html" : url.pathname))
    if (await file.exists()) return new Response(file)
    return new Response(Bun.file(path.join(catalog, "index.html")))
  }
})

const report: Array<{ density: string; padding: string; footerPadding: string; footerMarginLeft: string }> = []
try {
  await using view = new Bun.WebView({
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
    width: 390,
    height: 720
  })
  await view.navigate("http://127.0.0.1:6110/?preview#dialog/density")
  await view.evaluate(
    `new Promise((resolve, reject) => { const end = Date.now() + 5000; const check = () => document.querySelectorAll('button').length === 3 ? resolve(true) : Date.now() > end ? reject(new Error('Dialog density example did not load')) : requestAnimationFrame(check); check() })`
  )
  for (const density of ["compact", "default", "comfortable"]) {
    await view.evaluate(`document.querySelectorAll('button').forEach(button => { if (button.textContent === '${density}') button.click() })`)
    const values = await view.evaluate<{ padding: string; footerPadding: string; footerMarginLeft: string }>(
      `new Promise((resolve, reject) => { const end = Date.now() + 5000; const check = () => { const dialog = document.querySelector('[role=dialog]'); const footer = document.querySelector('[data-slot=dialog-footer]'); if (dialog && footer) { const content = getComputedStyle(dialog); const footerStyle = getComputedStyle(footer); resolve({ padding: content.padding, footerPadding: footerStyle.padding, footerMarginLeft: footerStyle.marginLeft }); } else if (Date.now() > end) reject(new Error('Dialog did not open')); else requestAnimationFrame(check); }; check(); })`
    )
    assert.equal(values.padding, values.footerPadding, `${density} padding`)
    assert.equal(values.footerMarginLeft, `-${values.padding}`, `${density} footer margin`)
    report.push({ density, ...values })
    await Bun.write(path.join(output, `${density}.png`), await view.screenshot())
    await view.press("Escape")
    await view.evaluate(`new Promise(resolve => { const check = () => document.querySelector('[role=dialog]') ? requestAnimationFrame(check) : resolve(true); check() })`)
  }
  await Bun.write(path.join(output, "report.json"), JSON.stringify(report, null, 2))
} finally {
  server.stop(true)
  Bun.WebView.closeAll()
}
