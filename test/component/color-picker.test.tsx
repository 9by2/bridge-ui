import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { useState } from "react"
import { afterEach, expect, test, vi } from "vitest"

import {
  ColorPicker,
  colorPickerBackground,
  colorPickerParse,
  colorPickerPreset,
  type ColorPickerFillOption,
  type ColorPickerGradientOption
} from "../../app/component/brand/stylex/color-picker"

afterEach(cleanup)

const fillOption: ColorPickerFillOption[] = [
  { type: "fill", value: "ink", label: "Ink", color: "#111827" },
  { type: "fill", value: "sun", label: "Sun", color: "#facc15" }
]
const gradientOption: ColorPickerGradientOption[] = [
  { type: "gradient", value: "dawn", label: "Dawn", stop: ["#f97316", "#facc15"] },
  { type: "gradient", value: "dusk", label: "Dusk", stop: ["#1e3a8a", "#db2777"], kind: "radial" }
]

async function openEditor(name = "Custom color") {
  fireEvent.click(screen.getByRole("button", { name }))
  return within(await screen.findByRole("dialog"))
}

// ---------- value helper ----------

test("background serializes fill and every CSS gradient function", () => {
  expect(colorPickerBackground({ type: "fill", value: "a", label: "A", color: "#fff" })).toBe("#fff")
  const base = { type: "gradient", value: "g", label: "G" } as const
  expect(colorPickerBackground({ ...base, stop: ["red", "blue"] })).toBe("linear-gradient(135deg, red, blue)")
  expect(colorPickerBackground({ ...base, stop: ["red", { color: "blue", position: 40 }], angle: 90 })).toBe(
    "linear-gradient(90deg, red, blue 40%)"
  )
  expect(colorPickerBackground({ ...base, stop: [{ color: "red" }, "blue"], kind: "radial" })).toBe(
    "radial-gradient(circle, red, blue)"
  )
  expect(colorPickerBackground({ ...base, stop: ["red", "blue"], kind: "radial", shape: "ellipse" })).toBe(
    "radial-gradient(ellipse, red, blue)"
  )
  expect(colorPickerBackground({ ...base, stop: ["red", "blue"], kind: "conic" })).toBe(
    "conic-gradient(from 0deg, red, blue)"
  )
  expect(colorPickerBackground({ ...base, stop: ["red", "blue"], kind: "conic", angle: 45, repeating: true })).toBe(
    "repeating-conic-gradient(from 45deg, red, blue)"
  )
})

test("parse round-trips emitted CSS so a persisted value reopens as structured data", () => {
  for (const css of [
    "linear-gradient(90deg, #ff0000 0%, #0000ff 100%)",
    "repeating-radial-gradient(ellipse, #ff0000 0%, #0000ff 20%)",
    "conic-gradient(from 45deg, #ff0000 0%, #00ff00 50%, #0000ff 100%)"
  ]) {
    const option = colorPickerParse(css)
    expect(option?.type).toBe("gradient")
    expect(option && colorPickerBackground(option)).toBe(css)
  }
  expect(colorPickerParse("linear-gradient(rgb(0 0 0), #fff)")).toMatchObject({
    kind: "linear",
    stop: [{ color: "rgb(0 0 0)" }, { color: "#fff" }]
  })
  expect(colorPickerParse("#ABCDEF")).toEqual({ type: "fill", value: "#ABCDEF", label: "#ABCDEF", color: "#abcdef" })
  expect(colorPickerParse("url(a.png)")).toBeNull()
  expect(colorPickerParse("linear-gradient(90deg, red)")).toBeNull()
})

// ---------- fill mode ----------

test("fill picker selects a swatch by pointer and reports the chosen option", () => {
  const onValueChange = vi.fn()
  render(
    <ColorPicker mode="fill" aria-label="Text" option={fillOption} defaultValue="ink" onValueChange={onValueChange} />
  )
  expect(screen.getByRole("radiogroup", { name: "Text" })).toBeDefined()
  expect(screen.getByRole("radio", { name: "Ink" }).getAttribute("aria-checked")).toBe("true")
  fireEvent.click(screen.getByRole("radio", { name: "Sun" }))
  expect(screen.getByRole("radio", { name: "Sun" }).getAttribute("aria-checked")).toBe("true")
  expect(onValueChange).toHaveBeenCalledWith("sun", fillOption[1])
})

