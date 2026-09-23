import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { useState } from "react"
import { afterEach, expect, test, vi } from "vitest"

import {
  ColorPicker,
  colorPickerBackground,
  colorPickerPreset,
  type ColorPickerOption
} from "../../app/component/brand/stylex/color-picker"

afterEach(cleanup)

const option: ColorPickerOption[] = [
  { type: "fill", value: "ink", label: "Ink", color: "#111827" },
  { type: "gradient", value: "dawn", label: "Dawn", stop: ["#f97316", "#facc15"] }
]

test("uncontrolled picker selects a swatch by pointer and reports the chosen option", () => {
  const onValueChange = vi.fn()
  render(<ColorPicker aria-label="Background" option={option} defaultValue="ink" onValueChange={onValueChange} />)
  expect(screen.getByRole("radiogroup", { name: "Background" })).toBeDefined()
  expect(screen.getByRole("radio", { name: "Ink" }).getAttribute("aria-checked")).toBe("true")
  fireEvent.click(screen.getByRole("radio", { name: "Dawn" }))
  expect(screen.getByRole("radio", { name: "Dawn" }).getAttribute("aria-checked")).toBe("true")
  expect(screen.getByRole("radio", { name: "Ink" }).getAttribute("aria-checked")).toBe("false")
  expect(onValueChange).toHaveBeenCalledWith("dawn", option[1])
})

test("controlled picker only moves selection when its owner updates value", () => {
  const onValueChange = vi.fn()
  const { rerender } = render(
    <ColorPicker aria-label="Background" option={option} value="ink" onValueChange={onValueChange} />
  )
  fireEvent.click(screen.getByRole("radio", { name: "Dawn" }))
  expect(onValueChange).toHaveBeenCalledWith("dawn", option[1])
  expect(screen.getByRole("radio", { name: "Ink" }).getAttribute("aria-checked")).toBe("true")
  rerender(<ColorPicker aria-label="Background" option={option} value="dawn" onValueChange={onValueChange} />)
  expect(screen.getByRole("radio", { name: "Dawn" }).getAttribute("aria-checked")).toBe("true")
})

test("picker renders the system gradient preset when no option list is injected", () => {
  render(<ColorPicker aria-label="Background" custom={false} />)
  expect(screen.getAllByRole("radio")).toHaveLength(colorPickerPreset.gradient.length)
  expect(screen.queryByRole("button")).toBeNull()
})

test("background helper defaults gradient to linear and supports fill, radial and custom angle", () => {
  expect(colorPickerBackground({ type: "fill", value: "a", label: "A", color: "#fff" })).toBe("#fff")
  expect(colorPickerBackground({ type: "gradient", value: "b", label: "B", stop: ["red", "blue"] })).toBe(
    "linear-gradient(135deg, red, blue)"
  )
  expect(colorPickerBackground({ type: "gradient", value: "c", label: "C", stop: ["red", "blue"], angle: 90 })).toBe(
    "linear-gradient(90deg, red, blue)"
  )
  expect(
    colorPickerBackground({ type: "gradient", value: "d", label: "D", stop: ["red", "blue"], shape: "radial" })
  ).toBe("radial-gradient(circle, red, blue)")
})

function Controlled({ onValueChange }: { onValueChange: (value: string, option: ColorPickerOption) => void }) {
  const [value, setValue] = useState("ink")
  return (
    <ColorPicker
      aria-label="Background"
      option={option}
      value={value}
      customLabel="Pick custom"
      hexLabel="Hex code"
      colorLabel="Color wheel"
      onValueChange={(next, chosen) => {
        setValue(next)
        onValueChange(next, chosen)
      }}
    />
  )
}

test("custom hex commits only a valid color and shows it as the selected trailing swatch", async () => {
  const onValueChange = vi.fn()
  render(<Controlled onValueChange={onValueChange} />)
  fireEvent.click(screen.getByRole("button", { name: "Pick custom" }))
  const hex = await screen.findByRole("textbox", { name: "Hex code" })

  fireEvent.change(hex, { target: { value: "#12" } })
  expect(hex.getAttribute("aria-invalid")).toBe("true")
  expect(onValueChange).not.toHaveBeenCalled()

  fireEvent.change(hex, { target: { value: "#3366CC" } })
  expect(hex.getAttribute("aria-invalid")).toBe("false")
  expect(onValueChange).toHaveBeenLastCalledWith("#3366cc", {
    type: "fill",
    value: "#3366cc",
    label: "#3366cc",
    color: "#3366cc"
  })
  await waitFor(() => expect(screen.getByRole("radio", { name: "#3366cc" }).getAttribute("aria-checked")).toBe("true"))
  expect(screen.getByRole("radio", { name: "Ink" }).getAttribute("aria-checked")).toBe("false")
})

test("native color input commits the chosen color", async () => {
  const onValueChange = vi.fn()
  render(<Controlled onValueChange={onValueChange} />)
  fireEvent.click(screen.getByRole("button", { name: "Pick custom" }))
  const wheel = await screen.findByLabelText("Color wheel")
  fireEvent.input(wheel, { target: { value: "#00ff00" } })
  expect(onValueChange).toHaveBeenLastCalledWith("#00ff00", expect.objectContaining({ type: "fill", color: "#00ff00" }))
})

test("callback-free picker submits the selected swatch through its form name", () => {
  const { container } = render(
    <form>
      <ColorPicker aria-label="Background" option={option} name="background" defaultValue="ink" custom={false} />
    </form>
  )
  fireEvent.click(screen.getByRole("radio", { name: "Dawn" }))
  const form = container.querySelector("form")
  expect(form).not.toBeNull()
  expect(new FormData(form ?? undefined).get("background")).toBe("dawn")
})

test("reopening the custom panel shows the current custom color", async () => {
  render(
    <ColorPicker
      aria-label="Background"
      option={option}
      defaultValue="#abcdef"
      customLabel="Pick custom"
      hexLabel="Hex"
    />
  )
  expect(screen.getByRole("radio", { name: "#abcdef" }).getAttribute("aria-checked")).toBe("true")
  fireEvent.click(screen.getByRole("button", { name: "Pick custom" }))
  expect((await screen.findByRole<HTMLInputElement>("textbox", { name: "Hex" })).value).toBe("#abcdef")
})

test("disabled picker blocks swatch and custom interaction", () => {
  const onValueChange = vi.fn()
  render(<ColorPicker aria-label="Background" option={option} disabled onValueChange={onValueChange} />)
  fireEvent.click(screen.getByRole("radio", { name: "Dawn" }))
  expect(onValueChange).not.toHaveBeenCalled()
  expect(screen.getByRole("button", { name: "Custom color" }).hasAttribute("disabled")).toBe(true)
})
