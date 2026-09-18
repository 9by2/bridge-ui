import assert from "node:assert/strict"
import path from "node:path"

const root = path.resolve(import.meta.dir, "..")
const output = path.resolve(".eval/0909-stylex-public")
const build = Bun.spawnSync([process.execPath, "cmd/build-package.ts"], {
  cwd: root,
  stderr: "inherit",
  stdout: "inherit"
})
assert.equal(build.exitCode, 0)
const css = await Bun.file("dist/style.css").text()
const { Button, Theme } = await import(path.resolve("dist/index.js"))
const { createElement } = await import("react")
const { renderToString } = await import("react-dom/server")
const component = renderToString(createElement(Theme, { mode: "dark" }, createElement(Button, null, "Public")))
const sentinel = '<div id="outside" style="font-family:serif;color:rgb(1, 2, 3);font-size:13px">Outside</div>'
try {
  for (const order of ["before", "after"]) {
    await using view = new Bun.WebView({
      backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
      width: 390,
      height: 300
    })
    const host = "#outside{letter-spacing:2px}"
    const styles =
      order === "before" ? `<style>${css}</style><style>${host}</style>` : `<style>${host}</style><style>${css}</style>`
    await view.navigate(
      `data:text/html;charset=utf-8,${encodeURIComponent(`<!doctype html><html><meta charset="utf-8">${styles}<body>${sentinel}<div id="root">${component}</div></body></html>`)}`
    )
    const result = await view.evaluate<Record<string, string>>(
      `(()=>{const outside=getComputedStyle(document.querySelector('#outside'));const inside=getComputedStyle(document.querySelector('[data-slot=button]'));return {outsideFont:outside.fontFamily,outsideColor:outside.color,outsideSize:outside.fontSize,outsideSpacing:outside.letterSpacing,insideHeight:inside.height,insideColor:inside.color}})()`
    )
    assert.deepEqual(result, {
      outsideFont: "serif",
      outsideColor: "rgb(1, 2, 3)",
      outsideSize: "13px",
      outsideSpacing: "2px",
      insideHeight: "32px",
      insideColor: "lab(5.0601 0 0)"
    })
    await Bun.write(path.join(output, `${order}.png`), await view.screenshot())
  }
} finally {
  Bun.WebView.closeAll()
}
