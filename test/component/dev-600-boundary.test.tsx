import { readFile } from "node:fs/promises"

import { cleanup, render } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import * as Root from "../../app"
import * as DetailItem from "../../app/component/brand/stylex/detail-item"
import * as ProductItem from "../../app/component/brand/stylex/product-item"
import * as QrCode from "../../app/component/brand/stylex/qr-code"
import * as Receipt from "../../app/component/brand/stylex/receipt"
import * as ResponsiveImage from "../../app/component/brand/stylex/responsive-image"
import * as SettingItem from "../../app/component/brand/stylex/setting-item"
import * as StatusStamp from "../../app/component/brand/stylex/status-stamp"
import * as StickyAlert from "../../app/component/brand/stylex/sticky-alert"
import * as SuccessBurst from "../../app/component/brand/stylex/success-burst"
import { themeMode, Theme } from "../../app/component/brand/stylex/theme"
import * as TicketCard from "../../app/component/brand/stylex/ticket-card"
import * as TicketCover from "../../app/component/brand/stylex/ticket-cover"

afterEach(cleanup)

test("new presentation families have root and direct exports", () => {
  for (const value of [
    Receipt,
    StatusStamp,
    DetailItem,
    SettingItem,
    StickyAlert,
    SuccessBurst,
    ResponsiveImage,
    ProductItem,
    TicketCover,
    TicketCard,
    QrCode
  ])
    expect(Object.keys(value).length).toBeGreaterThan(0)
  for (const name of [
    "Receipt",
    "StatusStamp",
    "DetailItem",
    "SettingItem",
    "StickyAlert",
    "SuccessBurst",
    "ResponsiveImage",
    "ProductItem",
    "TicketCover",
    "TicketCard",
    "QrCode"
  ])
    expect(name in Root).toBe(true)
})

test("each new component source excludes consumer and i18n imports", async () => {
  for (const name of [
    "receipt",
    "status-stamp",
    "detail-item",
    "setting-item",
    "sticky-alert",
    "success-burst",
    "responsive-image",
    "product-item",
    "ticket-cover",
    "ticket-card",
    "qr-code"
  ]) {
    const source = await readFile(`app/component/brand/stylex/${name}.tsx`, "utf8")
    expect(source).not.toMatch(/from\s+["'](?:@cue\/web|@bridge\/web|[^"']*i18n)/)
  }
})

test("every theme mode exposes the same semantic DOM contract (DEC-003, DEC-009)", () => {
  const modes = Object.values(themeMode)
  expect(modes).toEqual(["light", "dark", "cue", "future"])
  const attributes = modes.map((mode) => {
    const { container, unmount } = render(
      <Theme mode={mode} data-testid="theme-root">
        <button data-slot="button">Action</button>
      </Theme>
    )
    const root = container.querySelector("[data-testid=theme-root]") as HTMLElement
    const button = container.querySelector('[data-slot="button"]') as HTMLElement
    const snapshot = {
      rootTag: root.tagName,
      rootDataSlotTheme: root.dataset.pilotTheme,
      buttonTag: button.tagName,
      buttonDataSlot: button.dataset.slot,
      buttonText: button.textContent
    }
    unmount()
    return snapshot
  })
  // DOM shape, slot names, and structure must be identical across every theme mode.
  // Only `rootDataSlotTheme` may vary — that is the mode identity itself, not geometry.
  for (const snapshot of attributes) {
    expect(snapshot.rootTag).toBe(attributes[0]?.rootTag)
    expect(snapshot.buttonTag).toBe(attributes[0]?.buttonTag)
    expect(snapshot.buttonDataSlot).toBe(attributes[0]?.buttonDataSlot)
    expect(snapshot.buttonText).toBe(attributes[0]?.buttonText)
  }
  expect(new Set(attributes.map((snapshot) => snapshot.rootDataSlotTheme)).size).toBe(modes.length)
})
