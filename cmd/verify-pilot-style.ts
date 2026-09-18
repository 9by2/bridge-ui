import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import path from "node:path"

import { createElement } from "react"
import { renderToString } from "react-dom/server"

import { createPackageStylexPlugin } from "../internal/package-stylex"

const output = path.resolve(".eval/0908-stylex-foundation")
const temporary = await mkdtemp(path.resolve(".stylex-contract-"))
const state = process.env.PILOT_STATE ?? "rest"
const input = process.env.PILOT_COMPONENT === "input"
const field = process.env.PILOT_COMPONENT === "field"
const dialog = process.env.PILOT_COMPONENT === "dialog"
const component = input ? "input" : field ? "field" : dialog ? "dialog" : "button"
const pseudo = process.env.PILOT_PSEUDO ?? ""
const icon = process.env.PILOT_ICON === "true"
try {
  const build = await Bun.build({
    entrypoints: [`internal/pilot/${component}.tsx`, "internal/pilot/theme.tsx", "internal/pilot/token.stylex.ts"],
    outdir: temporary,
    format: "esm",
    target: "bun",
    jsx: { development: false },
    external: ["react", "react/jsx-runtime", "react-dom", "@base-ui/react", "@stylexjs/stylex"],
    plugins: [
      createPackageStylexPlugin({
        dev: false,
        runtimeInjection: false,
        useCSSLayers: true,
        bunDevCssOutput: path.join(temporary, "style.css")
      })
    ]
  })
  if (!build.success) throw new Error(String(build.logs))
  const candidateModule = await import(path.join(temporary, `${component}.js`))
  const Candidate = input ? candidateModule.Input : candidateModule.Button
  const { Theme } = await import(path.join(temporary, "theme.js"))
  const baselineModule = await import(path.resolve(`dist/component/shadcn/${component}.js`))
  const Baseline = input ? baselineModule.Input : baselineModule.Button
  const reports = []
  for (const mode of ["light", "dark"])
    for (const variant of dialog
      ? ["DialogHeader", "DialogFooter", "DialogTitle", "DialogDescription"]
      : field
        ? [
            "Field",
            "FieldLabel",
            "FieldDescription",
            "FieldTitle",
            "FieldLegend",
            "FieldError",
            "FieldContent",
            "FieldSet",
            "FieldGroup"
          ]
        : input
          ? ["default", "disabled", "invalid", "file"]
          : ["default", "outline", "secondary", "ghost", "destructive", "link"])
      for (const size of field || input || dialog
        ? ["390", "1280"]
        : state === "rest"
          ? ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"]
          : ["default"]) {
        const values = []
        for (const candidate of [false, true]) {
          const css =
            (await Bun.file(candidate ? path.join(temporary, "style.css") : "dist/style.css").text()) +
            (candidate ? await Bun.file("internal/pilot/adapter.css").text() : "")
          const module = candidate ? candidateModule : baselineModule
          const button = dialog
            ? createElement(module.Dialog, {}, createElement(module[variant], { id: "probe" }, "Compare"))
            : field
              ? createElement(module[variant], { id: "probe" }, "Compare")
              : input
                ? createElement(candidate ? Candidate : Baseline, {
                    disabled: variant === "disabled",
                    "aria-invalid": variant === "invalid",
                    type: variant === "file" ? "file" : "text",
                    placeholder: "Compare"
                  })
                : createElement(
                    candidate ? Candidate : Baseline,
                    {
                      variant,
                      size,
                      "aria-expanded": state === "expanded" ? true : undefined,
                      "aria-invalid": state === "invalid" ? true : undefined,
                      "aria-haspopup": state === "popup-active" ? "dialog" : undefined
                    },
                    icon
                      ? createElement(
                          "svg",
                          { "data-icon": "inline-start", viewBox: "0 0 24 24" },
                          createElement("path", { d: "M2 12h20" })
                        )
                      : "Compare"
                  )
          const body = renderToString(candidate ? createElement(Theme, { mode }, button) : button)
          if (process.env.PILOT_DEBUG && candidate) {
            await Bun.write(path.join(output, "debug.html"), `<style>${css}</style>${body}`)
          }
          await using view = new Bun.WebView({
            backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
            width: 800,
            height: 200
          })
          await view.navigate(
            `data:text/html;charset=utf-8,${encodeURIComponent(`<!doctype html><html class="${mode === "dark" ? "dark" : ""}"><meta charset="utf-8"><style>${css}</style><body>${body}</body></html>`)}`
          )
          if (input || field || dialog)
            await view.cdp("Emulation.setDeviceMetricsOverride", {
              width: Number(size),
              height: 200,
              deviceScaleFactor: 1,
              mobile: false
            })
          if (state !== "rest" && state !== "expanded" && state !== "invalid") {
            const document = await view.cdp<{ root: { nodeId: number } }>("DOM.getDocument")
            const { nodeId } = await view.cdp<{ nodeId: number }>("DOM.querySelector", {
              nodeId: document.root.nodeId,
              selector: component
            })
            await view.cdp("CSS.enable")
            await view.cdp("CSS.forcePseudoState", {
              nodeId,
              forcedPseudoClasses: [state === "popup-active" ? "active" : state]
            })
            await view.evaluate("Promise.all(document.getAnimations().map(animation => animation.finished))")
          }
          values.push(
            await view.evaluate<Record<string, string | number[]>>(`(() => {
        const s = getComputedStyle(document.querySelector('${field || dialog ? "#probe" : component}'), ${JSON.stringify(pseudo || null)});
        const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
        const context = canvas.getContext('2d');
        return Object.fromEntries(['height','paddingLeft','paddingRight','borderRadius','fontSize','lineHeight','fontWeight','color','backgroundColor','borderColor','translate','transform','opacity','pointerEvents','boxShadow'].map(key => {
          if (key === 'boxShadow') {
            let depth = 0, start = 0; const parts = [];
            for (let i = 0; i < s.boxShadow.length; i++) {
              if (s.boxShadow[i] === '(') depth++;
              if (s.boxShadow[i] === ')') depth--;
              if (s.boxShadow[i] === ',' && depth === 0) { parts.push(s.boxShadow.slice(start, i)); start = i + 1; }
            }
            parts.push(s.boxShadow.slice(start));
            return [key, parts.map(part => {
              const color = part.match(/(?:rgba?|oklch|oklab|lab|color)\\([^)]*\\)/)?.[0];
              if (!color) return null;
              context.clearRect(0,0,1,1); context.fillStyle = color; context.fillRect(0,0,1,1);
              const rgba = [...context.getImageData(0,0,1,1).data];
              const geometry = part.replace(color,'').trim();
              if (rgba[3] === 0 || geometry === '0px 0px 0px 0px') return null;
              return geometry + ':' + rgba.join(',');
            }).filter(Boolean).join('|')];
          }
          if (!key.toLowerCase().includes('color')) return [key, s[key]];
          context.clearRect(0,0,1,1); context.fillStyle = key === 'borderColor' ? (s.borderTopWidth === '0px' ? 'transparent' : s.borderTopColor) : s[key]; context.fillRect(0,0,1,1);
          return [key, [...context.getImageData(0,0,1,1).data]];
        }).concat(${icon} ? [['iconWidth', getComputedStyle(document.querySelector('svg')).width], ['iconHeight',getComputedStyle(document.querySelector('svg')).height]] : []));
      })()`)
          )
        }
        const [baseline, candidate] = values
        assert(baseline && candidate)
        for (const key of Object.keys(baseline)) {
          const left: string | number[] | undefined = baseline[key]
          const right: string | number[] | undefined = candidate[key]
          if (!input && !field && !dialog && mode === "dark" && variant === "destructive" && key === "color") {
            assert.deepEqual(right, [240, 87, 81, 255], "DEC-012 accessible destructive copy")
            continue
          }
          if (!input && !field && !dialog && mode === "light" && variant === "secondary" && key === "color") {
            assert.deepEqual(right, [250, 250, 250, 255], "DEC-011 accessible secondary foreground")
            continue
          }
          if (field && mode === "dark" && variant === "FieldError" && key === "color") {
            assert.deepEqual(right, [240, 87, 81, 255], "DEC-010 accessible dark error text")
            continue
          }
          if (Array.isArray(left) && Array.isArray(right))
            left.forEach((channel, index) =>
              assert(Math.abs(channel - (right[index] ?? 0)) <= 1, `${mode}/${variant}/${key}: ${left} vs ${right}`)
            )
          else assert.equal(left, right, `${mode}/${variant}/${key}`)
        }
        reports.push({ mode, variant, size, baseline: values[0], candidate: values[1] })
      }
  await Bun.write(
    path.join(output, `${component}-comparison-${state}${icon ? "-icon" : ""}${pseudo.replaceAll(":", "")}.json`),
    JSON.stringify(reports, null, 2)
  )
} finally {
  Bun.WebView.closeAll()
  await rm(temporary, { recursive: true, force: true })
}
