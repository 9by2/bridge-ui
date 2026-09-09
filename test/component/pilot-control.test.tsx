import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { Checkbox } from "../../app/component/brand/stylex/checkbox"
import { RadioGroup, RadioGroupItem } from "../../app/component/brand/stylex/radio-group"
import { Slider } from "../../app/component/brand/stylex/slider"
import { Switch } from "../../app/component/brand/stylex/switch"
import { Toggle, toggleVariants } from "../../app/component/brand/stylex/toggle"

afterEach(cleanup)

test("control variant and callback class preserve caller state", () => {
  for (const invalid of [undefined, true, "true", false] as const) {
    const { unmount } = render(
      <>
        <Checkbox aria-label="Check" aria-invalid={invalid} className={() => "caller"} />
        <Switch aria-label="Switch" aria-invalid={invalid} />
        <RadioGroup className={() => "group"}>
          <RadioGroupItem value="a" aria-label="Radio" aria-invalid={invalid} className={() => "radio"} />
        </RadioGroup>
        <Toggle aria-label="Toggle" aria-invalid={invalid} className={() => "toggle"} />
      </>
    )
    expect(screen.getByRole("checkbox").className).toContain("caller")
    unmount()
  }
  for (const size of [null, "default", "sm", "lg"] as const)
    for (const variant of [null, "default", "outline"] as const) {
      const { unmount } = render(
        <Toggle size={size} variant={variant}>
          Toggle
        </Toggle>
      )
      expect(toggleVariants({ size, variant })).toBeTypeOf("string")
      unmount()
    }
  const { rerender } = render(<Slider orientation="vertical" className={() => "caller"} />)
  expect(screen.getByRole("group").className).toContain("caller")
  rerender(<Slider value={[25]} />)
})

test("radio group and toggle preserve primitive selection", () => {
  render(
    <>
      <RadioGroup defaultValue="a">
        <RadioGroupItem value="a" aria-label="A" />
        <RadioGroupItem value="b" aria-label="B" />
      </RadioGroup>
      <Toggle aria-label="Bold">B</Toggle>
    </>
  )
  fireEvent.click(screen.getByRole("radio", { name: "B" }))
  expect(screen.getByRole("radio", { name: "B" }).getAttribute("aria-checked")).toBe("true")
  fireEvent.click(screen.getByRole("button", { name: "Bold" }))
  expect(screen.getByRole("button", { name: "Bold" }).getAttribute("aria-pressed")).toBe("true")
  expect(toggleVariants()).toBeTypeOf("string")
})

test("slider retains range thumb and value", () => {
  const { rerender } = render(<Slider defaultValue={[20, 80]} />)
  // jsdom has no layout; Base UI hides the thumb until browser measurement.
  expect(screen.getAllByRole("slider", { hidden: true }).map((node) => node.getAttribute("aria-valuenow"))).toEqual([
    "20",
    "80"
  ])
  rerender(<Slider value={[40]} />)
  expect(screen.getAllByRole("slider", { hidden: true }).length).toBe(1)
})

test("checkbox keeps controlled, indeterminate and disabled behavior", () => {
  const change = vi.fn()
  const { rerender } = render(<Checkbox aria-label="Accept" onCheckedChange={change} />)
  fireEvent.click(screen.getByRole("checkbox"))
  expect(change).toHaveBeenCalledTimes(1)
  expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("true")
  rerender(<Checkbox aria-label="Accept" indeterminate disabled onCheckedChange={change} />)
  expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe("mixed")
  fireEvent.click(screen.getByRole("checkbox"))
  expect(change).toHaveBeenCalledTimes(1)
})

test("switch keeps size, callback class and native form value", () => {
  for (const size of [undefined, "sm"] as const) {
    const { unmount, container } = render(
      <form>
        <Switch aria-label="Enable" size={size} name="enabled" defaultChecked className={() => "caller"} />
      </form>
    )
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("true")
    expect(screen.getByRole("switch").className).toContain("caller")
    expect(new FormData(container.querySelector("form")!).has("enabled")).toBe(true)
    fireEvent.click(screen.getByRole("switch"))
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false")
    unmount()
  }
})
