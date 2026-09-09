import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import path from "node:path"

import { createElement } from "react"
import { renderToString } from "react-dom/server"

import { createPackageStylexPlugin } from "../internal/package-stylex"

const temporary = await mkdtemp(path.resolve(".stylex-contract-"))
const reports = []
try {
  const result = await Bun.build({
    entrypoints: [
      "internal/pilot/skeleton.tsx",
      "internal/pilot/spinner.tsx",
      "internal/pilot/kbd.tsx",
      "internal/pilot/card.tsx",
      "internal/pilot/badge.tsx",
      "internal/pilot/checkbox.tsx",
      "internal/pilot/switch.tsx",
      "internal/pilot/toggle.tsx",
      "internal/pilot/theme.tsx",
      "internal/pilot/token.stylex.ts"
    ],
    outdir: temporary,
    naming: "[name].[ext]",
    target: "bun",
    format: "esm",
    jsx: { development: false },
    external: ["react", "react-dom", "react/jsx-runtime", "@stylexjs/stylex", "lucide-react", "@base-ui/react"],
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
  const { Theme } = await import(path.join(temporary, "theme.js"))
  for (const name of ["skeleton", "spinner", "kbd", "card", "badge", "checkbox", "switch", "toggle"])
    for (const mode of ["light", "dark"]) {
      const values = []
      for (const candidate of [false, true]) {
        const module = await import(
          candidate ? path.join(temporary, `${name}.js`) : path.resolve(`dist/component/shadcn/${name}.js`)
        )
        const Component = module[name[0]!.toUpperCase() + name.slice(1)]
        const content = createElement(
          Component,
          { id: "probe", ...(name === "skeleton" ? { style: { width: 80, height: 20 } } : {}) },
          ["spinner", "skeleton", "checkbox", "switch"].includes(name)
            ? undefined
            : process.env.PILOT_ICON === "true"
              ? createElement(
                  "svg",
                  { width: 24, height: 24, "aria-hidden": true },
                  createElement("path", { d: "M0 0h24v24H0z" })
                )
              : "Compare"
        )
        const css =
          (await Bun.file(candidate ? path.join(temporary, "style.css") : "dist/style.css").text()) +
          (candidate ? await Bun.file("internal/pilot/adapter.css").text() : "")
        await using view = new Bun.WebView({ backend: { type: "chrome", url: false }, width: 390, height: 200 })
        await view.navigate(
          `data:text/html;charset=utf-8,${encodeURIComponent(`<!doctype html><html class="${mode === "dark" ? "dark" : ""}"><meta charset="utf-8"><style>${css}</style><body>${renderToString(candidate ? createElement(Theme, { mode }, content) : content)}</body></html>`)}`
        )
        const value = await view.evaluate<Record<string, string>>(
          `(() => { const node = document.querySelector('[data-slot="${name}"]'); const s = getComputedStyle(node); const rect = node.getBoundingClientRect(); return Object.fromEntries(['height','fontSize','lineHeight','borderRadius','animationDuration','animationTimingFunction','animationIterationCount'].map(key => [key,key === 'borderRadius' ? String(Math.min(parseFloat(s[key]), Math.min(rect.width, rect.height) / 2)) : s[key]])); })()`
        )
        values.push(value)
        if (process.env.PILOT_ICON === "true" && name === "badge") {
          value.iconWidth = await view.evaluate(
            'getComputedStyle(document.querySelector("[data-slot=badge] svg")).width'
          )
          value.iconHeight = await view.evaluate(
            'getComputedStyle(document.querySelector("[data-slot=badge] svg")).height'
          )
        }
        if (candidate) {
          await view.cdp("Emulation.setEmulatedMedia", {
            features: [{ name: "prefers-reduced-motion", value: "reduce" }]
          })
          if (name === "spinner" || name === "skeleton")
            assert.equal(
              await view.evaluate("getComputedStyle(document.getElementById('probe')).animationPlayState"),
              "paused"
            )
          await Bun.write(`.eval/0908-stylex-surface/${name}-${mode}.png`, await view.screenshot())
        }
      }
      assert.deepEqual(values[1], values[0], `${name}/${mode}`)
      reports.push({ name, mode, baseline: values[0], candidate: values[1] })
    }
  await Bun.write(".eval/0908-stylex-surface/report.json", JSON.stringify(reports, null, 2))
} finally {
  Bun.WebView.closeAll()
  await rm(temporary, { recursive: true, force: true })
}