test("controlled picker only moves selection when its owner updates value", () => {
  const onValueChange = vi.fn()
  const { rerender } = render(
    <ColorPicker mode="fill" aria-label="Text" option={fillOption} value="ink" onValueChange={onValueChange} />
  )
  fireEvent.click(screen.getByRole("radio", { name: "Sun" }))
  expect(onValueChange).toHaveBeenCalledWith("sun", fillOption[1])
  expect(screen.getByRole("radio", { name: "Ink" }).getAttribute("aria-checked")).toBe("true")
  rerender(<ColorPicker mode="fill" aria-label="Text" option={fillOption} value="sun" onValueChange={onValueChange} />)
  expect(screen.getByRole("radio", { name: "Sun" }).getAttribute("aria-checked")).toBe("true")
})

test("each mode falls back to its own system preset", () => {
  render(<ColorPicker mode="fill" aria-label="Fill" custom={false} />)
  expect(screen.getAllByRole("radio")).toHaveLength(colorPickerPreset.fill.length)
  cleanup()
  render(<ColorPicker mode="gradient" aria-label="Gradient" custom={false} />)
  expect(screen.getAllByRole("radio")).toHaveLength(colorPickerPreset.gradient.length)
  expect(screen.queryByRole("button")).toBeNull()
})

function ControlledFill({ onValueChange }: { onValueChange: (value: string) => void }) {
  const [value, setValue] = useState("ink")
  return (
    <ColorPicker
      mode="fill"
      aria-label="Text"
      option={fillOption}
      value={value}
      label={{ custom: "Pick custom", hex: "Hex code", color: "Color wheel" }}
      onValueChange={(next) => {
        setValue(next)
        onValueChange(next)
      }}
    />
  )
}

test("fill editor commits only a valid hex and shows it as the selected trailing swatch", async () => {
  const onValueChange = vi.fn()
  render(<ControlledFill onValueChange={onValueChange} />)
  const editor = await openEditor("Pick custom")
  const hex = editor.getByRole("textbox", { name: "Hex code" })

  fireEvent.change(hex, { target: { value: "#12" } })
  expect(hex.getAttribute("aria-invalid")).toBe("true")
  expect(onValueChange).not.toHaveBeenCalled()

  fireEvent.change(hex, { target: { value: "#3366CC" } })
  expect(onValueChange).toHaveBeenLastCalledWith("#3366cc")
  expect(screen.getByRole("radio", { name: "#3366cc" }).getAttribute("aria-checked")).toBe("true")
})

test("fill editor color wheel commits the chosen color", async () => {
  const onValueChange = vi.fn()
  render(<ControlledFill onValueChange={onValueChange} />)
  const editor = await openEditor("Pick custom")
  fireEvent.input(editor.getByLabelText("Color wheel"), { target: { value: "#00ff00" } })
  expect(onValueChange).toHaveBeenLastCalledWith("#00ff00")
})

test("fill editor without a selection starts from black and commits the first valid hex", async () => {
  const onValueChange = vi.fn()
  render(<ColorPicker mode="fill" aria-label="Text" option={fillOption} onValueChange={onValueChange} />)
  const editor = await openEditor()
  expect(editor.getByLabelText<HTMLInputElement>("Color").value).toBe("#000000")
  fireEvent.change(editor.getByRole("textbox", { name: "Hex" }), { target: { value: "ff8800" } })
  expect(onValueChange).toHaveBeenLastCalledWith("#ff8800", expect.objectContaining({ type: "fill", color: "#ff8800" }))
})

