import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const root = path.resolve(import.meta.dir, "..")
const output = path.join(root, ".eval/0922-kanban-dropzone")
const port = 6022
const baseUrl = `http://127.0.0.1:${port}/`
await mkdir(output, { recursive: true })

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

try {
  await waitForServer(baseUrl)
  await using view = new Bun.WebView({
    width: 1280,
    height: 720,
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
  })
  await view.navigate("about:blank")
  await view.cdp("Page.navigate", { url: `${baseUrl}?preview&theme=light#kanban/default` })
  await ready(view, '[data-slot="kanban"]')

  const state = await view.evaluate<{
    dragging: boolean
    dropZoneCount: number
    targetCount: number
    targetBorderStyle: string
    targetHeight: number
    userSelect: string
  }>(`(async () => {
    const handle = document.querySelector('[data-slot="kanban-item-handle"]')
    const zones = [...document.querySelectorAll('[data-slot="kanban-column-content"]')]
    const target = zones.at(-1)
    const sourceBox = handle.getBoundingClientRect()
    const targetBox = target.getBoundingClientRect()
    const pointer = { bubbles: true, isPrimary: true, pointerId: 1, pointerType: 'mouse' }
    handle.dispatchEvent(new PointerEvent('pointerdown', { ...pointer, buttons: 1, clientX: sourceBox.left + 12, clientY: sourceBox.top + 12 }))
    document.dispatchEvent(new PointerEvent('pointermove', { ...pointer, buttons: 1, clientX: sourceBox.left + 28, clientY: sourceBox.top + 12 }))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    for (let attempt = 0; attempt < 6; attempt++) {
      document.dispatchEvent(new PointerEvent('pointermove', { ...pointer, buttons: 1, clientX: targetBox.left + targetBox.width / 2, clientY: targetBox.top + targetBox.height / 2 }))
      await new Promise((resolve) => setTimeout(resolve, 50))
      if (target.getAttribute('data-drop-target') === 'true') break
    }
    const active = document.querySelector('[data-slot="kanban-item"][data-dragging="true"]')
    const dropZones = zones.filter((zone) => zone.getAttribute('data-drop-zone') === 'true')
    const targets = zones.filter((zone) => zone.getAttribute('data-drop-target') === 'true')
    const targetStyle = getComputedStyle(targets[0] ?? target)
    return {
      dragging: Boolean(active),
      dropZoneCount: dropZones.length,
      targetCount: targets.length,
      targetBorderStyle: targetStyle.borderStyle,
      targetHeight: target.getBoundingClientRect().height,
      userSelect: getComputedStyle(handle).userSelect
    }
  })()`)

  assert.equal(state.dragging, true)
  assert.equal(state.dropZoneCount, 3)
  assert.equal(state.targetCount, 1)
  assert.equal(state.targetBorderStyle, "solid")
  assert.ok(state.targetHeight >= 96)
  assert.equal(state.userSelect, "none")

  await Bun.write(path.join(output, "kanban-drag-dropzone-light.png"), await view.screenshot())
  await Bun.write(path.join(output, "report.json"), JSON.stringify(state, null, 2))
  await Bun.write(
    path.join(output, "README.md"),
    "# Kanban drop-zone evidence\n\nRun `bun catalog:build && bun cmd/verify-kanban-dropzone.ts`. The script opens `kanban/default`, starts dragging the first card, moves it over the Done column, and verifies all valid zones are visible while only the hovered destination has the strong target treatment.\n"
  )
} finally {
  preview.kill()
  Bun.WebView.closeAll()
}

async function ready(view: Bun.WebView, selector: string) {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await view.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await Bun.sleep(25)
  }
  throw new Error(`Timed out waiting for ${selector}`)
}

async function waitForServer(url: string) {
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      if ((await fetch(url)).ok) return
    } catch {}
    await Bun.sleep(50)
  }
  throw new Error(`Timed out waiting for ${url}`)
}
