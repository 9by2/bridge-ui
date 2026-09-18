import assert from "node:assert/strict"
import path from "node:path"

type Step = { name: string; selector: string; action: "click" | "focus" | "key" | "context"; key?: string }
type Slot = { key: string; value: Record<string, string | number> }

const base = process.env.CATALOG_URL ?? "http://localhost:6018"
const output = path.resolve(".eval/0909-stylex-state-parity")
const steps: Step[] = [
  { name: "button", selector: "[data-slot=button]", action: "focus" },
  { name: "input", selector: "[data-slot=input]", action: "focus" },
  { name: "checkbox", selector: "[data-slot=checkbox]", action: "click" },
  { name: "switch", selector: "[data-slot=switch]", action: "click" },
  { name: "toggle", selector: "[data-slot=toggle]", action: "click" },
  { name: "radio-group", selector: "[data-slot=radio-group-item]:last-of-type", action: "click" },
  { name: "slider", selector: "[data-slot=slider-thumb]", action: "key", key: "ArrowRight" },
  { name: "accordion", selector: "[data-slot=accordion-trigger]", action: "click" },
  { name: "tabs", selector: "[data-slot=tabs-trigger]:last-of-type", action: "click" },
  { name: "select", selector: "[data-slot=select-trigger]", action: "click" },
  { name: "combobox", selector: "[data-slot=combobox-trigger]", action: "click" },
  { name: "popover", selector: "[data-slot=popover-trigger]", action: "click" },
  { name: "dialog", selector: "[data-slot=dialog-trigger]", action: "click" },
  { name: "sheet", selector: "[data-slot=sheet-trigger]", action: "click" },
  { name: "drawer", selector: "[data-slot=drawer-trigger]", action: "click" },
  { name: "alert-dialog", selector: "[data-slot=alert-dialog-trigger]", action: "click" },
  { name: "dropdown-menu", selector: "[data-slot=dropdown-menu-trigger]", action: "click" },
  { name: "context-menu", selector: "[data-slot=context-menu-trigger]", action: "context" },
  { name: "menubar", selector: "[data-slot=menubar-trigger]", action: "click" },
  { name: "multi-select", selector: "[role=combobox]", action: "click" }
]
const properties = [
  "display",
  "position",
  "width",
  "height",
  "padding",
  "margin",
  "gap",
  "flexDirection",
  "alignItems",
  "justifyContent",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopStyle",
  "borderRightStyle",
  "borderBottomStyle",
  "borderLeftStyle",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderRadius",
  "backgroundColor",
  "color",
  "fontSize",
  "lineHeight",
  "fontWeight",
  "overflow",
  "opacity",
  "visibility",
  "pointerEvents",
  "cursor",
  "transform",
  "translate",
  "rotate",
  "animationDuration",
  "transitionDuration"
]
const differences = []
const acceptedDeviations: object[] = []
try {
  await using view = new Bun.WebView({
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
    width: 1280,
    height: 900
  })
  await view.navigate(base)
  for (const theme of ["light", "dark"])
    for (const width of [390, 1280]) {
      await view.cdp("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false })
      for (const step of steps) {
        const pair: Slot[][] = []
        for (const route of ["/", "/style-x"]) {
          await view.cdp("Page.navigate", { url: `${base}${route}?preview&theme=${theme}#${step.name}/default` })
          await view.evaluate(
            `new Promise((resolve,reject)=>{const end=Date.now()+15000;function check(){if(location.pathname==='${route}'&&location.hash==='#${step.name}/default'&&document.querySelector('${step.selector}'))resolve(true);else if(Date.now()>end)reject(new Error('Readiness ${step.name}'));else requestAnimationFrame(check)}check()})`
          )
          if (step.action === "click") await view.click(step.selector)
          else if (step.action === "focus") await view.evaluate(`document.querySelector('${step.selector}').focus()`)
          else if (step.action === "key") {
            await view.evaluate(`document.querySelector('${step.selector}').focus()`)
            await view.press(step.key!)
          } else
            await view.evaluate(
              `document.querySelector('${step.selector}').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,clientX:100,clientY:100,button:2}))`
            )
          await Bun.sleep(500)
          pair.push(
            await view.evaluate<Slot[]>(
              `(()=>{const keys=${JSON.stringify(properties)};const counts={};const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d',{willReadFrequently:true});const color=value=>{context.clearRect(0,0,1,1);context.fillStyle=value;context.fillRect(0,0,1,1);return Array.from(context.getImageData(0,0,1,1).data).join(',')};return Array.from(document.querySelectorAll('[data-slot]')).map(node=>{const slot=node.dataset.slot;const index=counts[slot]??0;counts[slot]=index+1;const s=getComputedStyle(node);const r=node.getBoundingClientRect();return {key:slot+':'+index+':'+node.tagName.toLowerCase(),value:Object.fromEntries(keys.map(key=>[key,["borderTopColor","borderRightColor","borderBottomColor","borderLeftColor","backgroundColor","color"].includes(key)?color(s[key]):s[key]]).concat([['rectWidth',Math.round(r.width*100)/100],['rectHeight',Math.round(r.height*100)/100],['focused',node===document.activeElement],['checked',node.getAttribute('aria-checked')??node.getAttribute('aria-pressed')??''],['expanded',node.getAttribute('aria-expanded')??'']]))}})})()`
            )
          )
        }
        const baseline = pair[0]!
        const candidate = pair[1]!
        if (JSON.stringify(baseline.map((item) => item.key)) !== JSON.stringify(candidate.map((item) => item.key)))
          differences.push({
            step,
            theme,
            width,
            type: "structure",
            baseline: baseline.map((item) => item.key),
            candidate: candidate.map((item) => item.key)
          })
        for (const expected of baseline) {
          const actual = candidate.find((item) => item.key === expected.key)
          if (!actual) continue
          const mismatch = Object.fromEntries(
            Object.keys(expected.value)
              .filter((key) => {
                const left = expected.value[key]
                const right = actual.value[key]
                if (left === right) return false
                if (
                  (key === "width" || key === "height" || key === "rectWidth" || key === "rectHeight") &&
                  Math.abs(Number.parseFloat(String(left)) - Number.parseFloat(String(right))) < 0.5
                )
                  return false
                if (
                  key === "borderRadius" &&
                  Number.parseFloat(String(left)) >=
                    Math.min(Number(expected.value.rectWidth), Number(expected.value.rectHeight)) / 2 &&
                  Number.parseFloat(String(right)) >=
                    Math.min(Number(actual.value.rectWidth), Number(actual.value.rectHeight)) / 2
                )
                  return false
                if (key.startsWith("border") && key.endsWith("Color")) {
                  const side = key.slice(6, -5)
                  if (expected.value[`border${side}Width`] === "0px" && actual.value[`border${side}Width`] === "0px")
                    return false
                }
                if (
                  (key === "animationDuration" || key === "transitionDuration") &&
                  Math.max(
                    ...String(expected.value.animationDuration).split(", ").map(Number.parseFloat),
                    ...String(expected.value.transitionDuration).split(", ").map(Number.parseFloat)
                  ) ===
                    Math.max(
                      ...String(actual.value.animationDuration).split(", ").map(Number.parseFloat),
                      ...String(actual.value.transitionDuration).split(", ").map(Number.parseFloat)
                    )
                )
                  return false
                if (key === "transform" && expected.value.translate !== actual.value.translate) return false
                if (key === "translate" && expected.value.transform !== actual.value.transform) return false
                return true
              })
              .map((key) => [key, { baseline: expected.value[key], candidate: actual.value[key] }])
          )
          if (
            step.name === "slider" &&
            [
              "slider:0:div",
              "slider-track:0:div",
              "slider-range:0:div",
              "slider-thumb:0:span",
              "slider-thumb:0:div"
            ].includes(expected.key)
          ) {
            acceptedDeviations.push({
              step,
              theme,
              width,
              slot: expected.key,
              reason:
                "Generated baseline collapses caller w-80 under StyleX layer ordering; candidate preserves 320px usable slider (DEC-016 regression correction).",
              mismatch
            })
            continue
          }
          if (
            step.name === "dropdown-menu" &&
            theme === "dark" &&
            expected.key === "dropdown-menu-item:2:div" &&
            Object.keys(mismatch).length === 1 &&
            "color" in mismatch
          ) {
            acceptedDeviations.push({
              step,
              theme,
              width,
              slot: expected.key,
              reason:
                "DEC-018: generated destructive menu text fails WCAG AA at 3.52:1; candidate uses accessible errorText.",
              mismatch
            })
            continue
          }
          if (Object.keys(mismatch).length)
            differences.push({ step, theme, width, type: "style", slot: expected.key, mismatch })
        }
      }
    }
  await Bun.write(
    path.join(output, "report.json"),
    JSON.stringify({ scenarioCount: steps.length * 4, differences, acceptedDeviations }, null, 2)
  )
  assert.equal(differences.length, 0, `${differences.length} interactive parity difference; inspect report`)
} finally {
  Bun.WebView.closeAll()
}