test("callback-free picker submits the selected swatch through its form name", () => {
  const { container } = render(
    <form>
      <ColorPicker mode="fill" aria-label="Text" option={fillOption} name="text" defaultValue="ink" custom={false} />
    </form>
  )
  fireEvent.click(screen.getByRole("radio", { name: "Sun" }))
  const form = container.querySelector("form")
  expect(form).not.toBeNull()
  expect(new FormData(form ?? undefined).get("text")).toBe("sun")
})

test("disabled picker blocks swatch and custom interaction", () => {
  const onValueChange = vi.fn()
  render(<ColorPicker mode="fill" aria-label="Text" option={fillOption} disabled onValueChange={onValueChange} />)
  fireEvent.click(screen.getByRole("radio", { name: "Sun" }))
  expect(onValueChange).not.toHaveBeenCalled()
  expect(screen.getByRole("button", { name: "Custom color" }).hasAttribute("disabled")).toBe(true)
})

// ---------- gradient mode ----------

function ControlledGradient({ initial, onValueChange }: { initial: string; onValueChange: (value: string) => void }) {
  const [value, setValue] = useState(initial)
  return (
    <ColorPicker
      mode="gradient"
      aria-label="Background"
      option={gradientOption}
      value={value}
      onValueChange={(next, option) => {
        expect(option.type).toBe("gradient")
        setValue(next)
        onValueChange(next)
      }}
    />
  )
}

test("gradient editor starts from the selected swatch and switches between CSS gradient functions", async () => {
  const onValueChange = vi.fn()
  render(<ControlledGradient initial="dawn" onValueChange={onValueChange} />)
  const editor = await openEditor()

  fireEvent.change(editor.getByLabelText("Type"), { target: { value: "radial" } })
  expect(onValueChange).toHaveBeenLastCalledWith("radial-gradient(circle, #f97316 0%, #facc15 100%)")

  fireEvent.change(editor.getByLabelText("Shape"), { target: { value: "ellipse" } })
  expect(onValueChange).toHaveBeenLastCalledWith("radial-gradient(ellipse, #f97316 0%, #facc15 100%)")

  fireEvent.change(editor.getByLabelText("Type"), { target: { value: "conic" } })
  expect(onValueChange).toHaveBeenLastCalledWith("conic-gradient(from 0deg, #f97316 0%, #facc15 100%)")

  fireEvent.change(editor.getByLabelText("Angle"), { target: { value: "45" } })
  expect(onValueChange).toHaveBeenLastCalledWith("conic-gradient(from 45deg, #f97316 0%, #facc15 100%)")

  fireEvent.click(editor.getByRole("switch", { name: "Repeating" }))
  expect(onValueChange).toHaveBeenLastCalledWith("repeating-conic-gradient(from 45deg, #f97316 0%, #facc15 100%)")

  fireEvent.change(editor.getByLabelText("Type"), { target: { value: "linear" } })
  expect(onValueChange).toHaveBeenLastCalledWith("repeating-linear-gradient(135deg, #f97316 0%, #facc15 100%)")

  expect(
    screen
      .getByRole("radio", { name: "repeating-linear-gradient(135deg, #f97316 0%, #facc15 100%)" })
      .getAttribute("aria-checked")
  ).toBe("true")
})

test("gradient editor edits, adds and removes color stops but keeps at least two", async () => {
  const onValueChange = vi.fn()
  render(
    <ControlledGradient initial="linear-gradient(90deg, #ff0000 0%, #0000ff 100%)" onValueChange={onValueChange} />
  )
  const editor = await openEditor()
  expect(editor.getByRole("button", { name: "Remove stop 1" }).hasAttribute("disabled")).toBe(true)

  fireEvent.input(editor.getByLabelText("Stop 2 color"), { target: { value: "#00ff00" } })
  expect(onValueChange).toHaveBeenLastCalledWith("linear-gradient(90deg, #ff0000 0%, #00ff00 100%)")

  fireEvent.change(editor.getByLabelText("Stop 2 position"), { target: { value: "60" } })
  expect(onValueChange).toHaveBeenLastCalledWith("linear-gradient(90deg, #ff0000 0%, #00ff00 60%)")

  fireEvent.change(editor.getByLabelText("Stop 2 position"), { target: { value: "" } })
  fireEvent.change(editor.getByLabelText("Angle"), { target: { value: "" } })
  expect(onValueChange).toHaveBeenCalledTimes(2)

  fireEvent.click(editor.getByRole("button", { name: "Add stop" }))
  expect(onValueChange).toHaveBeenLastCalledWith("linear-gradient(90deg, #ff0000 0%, #00ff00 60%, #00ff00 100%)")

  fireEvent.click(editor.getByRole("button", { name: "Remove stop 1" }))
  expect(onValueChange).toHaveBeenLastCalledWith("linear-gradient(90deg, #00ff00 60%, #00ff00 100%)")
})

