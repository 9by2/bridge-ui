import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const output = path.resolve(".eval/0914-cue-theme-alignment")
await mkdir(output, { recursive: true })
const reports = []

type CueReport = {
  mode: string
  colorScheme: string
  ctaRadius: string
  ctaFont: string
  ctaGradient: string
  warningBackground: string
  warningColor: string
  destructiveBackground: string
  destructiveColor: string
}

try {
  for (const width of [390, 1280]) {
    await using view = new Bun.WebView({
      width,
      height: 480,
      backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
    })
    await view.navigate("http://127.0.0.1:6007/style-x?preview&theme=cue#button/variant")
    await view.cdp("Emulation.setDeviceMetricsOverride", {
      width,
      height: 480,
      deviceScaleFactor: 1,
      mobile: width === 390
    })
    await view.evaluate("document.fonts.ready")
    for (let attempt = 0; attempt < 100; attempt++) {
      const ready = await view.evaluate(
        "[...document.querySelectorAll('button')].some((node) => node.textContent.trim() === 'cta')"
      )
      if (ready) break
      await Bun.sleep(25)
    }
    const actual = await view.evaluate<CueReport>(`(() => {
      const theme = document.querySelector('[data-pilot-theme="cue"]')
      const button = (name) => [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === name)
      const cta = getComputedStyle(button('cta'))
      const warning = getComputedStyle(button('warning'))
      const destructive = getComputedStyle(button('destructive'))
      return {
        mode: theme.dataset.pilotTheme,
        colorScheme: getComputedStyle(theme).colorScheme,
        ctaRadius: cta.borderRadius,
        ctaFont: cta.fontFamily,
        ctaGradient: cta.backgroundImage,
        warningBackground: warning.backgroundColor,
        warningColor: warning.color,
        destructiveBackground: destructive.backgroundColor,
        destructiveColor: destructive.color
      }
    })()`)
    assert.equal(actual.mode, "cue")
    assert.equal(actual.colorScheme, "dark")
    assert.equal(actual.ctaRadius, "0px")
    assert.match(actual.ctaFont, /Plus Jakarta Sans Variable/)
    assert.match(actual.ctaGradient, /linear-gradient/)
    assert.equal(actual.warningColor, actual.destructiveColor)
    await Bun.write(path.join(output, `cue-${width}.png`), await view.screenshot())
    reports.push({ width, ...actual })
  }
  await Bun.write(
    path.join(output, "report.json"),
    JSON.stringify(
      { bun: Bun.version, backend: "chrome", route: "/style-x?preview&theme=cue#button/variant", reports },
      null,
      2
    )
  )
  await Bun.write(
    path.join(output, "README.md"),
    "# Cue theme evaluation\n\nRun `bun cmd/verify-cue-theme.ts` while the static catalog is served on port 6007. Evidence covers 390px and 1280px Cue Button variant rendering, semantic action color, CTA typography/shape, and native dark color scheme.\n"
  )
  console.log(`Verified ${reports.length} Cue Bun.WebView case`)
} finally {
  Bun.WebView.closeAll()
}
