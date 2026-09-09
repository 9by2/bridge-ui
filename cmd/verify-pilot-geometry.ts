import assert from "node:assert/strict"
import path from "node:path"

const base = process.env.CATALOG_URL ?? "http://localhost:6018"
const output = path.resolve(".eval/0909-stylex-geometry")
const reports = []
try {
  await using view = new Bun.WebView({ backend: { type: "chrome", url: false }, width: 1280, height: 900 })
  await view.navigate(base)
  for (const theme of ["light", "dark"])
    for (const width of [390, 1280]) {
      await view.cdp("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false })
      for (const name of ["button-group", "avatar", "card", "calendar", "sidebar", "carousel", "input-group", "tabs"]) {
        const values = []
        for (const route of ["/", "/style-x"]) {
          await view.cdp("Page.navigate", { url: `${base}${route}?preview&theme=${theme}#${name}/default` })
          await view.evaluate(
            `new Promise((resolve,reject)=>{const end=Date.now()+15000;function check(){if(location.pathname==='${route}' && location.hash==='#${name}/default' && document.querySelector('[data-slot="${name}"]'))resolve(true);else if(Date.now()>end)reject(new Error('Readiness: ${name}'));else requestAnimationFrame(check)}check()})`
          )
          values.push(
            await view.evaluate(
              `(()=>{const node=document.querySelector('[data-slot="${name}"]');const s=getComputedStyle(node);const r=node.getBoundingClientRect();return {width:Math.round(r.width),height:Math.round(r.height),padding:s.padding,gap:s.gap==='normal'?'0px':s.gap,fontSize:s.fontSize,borderRadius:Math.min(parseFloat(s.borderRadius),Math.min(r.width,r.height)/2)}})()`
            )
          )
        }
        assert.deepEqual(values[1], values[0], `${name}/${theme}/${width}`)
        reports.push({ name, theme, width, baseline: values[0], candidate: values[1] })
        await Bun.write(path.join(output, `${name}-${theme}-${width}.png`), await view.screenshot())
      }
    }
  await Bun.write(path.join(output, "report.json"), JSON.stringify(reports, null, 2))
} finally {
  Bun.WebView.closeAll()
}
