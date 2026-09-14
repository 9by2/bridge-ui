import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const base = process.env.CATALOG_URL ?? "http://127.0.0.1:6018"
const output = path.resolve(".eval/0914-tabs-line")

await mkdir(output, { recursive: true })
try {
  await using view = new Bun.WebView({ backend: { type: "chrome", url: false }, width: 1280, height: 720 })
  await view.navigate(`${base}/?preview&theme=dark#tabs/line`)
  await view.evaluate(
    `new Promise((resolve,reject)=>{const end=Date.now()+5000;function check(){if(document.querySelector('[data-variant="line"] [data-active]'))resolve(true);else if(Date.now()>end)reject(new Error('Tabs line readiness'));else requestAnimationFrame(check)}check()})`
  )
  const result = await view.evaluate<{
    activeBackground: string
    activeBottomBorder: string
    activeColor: string
    activeSideBorderWidth: string
    activeTopBorderWidth: string
    defaultBorderWidth: string
    iconHeight: string
    iconWidth: string
  }>(
    `(()=>{const line=document.querySelector('[data-variant="line"]');const active=line.querySelector('[data-active]');const fallback=[...document.querySelectorAll('[data-variant="default"] [role="tab"]')][0];const icon=[...document.querySelectorAll('[data-variant="line"] [role="tab"]')].find(tab=>tab.textContent.includes('Todo'))?.querySelector('svg');const activeStyle=getComputedStyle(active);const iconStyle=getComputedStyle(icon);return {activeBackground:activeStyle.backgroundColor,activeBottomBorder:activeStyle.borderBottomColor,activeColor:activeStyle.color,activeSideBorderWidth:activeStyle.borderInlineStartWidth,activeTopBorderWidth:activeStyle.borderTopWidth,defaultBorderWidth:getComputedStyle(fallback).borderWidth,iconHeight:iconStyle.height,iconWidth:iconStyle.width}})()`
  )
  assert.equal(result.activeBackground, "rgba(0, 0, 0, 0)")
  assert.equal(result.activeColor, result.activeBottomBorder)
  assert.equal(result.activeSideBorderWidth, "0px")
  assert.equal(result.activeTopBorderWidth, "0px")
  assert.equal(result.defaultBorderWidth, "0px")
  assert.equal(result.iconHeight, "16px")
  assert.equal(result.iconWidth, "16px")
  await Bun.write(path.join(output, "result.json"), JSON.stringify(result, null, 2))
  const capture = await view.cdp<{ data: string }>("Page.captureScreenshot", { format: "png" })
  await Bun.write(path.join(output, "tabs-line.png"), Buffer.from(capture.data, "base64"))
} finally {
  Bun.WebView.closeAll()
}
