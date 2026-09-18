import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const base = process.env.CATALOG_URL ?? "http://127.0.0.1:6018"
const output = path.resolve(".eval/0914-tabs-capsule")

await mkdir(output, { recursive: true })
try {
  await using view = new Bun.WebView({
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
    width: 1280,
    height: 720
  })
  await view.navigate(`${base}/?preview&theme=dark#tabs/capsule`)
  await view.evaluate(
    `new Promise((resolve,reject)=>{const end=Date.now()+5000;function check(){if(document.querySelector('[data-variant="capsule"] [data-active]'))resolve(true);else if(Date.now()>end)reject(new Error('Tabs capsule readiness'));else requestAnimationFrame(check)}check()})`
  )
  const result = await view.evaluate<{
    activeBackground: string
    activeRadius: string
    inactiveBackground: string
    inactiveBorderWidth: string
    paddingBlock: string
    paddingInline: string
  }>(
    `(()=>{const list=document.querySelector('[data-variant="capsule"]');const active=getComputedStyle(list.querySelector('[data-active]'));const inactive=getComputedStyle([...list.querySelectorAll('[role="tab"]')].find(tab=>!tab.hasAttribute('data-active')));return {activeBackground:active.backgroundColor,activeRadius:active.borderRadius,inactiveBackground:inactive.backgroundColor,inactiveBorderWidth:inactive.borderWidth,paddingBlock:active.paddingBlock,paddingInline:active.paddingInline}})()`
  )
  assert.notEqual(result.activeBackground, "rgba(0, 0, 0, 0)")
  assert.equal(result.activeRadius, "999px")
  assert.equal(result.inactiveBackground, "rgba(0, 0, 0, 0)")
  assert.equal(result.inactiveBorderWidth, "0px")
  assert.equal(result.paddingBlock, "4px")
  assert.equal(result.paddingInline, "10px")
  await Bun.write(path.join(output, "result.json"), JSON.stringify(result, null, 2))
  const capture = await view.cdp<{ data: string }>("Page.captureScreenshot", { format: "png" })
  await Bun.write(path.join(output, "tabs-capsule.png"), Buffer.from(capture.data, "base64"))
} finally {
  Bun.WebView.closeAll()
}
