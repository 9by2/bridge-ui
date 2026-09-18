import assert from "node:assert/strict"
import path from "node:path"

import { createElement } from "react"
import { renderToString } from "react-dom/server"

const output = path.resolve(".eval/0908-secondary-contrast")
const { Button } = await import(path.resolve("dist/component/shadcn/button.js"))
const css = await Bun.file("dist/style.css").text()
const axe = await Bun.file(new URL(import.meta.resolve("axe-core/axe.min.js"))).text()
const reports = []
try {
  for (const mode of ["light", "dark"]) {
    await using view = new Bun.WebView({
      backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
      width: 390,
      height: 200
    })
    const html = `<!doctype html><html lang="en" class="${mode === "dark" ? "dark" : ""}"><meta charset="utf-8"><title>Secondary contrast</title><style>${css}</style><body><main style="padding:24px">${renderToString(createElement(Button, { variant: "secondary" }, "Secondary action"))}</main></body></html>`
    await view.navigate(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
    await view.evaluate(`(() => { ${axe}; return true })()`)
    for (const state of ["rest", "hover", "focus-visible"]) {
      const document = await view.cdp<{ root: { nodeId: number } }>("DOM.getDocument")
      const { nodeId } = await view.cdp<{ nodeId: number }>("DOM.querySelector", {
        nodeId: document.root.nodeId,
        selector: "button"
      })
      await view.cdp("CSS.enable")
      await view.cdp("CSS.forcePseudoState", { nodeId, forcedPseudoClasses: state === "rest" ? [] : [state] })
      await view.evaluate("Promise.allSettled(document.getAnimations().map(animation => animation.finished))")
      const audit = await view.evaluate<{ violations: unknown[] }>("axe.run(document, { runOnly: ['color-contrast'] })")
      reports.push({ mode, state, violations: audit.violations })
      await Bun.write(path.join(output, "report.json"), JSON.stringify(reports, null, 2))
      await Bun.write(path.join(output, `${mode}-${state}.png`), await view.screenshot())
      assert.deepEqual(audit.violations, [], `${mode}/${state} secondary contrast`)
    }
  }
} finally {
  Bun.WebView.closeAll()
}
