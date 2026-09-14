import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const base = process.env.CATALOG_URL ?? "http://127.0.0.1:6018"
const output = path.resolve(".eval/0914-catalog-ci-stability")
const report = []
await mkdir(output, { recursive: true })
try {
  await using view = new Bun.WebView({ backend: { type: "chrome", url: false }, width: 1280, height: 720 })
  await view.navigate(base)
  for (const theme of ["light", "dark"]) {
    for (const name of [
      "checkbox",
      "switch",
      "radio-group",
      "toggle",
      "slider",
      "progress",
      "native-select",
      "popover"
    ]) {
      const slot = name === "popover" ? "popover-trigger" : name
      await view.cdp("Page.navigate", { url: `${base}/style-x?preview&theme=${theme}#${name}/default` })
      await view.evaluate(
        `new Promise((resolve,reject)=>{const end=Date.now()+5000;function check(){if(location.pathname==='/style-x'&&location.hash==='#${name}/default'&&document.querySelector('[data-pilot-theme="${theme}"] [data-slot="${slot}"]')&&!document.body.textContent.includes('Loading preview...'))resolve(true);else if(Date.now()>end)reject(new Error('Readiness ${name}/${theme}'));else requestAnimationFrame(check)}check()})`
      )
      assert.equal(await view.evaluate("document.querySelector('[role=alert]')?.textContent ?? null"), null)
      report.push({ name, theme })
    }
  }
  await view.cdp("Page.navigate", { url: `${base}/?preview&theme=light#ts-chart/18-cumulative-histogram` })
  await view.evaluate(
    `new Promise((resolve,reject)=>{const end=Date.now()+5000;function check(){if(document.querySelector('svg.ts-chart [data-ts-key=marks] > g'))resolve(true);else if(Date.now()>end)reject(new Error('Histogram readiness'));else requestAnimationFrame(check)}check()})`
  )
  report.push({ name: "18-cumulative-histogram", theme: "light" })
  const capture = await view.cdp<{ data: string }>("Page.captureScreenshot", { format: "png" })
  await Bun.write(path.join(output, "histogram.png"), Buffer.from(capture.data, "base64"))
  await Bun.write(path.join(output, "webview.json"), JSON.stringify(report, null, 2))
} finally {
  Bun.WebView.closeAll()
}
