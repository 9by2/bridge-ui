import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import path from "node:path"

import { createElement } from "react"
import { renderToString } from "react-dom/server"

import { createPackageStylexPlugin } from "../internal/package-stylex"

const output = path.resolve(".eval/0908-stylex-foundation")
const temporary = await mkdtemp(path.resolve(".stylex-contract-"))
const errors: string[] = []
const axe = await Bun.file(new URL(import.meta.resolve("axe-core/axe.min.js"))).text()
try {
  const result = await Bun.build({
    entrypoints: ["internal/pilot/fixture.tsx", "internal/pilot/client.tsx", "internal/pilot/token.stylex.ts"],
    outdir: temporary,
    target: "browser",
    format: "esm",
    jsx: { development: false },
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
    plugins: [
      createPackageStylexPlugin({
        dev: false,
        runtimeInjection: false,
        useCSSLayers: true,
        bunDevCssOutput: path.join(temporary, "style.css")
      })
    ]
  })
  assert(result.success, String(result.logs))
  const serverBuild = await Bun.build({
    entrypoints: ["internal/pilot/fixture.tsx", "internal/pilot/token.stylex.ts"],
    outdir: path.join(temporary, "server"),
    target: "bun",
    format: "esm",
    jsx: { development: false },
    external: ["react", "react/jsx-runtime", "react-dom", "@base-ui/react", "@stylexjs/stylex"],
    plugins: [
      createPackageStylexPlugin({
        dev: false,
        runtimeInjection: false,
        useCSSLayers: true,
        bunDevCssOutput: path.join(temporary, "server.css")
      })
    ]
  })
  assert(serverBuild.success, String(serverBuild.logs))
  const { Fixture } = await import(path.join(temporary, "server/fixture.js"))
  const css =
    (await Bun.file(path.join(temporary, "style.css")).text()) + (await Bun.file("internal/pilot/adapter.css").text())
  const reports = []
  const client = (await Bun.file(path.join(temporary, "client.js")).text()).replaceAll("</script", "<\\/script")
  for (const width of [390, 1280])
    for (const mode of ["light", "dark"]) {
      await using view = new Bun.WebView({
        width,
        height: 700,
        backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
        console(type, ...args) {
          if (type === "error") errors.push(args.map(String).join(" "))
        }
      })
      const html = `<!doctype html><html lang="en" data-theme="${mode}"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Private pilot</title><style>${css}</style><body><div id="root">${renderToString(createElement(Fixture, { mode }))}</div><script type="module">${client}</script></body></html>`
      await view.navigate(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
      await view.cdp("Emulation.setDeviceMetricsOverride", { width, height: 700, deviceScaleFactor: 1, mobile: false })
      assert.equal(await view.evaluate("document.documentElement.dataset.hydrated"), "true")
      await view.click("#name")
      await view.type("Pilot")
      await view.click("button[type=submit]")
      assert.equal(await view.evaluate("document.querySelector('[role=alert]').textContent"), "Saved locally")
      await view.evaluate(`(() => { ${axe}; return true })()`)
      const closedAudit = await view.evaluate<{ violations: unknown[] }>(
        "axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })"
      )
      assert.deepEqual(closedAudit.violations, [])
      await view.click("[data-slot=dialog-trigger]")
      assert.equal(
        await view.evaluate("getComputedStyle(document.querySelector('[role=dialog]')).animationDuration"),
        "0.1s"
      )
      await view.evaluate("Promise.allSettled(document.getAnimations().map(animation => animation.finished))")
      await view.press("Tab")
      assert.equal(
        await view.evaluate("document.querySelector('[role=dialog]').contains(document.activeElement)"),
        true
      )
      assert.equal(
        await view.evaluate("document.querySelector('[role=dialog]').closest('[data-pilot-theme]').dataset.pilotTheme"),
        mode
      )
      assert.equal(
        await view.evaluate("getComputedStyle(document.querySelector('[role=dialog]')).fontFamily"),
        await view.evaluate("getComputedStyle(document.querySelector('[data-slot=dialog-trigger]')).fontFamily")
      )
      assert.equal(
        await view.evaluate(
          "getComputedStyle(document.body).overflow === 'hidden' || getComputedStyle(document.documentElement).overflow === 'hidden'"
        ),
        true
      )
      await Bun.write(path.join(output, `pilot-${width}-${mode}.png`), await view.screenshot())
      const openAudit = await view.evaluate<{ violations: unknown[] }>(
        "axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } })"
      )
      assert.deepEqual(openAudit.violations, [])
      await view.press("Escape")
      await view.evaluate("Promise.allSettled(document.getAnimations().map(animation => animation.finished))")
      await view.evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
      assert.equal(await view.evaluate("document.querySelector('[role=dialog]') === null"), true)
      assert.equal(await view.evaluate("document.activeElement.dataset.slot"), "dialog-trigger")
      await view.cdp("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] })
      await view.click("[data-slot=dialog-trigger]")
      assert.equal(
        await view.evaluate("getComputedStyle(document.querySelector('[role=dialog]')).animationDuration"),
        "0s"
      )
      await view.press("Escape")
      await view.evaluate("new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))")
      assert.equal(
        await view.evaluate(
          "getComputedStyle(document.body).overflow === 'hidden' || getComputedStyle(document.documentElement).overflow === 'hidden'"
        ),
        false
      )
      reports.push({
        width,
        mode,
        form: true,
        portal: true,
        escape: true,
        scrollCleanup: true,
        closedViolation: closedAudit.violations,
        openViolation: openAudit.violations
      })
    }
  assert.deepEqual(errors, [])
  await Bun.write(path.join(output, "pilot.json"), JSON.stringify({ bun: Bun.version, reports, errors }, null, 2))
} finally {
  Bun.WebView.closeAll()
  await rm(temporary, { recursive: true, force: true })
}
