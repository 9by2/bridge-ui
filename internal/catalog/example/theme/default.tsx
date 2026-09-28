import * as UI from "@bridge/ui"

const ProductTheme = {
  color: {
    primary: "oklch(0.54 0.2 265)",
    primaryForeground: "white",
    surface: "oklch(0.98 0.01 265)",
    surfaceForeground: "oklch(0.18 0.01 265)",
    border: "oklch(0.86 0.02 265)"
  },
  radius: { control: "0.375rem", surface: "0.75rem", overlay: "0.75rem" }
} as const satisfies UI.BridgeThemeOverride

export default function Example() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <UI.Theme>
        <div className="border p-4 shadow-sm">
          <p className="mb-3 text-sm font-medium">Default theme</p>
          <UI.Button>Continue</UI.Button>
        </div>
      </UI.Theme>
      <UI.Theme density={UI.bridgeDensity.compact}>
        <div className="border p-4 shadow-sm">
          <p className="mb-3 text-sm font-medium">Compact density</p>
          <UI.Button>Continue</UI.Button>
        </div>
      </UI.Theme>
      <UI.Theme theme={ProductTheme}>
        <div className="border p-4 shadow-sm">
          <p className="mb-3 text-sm font-medium">Custom product theme</p>
          <UI.Button>Continue</UI.Button>
        </div>
      </UI.Theme>
    </div>
  )
}
