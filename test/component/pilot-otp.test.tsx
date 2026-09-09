import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { OTPInputContext } from "input-otp"
import { afterEach, expect, test, vi } from "vitest"

import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "../../internal/pilot/input-otp"

afterEach(cleanup)
test("otp retains engine input and controlled callback", () => {
  const change = vi.fn()
  render(
    <InputOTP maxLength={2} value="1" onChange={change} aria-label="Code">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPSeparator />
    </InputOTP>
  )
  fireEvent.input(screen.getByRole("textbox"), { target: { value: "12" } })
  expect(change).toHaveBeenCalledWith("12")
})
test("otp slot consumes original context and handles missing index", () => {
  const { container } = render(
    <OTPInputContext
      value={{
        slots: [{ char: "3", placeholderChar: null, hasFakeCaret: true, isActive: true }],
        isFocused: true,
        isHovering: false
      }}>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={2} />
    </OTPInputContext>
  )
  expect(screen.getByText("3").getAttribute("data-active")).toBe("true")
  expect(container.querySelectorAll('[data-slot="input-otp-slot"]')).toHaveLength(2)
})
