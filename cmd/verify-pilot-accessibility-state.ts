import assert from "node:assert/strict"
import path from "node:path"

const base = process.env.CATALOG_URL ?? "http://localhost:6018"
const output = path.resolve(".eval/0909-stylex-accessibility-state")
const report = []
try {
  await using view = new Bun.WebView({
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
    width: 390,
    height: 900
  })
  await view.navigate(base)
  for (const theme of ["light", "dark"]) {
    for (const name of ["dialog", "sheet", "drawer", "select", "popover", "dropdown-menu"]) {
      await view.cdp("Page.navigate", {
        url: `${base}/style-x?preview&theme=${theme}&motion=reduced&lang=th#${name}/default`
      })
      const selector = `[data-slot=${name}-trigger]`
      await view.evaluate(
        `new Promise((resolve,reject)=>{const end=Date.now()+15000;function check(){if(document.querySelector('${selector}'))resolve(true);else if(Date.now()>end)reject(new Error('Readiness ${name}'));else requestAnimationFrame(check)}check()})`
      )
      await view.click(selector)
      await Bun.sleep(100)
      const popup = `[data-slot=${name === "dialog" ? "dialog-content" : name === "dropdown-menu" ? "dropdown-menu-content" : `${name}-content`}]`
      const duration = await view.evaluate<string>(
        `(()=>{const s=getComputedStyle(document.querySelector('${popup}'));return [s.animationDuration,s.transitionDuration].join('|')})()`
      )
      assert.equal(
        Math.max(
          ...duration
            .split(/[|, ]+/)
            .filter(Boolean)
            .map((value) => Number.parseFloat(value))
        ),
        0.00001
      )
      assert.equal(await view.evaluate(`document.documentElement.lang`), "th")
      report.push({ theme, name, duration })
      await view.press("Escape")
    }
    for (const name of ["native-select", "slider", "tabs", "radio-group", "toggle-group", "breadcrumb", "pagination"]) {
      await view.cdp("Page.navigate", { url: `${base}/style-x?preview&theme=${theme}#${name}/default` })
      await view.evaluate(
        `new Promise((resolve,reject)=>{const end=Date.now()+15000;function check(){if(document.querySelector('[data-pilot-theme]'))resolve(true);else if(Date.now()>end)reject(new Error('Readiness ${name}'));else requestAnimationFrame(check)}check()})`
      )
      await view.evaluate(`document.querySelector('[data-pilot-theme]').setAttribute('dir','rtl')`)
      assert.equal(
        await view.evaluate(`getComputedStyle(document.querySelector('[data-pilot-theme]')).direction`),
        "rtl"
      )
      report.push({ theme, name, rtl: true })
    }
  }
  await Bun.write(path.join(output, "report.json"), JSON.stringify(report, null, 2))
} finally {
  Bun.WebView.closeAll()
}
