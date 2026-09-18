import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const output = path.resolve(".eval/0914-shell-header")
await mkdir(output, { recursive: true })
const reports = []

type ShellReport = {
  width: number
  theme: string
  headerPosition: string
  headerTop: number
  insetWidth: number
  collapsedInsetWidth: number
  documentOverflow: boolean
  titleOverflow: string
  titleWhiteSpace: string
}

try {
  for (const width of [390, 1280]) {
    for (const theme of ["light", "dark"]) {
      await using view = new Bun.WebView({
        width,
        height: 500,
        backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
      })
      await view.navigate(`http://127.0.0.1:6007/?preview&theme=${theme}#shell-header/default`)
      await view.cdp("Emulation.setDeviceMetricsOverride", {
        width,
        height: 500,
        deviceScaleFactor: 1,
        mobile: width === 390
      })
      await view.evaluate("document.fonts.ready")
      for (let attempt = 0; attempt < 100; attempt++) {
        if (await view.evaluate("Boolean(document.querySelector('[data-slot=\"shell-header\"]'))")) break
        await Bun.sleep(25)
      }

      const initial = await view.evaluate<{ insetWidth: number; headerPosition: string }>(`(() => {
        const header = document.querySelector('[data-slot="shell-header"]')
        const inset = document.querySelector('[data-slot="sidebar-inset"]')
        return {
          insetWidth: inset.getBoundingClientRect().width,
          headerPosition: getComputedStyle(header).position
        }
      })()`)
      await Bun.write(path.join(output, `shell-${theme}-${width}.png`), await view.screenshot())
      await view.evaluate("scrollTo(0, 500)")
      const headerTop = await view.evaluate<number>(
        "document.querySelector('[data-slot=\"shell-header\"]').getBoundingClientRect().top"
      )
      await view.evaluate("document.querySelector('[data-slot=\"sidebar-trigger\"]')?.click()")
      await Bun.sleep(250)
      const actual = await view.evaluate<
        Omit<ShellReport, "width" | "theme" | "headerPosition" | "headerTop" | "insetWidth">
      >(
        `(() => {
          const inset = document.querySelector('[data-slot="sidebar-inset"]')
          const title = document.querySelector('[data-slot="shell-header-title"]')
          const titleStyle = getComputedStyle(title)
          return {
            collapsedInsetWidth: inset.getBoundingClientRect().width,
            documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
            titleOverflow: titleStyle.overflow,
            titleWhiteSpace: titleStyle.whiteSpace
          }
        })()`
      )
      assert.equal(initial.headerPosition, "sticky")
      assert.equal(headerTop, 0)
      assert.equal(actual.documentOverflow, false)
      if (width === 1280) assert.ok(actual.collapsedInsetWidth > initial.insetWidth)
      await Bun.write(path.join(output, `shell-${theme}-${width}-toggled.png`), await view.screenshot())
      reports.push({
        width,
        theme,
        headerPosition: initial.headerPosition,
        headerTop,
        insetWidth: initial.insetWidth,
        ...actual
      })
    }
  }

  await using longTitle = new Bun.WebView({
    width: 390,
    height: 320,
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
  })
  await longTitle.navigate("http://127.0.0.1:6007/?preview&theme=light#shell-header/long-title")
  await longTitle.evaluate("document.fonts.ready")
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await longTitle.evaluate("Boolean(document.querySelector('[data-slot=\"shell-header-title\"]'))")) break
    await Bun.sleep(25)
  }
  const title = await longTitle.evaluate<{ overflow: string; whiteSpace: string }>(`(() => {
    const style = getComputedStyle(document.querySelector('[data-slot="shell-header-title"]'))
    return { overflow: style.overflow, whiteSpace: style.whiteSpace }
  })()`)
  assert.equal(title.overflow, "hidden")
  assert.equal(title.whiteSpace, "nowrap")
  await Bun.write(path.join(output, "shell-long-title-390.png"), await longTitle.screenshot())

  await Bun.write(
    path.join(output, "report.json"),
    JSON.stringify({ bun: Bun.version, backend: "chrome", reports, longTitle: title }, null, 2)
  )
  await Bun.write(
    path.join(output, "README.md"),
    "# Shell header evaluation\n\nRun `bun cmd/verify-shell-header.ts` while the static catalog is served on port 6007. Evidence covers 390px and 1280px light/dark rendering, sticky scroll position, desktop collapse width, document overflow, and long-title truncation.\n"
  )
  console.log(`Verified ${reports.length} shell header Bun.WebView case`)
} finally {
  Bun.WebView.closeAll()
}
