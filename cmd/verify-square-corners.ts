import assert from "node:assert/strict"
import { mkdir, readdir } from "node:fs/promises"
import path from "node:path"

const base = process.env.CATALOG_URL ?? "http://localhost:6018"
const output = path.resolve(".eval/0914-square-corners")
const name = (await readdir("internal/catalog/example")).sort()
const noSlot = new Set(["direction", "ts-chart"])
const report = []
try {
  await mkdir(output, { recursive: true })
  await using view = new Bun.WebView({
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
    width: 390,
    height: 900
  })
  await view.navigate(base)
  for (const theme of ["light", "dark"])
    for (const family of name) {
      await view.cdp("Page.navigate", { url: `${base}/?preview&theme=${theme}#${family}/default` })
      await view.evaluate(
        `new Promise((resolve,reject)=>{const end=Date.now()+15000;function check(){if(location.hash==='#${family}/default'&&!document.body.textContent.includes('This example could not render')&&document.querySelector('${noSlot.has(family) ? "[data-pilot-theme]" : "[data-pilot-theme] [data-slot]"}'))requestAnimationFrame(()=>requestAnimationFrame(resolve));else if(Date.now()>end)reject(new Error('Readiness ${family}'));else requestAnimationFrame(check)}check()})`
      )
      const failure = await view.evaluate<{ slot?: string; radius: string; before: string; after: string }[]>(
        `Array.from(document.querySelectorAll('[data-pilot-theme] [data-slot], [data-pilot-theme] [data-slot] *')).flatMap(node=>{const radius=getComputedStyle(node).borderRadius;const before=getComputedStyle(node,'::before').borderRadius;const after=getComputedStyle(node,'::after').borderRadius;return radius==='0px'&&before==='0px'&&after==='0px'?[]:[{slot:node.dataset.slot,radius,before,after}]})`
      )
      assert.deepEqual(failure, [], `${family}/${theme}`)
      report.push({
        family,
        theme,
        slotCount: await view.evaluate(
          "document.querySelectorAll('[data-pilot-theme] [data-slot], [data-pilot-theme] [data-slot] *').length"
        )
      })
    }
  await view.cdp("Page.navigate", { url: `${base}/?preview&theme=light#dialog/default` })
  await view.evaluate(
    `new Promise((resolve,reject)=>{const end=Date.now()+15000;function check(){if(document.querySelector('[data-pilot-theme] [data-slot]'))resolve(true);else if(Date.now()>end)reject(new Error('Screenshot readiness'));else requestAnimationFrame(check)}check()})`
  )
  await view.evaluate(
    `Array.from(document.querySelectorAll('button')).find(button=>button.textContent?.trim()==='Open dialog')?.click()`
  )
  await view.evaluate(
    `new Promise((resolve,reject)=>{const end=Date.now()+15000;function check(){if(document.querySelector('[data-pilot-theme] [role="dialog"]'))resolve(true);else if(Date.now()>end)reject(new Error('Dialog readiness'));else requestAnimationFrame(check)}check()})`
  )
  const capture = await view.cdp<{ data: string }>("Page.captureScreenshot", { format: "png" })
  await Bun.write(path.join(output, "dialog.png"), Buffer.from(capture.data, "base64"))
  await Bun.write(path.join(output, "report.json"), JSON.stringify({ caseCount: report.length, report }, null, 2))
  await Bun.write(
    path.join(output, "reproduce.md"),
    "1. Run `bun catalog:build`.\n2. Run `bunx vite preview --config vite.config.ts --port 6018 --strictPort --host 127.0.0.1`.\n3. Run `CATALOG_URL=http://127.0.0.1:6018 bun cmd/verify-square-corners.ts`.\n"
  )
} finally {
  Bun.WebView.closeAll()
}
