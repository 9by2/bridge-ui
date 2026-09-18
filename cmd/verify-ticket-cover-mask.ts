import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

/**
 * Visual + computed-style evidence that TicketCover masks with the exact
 * ticket-notch SVG the user supplied, and keeps a locked 16/9 ratio at
 * multiple widths. Run against a served catalog-dist on :6007.
 */
const output = path.resolve(".eval/0918-ticket-cover-mask")
await mkdir(output, { recursive: true })
const reports: Record<string, unknown>[] = []

async function waitFor(view: Bun.WebView, expression: string, attempts = 80) {
  for (let attempt = 0; attempt < attempts; attempt++) {
    const ready = await view.evaluate<boolean>(expression)
    if (ready) return
    await Bun.sleep(25)
  }
  throw new Error(`Timed out waiting for: ${expression}`)
}

try {
  for (const width of [320, 640, 960] as const) {
    console.log(`case: ticket-cover-mask-${width}`)
    await using view = new Bun.WebView({
      width,
      height: Math.round((width * 9) / 16) + 80,
      backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
    })
    await view.navigate("http://127.0.0.1:6007/?preview&theme=light#ticket-cover/default")
    await view.evaluate("document.fonts.ready")
    await waitFor(view, "!!document.querySelector('[data-slot=\"ticket-cover\"]')")
    const computed = await view.evaluate<{
      maskImage: string
      maskSize: string
      maskRepeat: string
      ratio: number
    }>(`(() => {
      const media = document.querySelector('[data-slot="ticket-cover"]')
      const style = getComputedStyle(media)
      const rect = media.getBoundingClientRect()
      return {
        maskImage: (style.maskImage !== "none" ? style.maskImage : style.webkitMaskImage).slice(0, 40),
        maskSize: style.maskSize !== "auto" ? style.maskSize : style.webkitMaskSize,
        maskRepeat: style.maskRepeat || style.webkitMaskRepeat,
        ratio: rect.width / rect.height
      }
    })()`)
    assert.match(computed.maskImage, /data:image\/svg\+xml/)
    assert.match(computed.maskSize, /100%\s+100%/)
    assert.match(computed.maskRepeat, /no-repeat/)
    assert.ok(Math.abs(computed.ratio - 16 / 9) < 0.05, `ratio ${computed.ratio} not close to 16/9`)
    await Bun.write(path.join(output, `ticket-cover-mask-${width}.png`), await view.screenshot())
    reports.push({ case: `ticket-cover-mask-${width}`, width, ...computed })
  }

  await Bun.write(path.join(output, "report.json"), JSON.stringify(reports, null, 2))
  console.log("All ticket-cover mask cases verified. Evidence in .eval/0918-ticket-cover-mask/")
} catch (error) {
  await Bun.write(path.join(output, "report.json"), JSON.stringify(reports, null, 2))
  console.error(error)
  process.exit(1)
}
