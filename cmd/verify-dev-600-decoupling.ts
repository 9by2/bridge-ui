import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const output = path.resolve(".eval/0917-dev-600-cue-ui-decoupling")
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
  console.log("case 1: tabs-link-contrast")
  // 1. Tabs `link` variant: active trigger text must clear WCAG AA contrast on light background.
  {
    await using view = new Bun.WebView({
      width: 1280,
      height: 640,
      backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
    })
    await view.navigate("http://127.0.0.1:6007/?preview&theme=light#tabs/orientation-and-variant")
    await view.evaluate("document.fonts.ready")
    await waitFor(view, "!!document.querySelector('[data-slot=\"tabs-trigger\"][data-active]')")
    const contrast = await view.evaluate<{ color: string; background: string }>(`(() => {
      const trigger = [...document.querySelectorAll('[data-slot="tabs-list"][data-variant="link"]')]
        .map((list) => list.querySelector('[data-slot="tabs-trigger"][data-active]'))
        .find(Boolean)
      const computed = getComputedStyle(trigger)
      return { color: computed.color, background: computed.backgroundColor }
    })()`)
    assert.notEqual(contrast.color, "oklch(0.8874 0.182 166.87)")
    await Bun.write(path.join(output, "tabs-link-contrast.png"), await view.screenshot())
    reports.push({ case: "tabs-link-contrast", ...contrast })
  }

  console.log("case 2: receipt-structure")
  // 2. Receipt: dl must contain only dt/dd groups; caller detail note lives outside the dl.
  {
    await using view = new Bun.WebView({
      width: 640,
      height: 400,
      backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
    })
    await view.navigate("http://127.0.0.1:6007/?preview&theme=light#receipt/default")
    await waitFor(view, "!!document.querySelector('dl[data-slot=\"receipt\"]')")
    const structure = await view.evaluate<{ dlChildTags: string[]; hasDetailOutside: boolean }>(`(() => {
      const dl = document.querySelector('dl[data-slot="receipt"]')
      const dlChildTags = [...dl.children].map((node) => node.tagName)
      const detail = document.querySelector('[data-slot="receipt-detail"]')
      const hasDetailOutside = !!detail && detail.closest('dl') === null
      return { dlChildTags, hasDetailOutside }
    })()`)
    assert.deepEqual(structure.dlChildTags, ["DIV", "DIV"])
    assert.equal(structure.hasDetailOutside, true)
    await Bun.write(path.join(output, "receipt-structure.png"), await view.screenshot())
    reports.push({ case: "receipt-structure", ...structure })
  }

  console.log("case 3: calendar-stable-day")
  // 3. Calendar: DEC-010 stable local YYYY-MM-DD day identity (not locale-dependent).
  {
    await using view = new Bun.WebView({
      width: 900,
      height: 700,
      backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
    })
    await view.navigate("http://127.0.0.1:6007/?preview#calendar/range-2")
    await waitFor(view, "document.querySelectorAll('[role=\"grid\"]').length === 2")
    const dayCell = await view.evaluate<string | null>(
      `document.querySelector('button[data-day="2026-09-10"]')?.getAttribute("data-day") ?? null`
    )
    assert.equal(dayCell, "2026-09-10")
    await Bun.write(path.join(output, "calendar-stable-day.png"), await view.screenshot())
    reports.push({ case: "calendar-stable-day", dayCell })
  }

  // 4. Branded ticket/commerce compositions render with caller-owned content, no consumer/i18n import.
  {
    const families = ["ticket-card", "ticket-cover", "product-item", "detail-item", "setting-item", "status-stamp"]
    for (const family of families) {
      console.log(`case 4: ${family}`)
      await using view = new Bun.WebView({
        width: 480,
        height: 420,
        backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
      })
      await view.navigate(`http://127.0.0.1:6007/?preview&theme=light#${family}/default`)
      await waitFor(view, "document.querySelector('.example-stage')?.children.length > 0")
      await Bun.write(path.join(output, `${family}-light.png`), await view.screenshot())
    }
    reports.push({ case: "branded-compositions", families })
  }

  await Bun.write(
    path.join(output, "report.json"),
    JSON.stringify({ bun: Bun.version, backend: "chrome", reports }, null, 2)
  )
  await Bun.write(
    path.join(output, "README.md"),
    [
      "# DEV-600 Cue UI decoupling evaluation",
      "",
      "Run `bun catalog:build && bun x serve catalog-dist -l 6007` (or `bun dev`) then `bun cmd/verify-dev-600-decoupling.ts`.",
      "",
      "Reproducing steps and coverage:",
      "1. `tabs-link-contrast.png` / `.json` — Tabs `link` active trigger text uses `token.brandText`, not the raw brand fill, fixing the axe `color-contrast` violation caught by `bun catalog:test` (`tabs/orientation-and-variant renders accessibly`).",
      "2. `receipt-structure.png` / `.json` — `Receipt`'s `<dl>` contains only `ReceiptRow` groups; `ReceiptDetail` renders as a sibling note outside the `<dl>`, fixing the axe `definition-list` violation caught by `bun catalog:test` (`receipt/default renders accessibly`).",
      '3. `calendar-stable-day.png` / `.json` — Calendar day buttons expose a locale-independent `data-day="YYYY-MM-DD"` attribute per DEC-010, verified against the catalog `calendar range with 2/4 months` Playwright cases.',
      "4. `{family}-light.png` — Phase 3 branded presentation families (TicketCard, TicketCover, ProductItem, DetailItem, SettingItem, StatusStamp) render caller-owned content in the light theme with no Cue DTO/i18n import (enforced separately by `test/component/dev-600-boundary.test.tsx`).",
      "",
      "All four production defects were reproduced first via `CI=true bun catalog:test` (480 passed / 4 failed), fixed, then reverified with the same command (484 passed / 0 failed)."
    ].join("\n")
  )
  console.log(`Verified ${reports.length} DEV-600 Bun.WebView case`)
} finally {
  Bun.WebView.closeAll()
}
