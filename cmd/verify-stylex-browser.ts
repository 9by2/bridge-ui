import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import path from "node:path"

import stylex from "@stylexjs/unplugin"
import { createElement } from "react"
import { renderToString } from "react-dom/server"
import { build } from "vite"

import { createPackageStylexPlugin } from "../internal/package-stylex"

const output = path.resolve(".eval/0908-stylex-foundation")
const temporary = await mkdtemp(path.resolve(".stylex-contract-"))
const reports = []
try {
  const result = await Bun.build({
    entrypoints: ["test/fixture/stylex-contract/entry.tsx", "test/fixture/stylex-contract/token.stylex.ts"],
    outdir: temporary,
    target: "browser",
    format: "esm",
    jsx: { development: false },
    external: ["react", "react/jsx-runtime", "@stylexjs/stylex"],
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
  await build({
    configFile: false,
    plugins: [stylex.vite({ dev: false, runtimeInjection: false, useCSSLayers: true })],
    build: {
      outDir: path.join(temporary, "vite"),
      lib: { entry: path.resolve("test/fixture/stylex-contract/entry.tsx"), formats: ["es"], fileName: "entry" },
      rollupOptions: { external: ["react", "react/jsx-runtime", "@stylexjs/stylex"] }
    }
  })
  const { Contract } = await import(path.join(temporary, "entry.js"))
  for (const compiler of ["bun", "vite"]) {
    const css =
      compiler === "bun"
        ? await Bun.file(path.join(temporary, "style.css")).text()
        : (
            await Promise.all(
              [...new Bun.Glob("**/*.css").scanSync({ cwd: path.join(temporary, "vite") })].map((file) =>
                Bun.file(path.join(temporary, "vite", file)).text()
              )
            )
          ).join("\n")
    for (const width of [390, 1280]) {
      for (const isDark of [false, true]) {
        await using view = new Bun.WebView({
          width,
          height: 300,
          backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
        })
        const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>StyleX contract</title><style>${css}</style><body>${renderToString(createElement(Contract, { isDark, width: 137 }))}</body></html>`
        await view.navigate(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
        await view.cdp("Emulation.setDeviceMetricsOverride", {
          width,
          height: 300,
          deviceScaleFactor: 1,
          mobile: false
        })
        await view.evaluate("Promise.all(document.getAnimations().map(animation => animation.finished))")
        const actual = await view.evaluate(
          `(() => { const s = getComputedStyle(document.querySelector('button')); return { background: s.backgroundColor, color: s.color, width: s.width, padding: s.paddingTop } })()`
        )
        assert.deepEqual(actual, {
          background: isDark ? "rgb(20, 20, 20)" : "rgb(255, 255, 255)",
          color: isDark ? "rgb(255, 255, 255)" : "rgb(20, 20, 20)",
          width: "137px",
          padding: width === 390 ? "8px" : "12px"
        })
        await view.press("Tab")
        assert.equal(await view.evaluate("getComputedStyle(document.querySelector('button')).outlineWidth"), "3px")
        await Bun.write(
          path.join(output, `${compiler}-${width}-${isDark ? "dark" : "light"}.png`),
          await view.screenshot()
        )
        await view.evaluate("document.querySelector('button').disabled = true")
        assert.equal(await view.evaluate("getComputedStyle(document.querySelector('button')).opacity"), "0.5")
        await view.cdp("Emulation.setEmulatedMedia", {
          features: [{ name: "prefers-reduced-motion", value: "reduce" }]
        })
        assert.equal(await view.evaluate("getComputedStyle(document.querySelector('button')).animationDuration"), "0s")
        reports.push({ compiler, width, isDark, actual, focus: true, disabled: true, reducedMotion: true })
      }
    }
  }
  await Bun.write(
    path.join(output, "webview.json"),
    JSON.stringify({ bun: Bun.version, backend: "chrome", reports }, null, 2)
  )
  console.log(`Verified ${reports.length} Bun.WebView render cases`)
} finally {
  Bun.WebView.closeAll()
  await rm(temporary, { recursive: true, force: true })
}
