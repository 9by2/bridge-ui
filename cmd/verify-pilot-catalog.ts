import assert from "node:assert/strict"
import path from "node:path"
import { pathToFileURL } from "node:url"

const output = path.resolve(".eval/0908-stylex-foundation")
const axe = await Bun.file(new URL(import.meta.resolve("axe-core/axe.min.js"))).text()
try {
  await using view = new Bun.WebView({
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
    width: 900,
    height: 1000
  })
  await view.navigate(pathToFileURL(path.join(output, "catalog/index.html")).href)
  await view.cdp("Emulation.setDeviceMetricsOverride", {
    width: 900,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  })
  const frames = await view.cdp<{ frameTree: { childFrames?: Array<{ frame: { id: string } }> } }>("Page.getFrameTree")
  assert.equal(frames.frameTree.childFrames?.length, 2)
  await Promise.all(
    (frames.frameTree.childFrames ?? []).map(async (frame) => {
      const { executionContextId } = await view.cdp<{ executionContextId: number }>("Page.createIsolatedWorld", {
        frameId: frame.frame.id,
        worldName: "pilot-check"
      })
      const result = await view.cdp<{ result: { value: boolean } }>("Runtime.evaluate", {
        contextId: executionContextId,
        expression: "document.querySelector('h1')?.textContent === 'Pilot comparison'",
        returnByValue: true
      })
      assert.equal(result.result.value, true)
    })
  )
  await Bun.write(path.join(output, "catalog-ab.png"), await view.screenshot())
  const reports = []
  for (const mode of ["light", "dark"])
    for (const width of [390, 1280]) {
      await view.navigate(`${pathToFileURL(path.join(output, "catalog/frame.html")).href}?candidate=true&theme=${mode}`)
      await view.cdp("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: false })
      await view.evaluate(`(() => { ${axe}; return true })()`)
      const audit = await view.evaluate<{ violations: unknown[] }>(
        "axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } })"
      )
      assert.deepEqual(audit.violations, [])
      await view.click("[data-slot=dialog-trigger]")
      const openAudit = await view.evaluate<{ violations: unknown[] }>(
        "axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } })"
      )
      assert.deepEqual(openAudit.violations, [])
      reports.push({ mode, width, violations: audit.violations, openViolations: openAudit.violations })
      await Bun.write(path.join(output, `catalog-${mode}-${width}.png`), await view.screenshot())
    }
  await Bun.write(path.join(output, "catalog-audit.json"), JSON.stringify(reports, null, 2))
} finally {
  Bun.WebView.closeAll()
}
