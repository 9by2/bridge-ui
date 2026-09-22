import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { Button } from "../../app/component/brand/stylex/button"
import { Dialog, DialogContent } from "../../app/component/brand/stylex/dialog"
import {
  bridgeDensity,
  Theme,
  useBridgeTheme,
  useThemeMode,
  type BridgeThemeOverride
} from "../../app/component/brand/stylex/theme"

afterEach(cleanup)

const productTheme = {
  color: { primary: "rebeccapurple", surface: "papayawhip" },
  radius: { control: "3px", surface: "11px" },
  space: { 2: "0.625rem", 4: "1.25rem" }
} as const satisfies BridgeThemeOverride

function ThemeValue() {
  const theme = useBridgeTheme()
  const mode = useThemeMode()
  return <output data-testid="theme-value">{`${mode}:${theme.density}:${theme.theme.radius?.control}`}</output>
}

test("Theme exposes documented scoped customization and a resolved public context", () => {
  render(
    <Theme density={bridgeDensity.compact} theme={productTheme} data-testid="outer-theme">
      <ThemeValue />
    </Theme>
  )

  const root = screen.getByTestId("outer-theme")
  expect(root.getAttribute("data-bridge-theme")).toBe("light")
  expect(root.style.getPropertyValue("--bridge-color-primary")).toBe("rebeccapurple")
  expect(root.style.getPropertyValue("--bridge-color-surface")).toBe("papayawhip")
  expect(root.style.getPropertyValue("--bridge-control-radius")).toBe("3px")
  expect(root.style.getPropertyValue("--bridge-surface-radius")).toBe("11px")
  expect(root.style.getPropertyValue("--bridge-space-2")).toBe("0.625rem")
  expect(root.style.getPropertyValue("--bridge-space-4")).toBe("1.25rem")
  expect(screen.getByTestId("theme-value").textContent).toBe("light:compact:3px")
})

test("nested Theme inherits omitted customization and only replaces explicit values", () => {
  render(
    <Theme theme={productTheme} data-testid="outer-theme">
      <Theme theme={{ radius: { surface: "0" } }} data-testid="inner-theme">
        <ThemeValue />
      </Theme>
    </Theme>
  )

  const inner = screen.getByTestId("inner-theme")
  expect(inner.style.getPropertyValue("--bridge-color-primary")).toBe("rebeccapurple")
  expect(inner.style.getPropertyValue("--bridge-control-radius")).toBe("3px")
  expect(inner.style.getPropertyValue("--bridge-surface-radius")).toBe("0")
  expect(screen.getByTestId("theme-value").textContent).toBe("light:default:3px")
})

test("Dialog portal receives the nearest resolved customization", async () => {
  render(
    <Theme theme={productTheme}>
      <Dialog defaultOpen>
        <DialogContent>Theme-aware dialog</DialogContent>
      </Dialog>
    </Theme>
  )

  const dialog = await screen.findByRole("dialog")
  const portalTheme = dialog.closest("[data-bridge-theme]") as HTMLElement
  expect(portalTheme.style.getPropertyValue("--bridge-color-primary")).toBe("rebeccapurple")
  expect(portalTheme.style.getPropertyValue("--bridge-surface-radius")).toBe("11px")
})

test("density presets are finite public values", () => {
  expect(Object.values(bridgeDensity)).toEqual(["compact", "default", "comfortable"])
  render(
    <Theme density="comfortable" data-testid="theme">
      <Button>Continue</Button>
    </Theme>
  )
  expect(screen.getByTestId("theme").getAttribute("data-bridge-density")).toBe("comfortable")
})

test("Theme supports every documented semantic color override", () => {
  const color = {
    background: "color-1",
    foreground: "color-2",
    primary: "color-3",
    primaryForeground: "color-4",
    surface: "color-5",
    surfaceForeground: "color-6",
    popover: "color-7",
    popoverForeground: "color-8",
    border: "color-9",
    input: "color-10",
    muted: "color-11",
    mutedForeground: "color-12",
    ring: "color-13"
  } as const
  render(
    <Theme theme={{ color }} data-testid="theme">
      Colors
    </Theme>
  )
  const root = screen.getByTestId("theme")
  for (const [name, value] of Object.entries(color)) {
    const variable = `--bridge-color-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`
    expect(root.style.getPropertyValue(variable)).toBe(value)
  }
})
