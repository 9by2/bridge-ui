import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, expect, test, vi } from "vitest"

import { Button, buttonVariants } from "../../app/component/brand/stylex/button"

afterEach(cleanup)

test("pilot button retains expanded and popup attribute across variant", () => {
  for (const variant of ["default", "outline", "ghost"] as const) {
    for (const expanded of [true, "true", false] as const) {
      const { unmount } = render(
        <Button variant={variant} aria-expanded={expanded} aria-haspopup="dialog">
          Popup
        </Button>
      )
      expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(String(expanded))
      expect(screen.getByRole("button").getAttribute("aria-haspopup")).toBe("dialog")
      unmount()
    }
  }
})

test("pilot button preserves ref, native form, caller style and event", () => {
  const ref = createRef<HTMLButtonElement>()
  const submit = vi.fn((event) => event.preventDefault())
  const click = vi.fn()
  render(
    <form onSubmit={submit}>
      <Button ref={ref} type="submit" className="caller" style={{ width: 137 }} onClick={click}>
        Save
      </Button>
    </form>
  )
  fireEvent.click(screen.getByRole("button", { name: "Save" }))
  expect(click).toHaveBeenCalledTimes(1)
  expect(submit).toHaveBeenCalledTimes(1)
  expect(ref.current?.style.width).toBe("137px")
  expect(ref.current?.className).toContain("caller")
  expect(ref.current?.dataset.slot).toBe("button")
})

test("pilot button preserves render composition, disabled behavior and string helper", () => {
  const click = vi.fn()
  const { rerender } = render(
    <Button disabled onClick={click}>
      Disabled
    </Button>
  )
  fireEvent.click(screen.getByRole("button"))
  expect(click).not.toHaveBeenCalled()
  rerender(
    <Button render={<a href="/destination" />} nativeButton={false}>
      Visit
    </Button>
  )
  expect(screen.getByRole("button").getAttribute("href")).toBe("/destination")
  for (const variant of ["default", "outline", "secondary", "ghost", "destructive", "link"] as const) {
    for (const size of ["default", "xs", "sm", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"] as const) {
      expect(typeof buttonVariants({ variant, size })).toBe("string")
      expect(buttonVariants({ variant, size, className: "caller" })).toContain("caller")
    }
  }
})

test("pilot button preserves callback class, null variant and invalid attribute", () => {
  const { rerender } = render(
    <Button variant={null} size={null} aria-invalid className={() => "state-class"}>
      Invalid
    </Button>
  )
  expect(screen.getByRole("button").className).toContain("state-class")
  expect(screen.getByRole("button").getAttribute("aria-invalid")).toBe("true")
  expect(buttonVariants({ variant: null, size: null, class: "extra" })).toContain("extra")
  rerender(<Button aria-invalid="false">Valid</Button>)
  expect(screen.getByRole("button").getAttribute("aria-invalid")).toBe("false")
})
