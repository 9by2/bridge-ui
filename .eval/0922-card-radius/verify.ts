import assert from "node:assert/strict"

const output = ".eval/0922-card-radius"
const AppConfig = { BASE_URL: "http://127.0.0.1:6007/?preview&theme=light#card/size" } as const
const report: Array<{ width: number; radius: Record<string, string[]> }> = []

for (const width of [1280, 390]) {
  await using view = new Bun.WebView({
    backend: { type: "chrome", url: false, argv: ["--no-sandbox"] },
    width,
    height: 800
  })
  await view.navigate(AppConfig.BASE_URL)
  await view.cdp("Runtime.evaluate", { expression: "location.hash = 'card/size'" })
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await view.evaluate('Boolean(document.querySelector("[data-radius=none]"))')) break
    await Bun.sleep(50)
  }
  assert.equal(await view.evaluate('Boolean(document.querySelector("[data-radius=none]"))'), true)
  await view.evaluate("document.fonts.ready")
  const cardCount = await view.evaluate("document.querySelectorAll('[data-radius]').length")
  assert.equal(cardCount, 6)
  const radius = await view.evaluate<Record<string, string[]>>(`(() => Object.fromEntries(
    ["none", "sm", "default", "lg"].map((value) => {
      const card = [...document.querySelectorAll('[data-radius="' + value + '"]')].find((node) =>
        node.querySelector('[data-slot="card-footer"]')
      )
      return [
        value,
        [
          card,
          card.querySelector('[data-slot="card-header"]'),
          card.querySelector('[data-slot="card-footer"]')
        ].map((node, index) => {
          const style = getComputedStyle(node)
          return index === 2 ? style.borderBottomLeftRadius : style.borderTopLeftRadius
        })
      ]
    })
  ))()`)
  assert.deepEqual(radius, {
    none: ["0px", "0px", "0px"],
    sm: ["8px", "8px", "8px"],
    default: ["14px", "14px", "14px"],
    lg: ["18px", "18px", "18px"]
  })
  assert.equal(await view.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), true)
  report.push({ width, radius })
  await Bun.write(`${output}/card-radius-${width}.png`, await view.screenshot())
}

await Bun.write(`${output}/report.json`, JSON.stringify(report, null, 2))
Bun.WebView.closeAll()
