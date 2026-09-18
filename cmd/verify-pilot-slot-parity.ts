import assert from "node:assert/strict"
import { readdir } from "node:fs/promises"
import path from "node:path"

type Slot = { slot: string; index: number; tag: string; value: Record<string, string | number> }

const base = process.env.CATALOG_URL ?? "http://localhost:6018"
const output = path.resolve(".eval/0909-stylex-slot-parity")
const names = (await readdir("internal/catalog/example")).sort()
const properties = [
  "display",
  "position",
  "boxSizing",
  "width",
  "height",
  "minWidth",
  "minHeight",
  "maxWidth",
  "maxHeight",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "gap",
  "rowGap",
  "columnGap",
  "flexDirection",
  "alignItems",
  "justifyContent",
  "flexGrow",
  "flexShrink",
  "flexBasis",
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
  "backgroundColor",
  "color",
  "fontSize",
  "lineHeight",
  "fontWeight",
  "whiteSpace",
  "overflow",
  "overflowX",
  "overflowY",
  "opacity",
  "visibility",
  "pointerEvents",
  "cursor",
  "textAlign",
  "transform",
  "translate",
  "rotate",
  "animationDuration",
  "animationIterationCount",
  "transitionDuration"
]

function normalize(slot: Slot) {
  const value = { ...slot.value }
  for (const key of ["width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight"])
    if (typeof value[key] === "string" && value[key].endsWith("px"))
      value[key] = Math.round(Number.parseFloat(value[key]) * 100) / 100
  return { ...slot, value }
}

const differences = []
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
      for (const name of names) {
        const pair: Slot[][] = []
        for (const route of ["/", "/style-x"]) {
          await view.cdp("Page.navigate", { url: `${base}${route}?preview&theme=${theme}#${name}/default` })
          await view.evaluate(
            `new Promise((resolve,reject)=>{const end=Date.now()+15000;function check(){if(location.pathname==='${route}'&&location.hash==='#${name}/default'&&!document.body.textContent.includes('This example could not render')&&document.querySelector('main')?.textContent.includes('${name === "direction" ? "واجهة مشتركة" : "example"}'))resolve(true);else if(Date.now()>end)reject(new Error('Readiness ${name}'));else requestAnimationFrame(check)}check()})`
          )
          pair.push(
            await view.evaluate<Slot[]>(
              `(()=>{const keys=${JSON.stringify(properties)};const counts={};return Array.from(document.querySelectorAll('[data-slot]')).map(node=>{const slot=node.dataset.slot;const index=counts[slot]??0;counts[slot]=index+1;const s=getComputedStyle(node);const rect=node.getBoundingClientRect();return {slot,index,tag:node.tagName.toLowerCase(),value:Object.fromEntries(keys.map(key=>[key,s[key]]).concat([['rectWidth',Math.round(rect.width*100)/100],['rectHeight',Math.round(rect.height*100)/100]]))}})})()`
            )
          )
        }
        const baseline = pair[0]!.map(normalize)
        const candidate = pair[1]!.map(normalize)
        const baselineKeys = baseline.map((item) => `${item.slot}:${item.index}:${item.tag}`)
        const candidateKeys = candidate.map((item) => `${item.slot}:${item.index}:${item.tag}`)
        if (JSON.stringify(baselineKeys) !== JSON.stringify(candidateKeys))
          differences.push({ name, theme, width, type: "structure", baseline: baselineKeys, candidate: candidateKeys })
        for (const expected of baseline) {
          const actual = candidate.find(
            (item) => item.slot === expected.slot && item.index === expected.index && item.tag === expected.tag
          )
          if (!actual) continue
          const mismatch = Object.fromEntries(
            Object.keys(expected.value)
              .filter((key) => actual.value[key] !== expected.value[key])
              .map((key) => [key, { baseline: expected.value[key], candidate: actual.value[key] }])
          )
          if (Object.keys(mismatch).length)
            differences.push({
              name,
              theme,
              width,
              type: "style",
              slot: expected.slot,
              index: expected.index,
              mismatch
            })
        }
      }
    }
  await Bun.write(path.join(output, "report.json"), JSON.stringify({ familyCount: names.length, differences }, null, 2))
  assert.equal(
    differences.length,
    0,
    `${differences.length} slot parity difference; inspect ${path.join(output, "report.json")}`
  )
} finally {
  Bun.WebView.closeAll()
}