test("gradient editor without a selection starts from a neutral two-stop linear gradient", async () => {
  const onValueChange = vi.fn()
  render(<ColorPicker mode="gradient" aria-label="Background" option={gradientOption} onValueChange={onValueChange} />)
  const editor = await openEditor()
  fireEvent.click(editor.getByRole("switch", { name: "Repeating" }))
  expect(onValueChange).toHaveBeenLastCalledWith(
    "repeating-linear-gradient(135deg, #000000 0%, #ffffff 100%)",
    expect.objectContaining({ kind: "linear", repeating: true })
  )
})

test("gradient editor opens a radial swatch with its implicit shape and a hex-safe stop color", async () => {
  const onValueChange = vi.fn()
  render(
    <ColorPicker
      mode="gradient"
      aria-label="Background"
      option={[{ type: "gradient", value: "mist", label: "Mist", kind: "radial", stop: ["rgb(0 0 0)", "#ffffff"] }]}
      defaultValue="mist"
      onValueChange={onValueChange}
    />
  )
  const editor = await openEditor()
  expect(editor.getByLabelText<HTMLSelectElement>("Shape").value).toBe("circle")
  // Native color inputs only accept hex, so a non-hex stop starts from black instead of breaking the editor.
  expect(editor.getByLabelText<HTMLInputElement>("Stop 1 color").value).toBe("#000000")
  fireEvent.change(editor.getByLabelText("Type"), { target: { value: "linear" } })
  expect(onValueChange).toHaveBeenLastCalledWith("linear-gradient(135deg, #000000 0%, #ffffff 100%)", expect.anything())
})

test("gradient editor keeps working when its owner replaces the value with more stops while open", async () => {
  const onValueChange = vi.fn()
  const two = "linear-gradient(90deg, #ff0000 0%, #0000ff 100%)"
  const three = "linear-gradient(90deg, #ff0000 0%, #00ff00 50%, #0000ff 100%)"
  const { rerender } = render(
    <ColorPicker
      mode="gradient"
      aria-label="Background"
      option={gradientOption}
      value={two}
      onValueChange={onValueChange}
    />
  )
  const editor = await openEditor()
  rerender(
    <ColorPicker
      mode="gradient"
      aria-label="Background"
      option={gradientOption}
      value={three}
      onValueChange={onValueChange}
    />
  )
  expect(editor.getAllByRole("listitem")).toHaveLength(3)
  fireEvent.input(editor.getByLabelText("Stop 3 color"), { target: { value: "#ffffff" } })
  expect(onValueChange).toHaveBeenLastCalledWith(
    "linear-gradient(90deg, #ff0000 0%, #00ff00 50%, #ffffff 100%)",
    expect.anything()
  )
})

test("a value from the other mode is not rendered as a custom swatch", () => {
  render(<ColorPicker mode="gradient" aria-label="Background" option={gradientOption} value="#ff0000" />)
  expect(screen.getAllByRole("radio")).toHaveLength(gradientOption.length)
  cleanup()
  render(<ColorPicker mode="fill" aria-label="Text" option={fillOption} value="linear-gradient(red, blue)" />)
  expect(screen.getAllByRole("radio")).toHaveLength(fillOption.length)
})
