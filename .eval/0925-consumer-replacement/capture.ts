import assert from "node:assert/strict"
import path from "node:path"

const AppConfig = {
  BASE_URL: process.env.CATALOG_URL ?? "http://127.0.0.1:6033",
  OUTPUT: ".eval/0925-consumer-replacement"
} as const

// Reproduce: `bun catalog:build && bunx vite preview --outDir catalog-dist --port 6033`
// (or any static server on catalog-dist), then `bun .eval/0925-consumer-replacement/capture.ts`.
await using view = new Bun.WebView({
  width: 900,
  height: 720,
  backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
})
const until = async (script: string) => {
  for (let attempt = 0; attempt < 200; attempt++) {
    if (await view.evaluate<boolean>(script)) return
    await Bun.sleep(50)
  }
  throw new Error(`timeout: ${script}`)
}
// Hash-only changes never fire `load`, so Bun.WebView.navigate would hang; force a full load per route.
const open = (route: string) => view.navigate(`${AppConfig.BASE_URL}/?preview&route=${route}#${route}`)
const click = (label: string) =>
  view.evaluate(`(() => {
    const target = [...document.querySelectorAll("button")].find((node) => node.textContent.trim() === ${JSON.stringify(label)})
    target.click()
    return true
  })()`)
const shot = async (name: string) => {
  await Bun.sleep(300)
  await Bun.write(path.join(AppConfig.OUTPUT, `${name}.png`), await view.screenshot())
}

// G1 viewer: loading, error, ready.
await open("upload-viewer/status")
for (const status of ["loading", "error", "ready"]) {
  await until(`[...document.querySelectorAll("button")].some((node) => node.textContent.trim() === "Preview ${status}")`)
  await click(`Preview ${status}`)
  await until(`Boolean(document.querySelector('[role="dialog"]'))`)
  const state = await view.evaluate<{ link: number; action: number; alert: string; status: string }>(`(() => ({
    link: document.querySelectorAll('[role="dialog"] a').length,
    action: [...document.querySelectorAll('[role="dialog"] button')].filter((node) => node.textContent === "Open in new tab").length,
    alert: document.querySelector('[role="dialog"] [role="alert"]')?.textContent ?? "",
    status: document.querySelector('[role="dialog"] [role="status"]')?.textContent ?? ""
  }))()`)
  console.log(status, state)
  if (status === "loading") assert.deepEqual([state.link, state.action, state.status], [0, 0, "Loading contract…"])
  if (status === "error") assert.deepEqual([state.link, state.action, state.alert], [0, 0, "This file could not be displayed."])
  if (status === "ready") {
    assert.deepEqual([state.link, state.action, state.status], [1, 1, ""])
    await until(`document.querySelector('[role="dialog"] img')?.complete === true`)
  }
  await shot(`viewer-${status}`)
  await click("Close preview")
  await until(`!document.querySelector('[role="dialog"]')`)
}

// G5 chips, G4 full width, G2 preview and raw surface.
const ready: Record<string, string> = {
  "combobox/chip": `Boolean(document.querySelector('[aria-label="Remove Jazz"]'))`,
  "multi-select/full-width": `document.querySelectorAll('[role="combobox"]').length === 2`,
  "upload-list/preview": `Boolean(document.querySelector('[data-slot="upload-list"]'))`,
  "drop-area/surface": `Boolean(document.querySelector('[data-slot="drop-area"]'))`
}
for (const [route, script] of Object.entries(ready)) {
  await open(route)
  await until(script)
  await shot(route.replace("/", "-"))
}
await open("upload-list/preview")
await until(`[...document.querySelectorAll("button")].some((node) => node.textContent.trim() === "thumbnail")`)
await click("thumbnail")
await shot("upload-list-thumbnail")
await click("none")
await shot("upload-list-none")

// Mobile: full-width trigger and chip row do not overflow.
await view.resize(390, 800)
for (const route of ["multi-select/full-width", "combobox/chip", "upload-list/preview"]) {
  await open(route)
  await until(ready[route]!)
  assert.equal(await view.evaluate<boolean>(`document.documentElement.scrollWidth <= innerWidth`), true, route)
  await shot(`mobile-${route.replace("/", "-")}`)
}
console.log("ok")
