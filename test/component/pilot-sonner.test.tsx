import { act, cleanup, render } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { toast } from "sonner"
import { afterEach, expect, test } from "vitest"

import { Toaster } from "../../app/component/brand/stylex/sonner"
import { Theme } from "../../app/component/brand/stylex/theme"

afterEach(cleanup)

/** Sonner only mounts its themed `<ol data-sonner-toaster>` once a toast is active. */
async function pushToast() {
  await act(async () => {
    toast("Notice")
    await new Promise((resolve) => setTimeout(resolve, 50))
  })
}

test("sonner reads the nearest Bridge Theme mode (DEC-009): light maps to light", async () => {
  const { container } = render(
    <Theme mode="light">
      <Toaster />
    </Theme>
  )
  await pushToast()
  expect(container.querySelector('[data-sonner-toaster][data-sonner-theme="light"]')).not.toBeNull()
})

test.each(["dark", "cue", "future"] as const)(
  "sonner reads the nearest Bridge Theme mode (DEC-009): %s maps to dark",
  async (mode) => {
    const { container } = render(
      <Theme mode={mode}>
        <Toaster />
      </Theme>
    )
    await pushToast()
    expect(container.querySelector('[data-sonner-toaster][data-sonner-theme="dark"]')).not.toBeNull()
  }
)

test("sonner without a Bridge Theme ancestor defaults to the light theme mode", async () => {
  const { container } = render(<Toaster />)
  await pushToast()
  expect(container.querySelector('[data-sonner-toaster][data-sonner-theme="light"]')).not.toBeNull()
})

test("sonner retains an explicit caller theme override and container class", async () => {
  const { container } = render(
    <Theme mode="light">
      <Toaster theme="dark" className="caller" />
    </Theme>
  )
  await pushToast()
  const node = container.querySelector('[data-sonner-toaster][data-sonner-theme="dark"]')
  expect(node).not.toBeNull()
  expect(node?.className).toContain("caller")
})

test("sonner renders outside a Theme boundary sentinel without inheriting its mode", async () => {
  const { container } = render(
    <>
      <Theme mode="cue" data-testid="scoped" />
      <Toaster />
    </>
  )
  await pushToast()
  const scoped = container.querySelector('[data-testid="scoped"]')
  const toaster = container.querySelector("[data-sonner-toaster]")
  expect(scoped?.getAttribute("data-pilot-theme")).toBe("cue")
  expect(toaster?.getAttribute("data-sonner-theme")).toBe("light")
})

test("sonner produces server-rendered markup for every Bridge Theme mode", () => {
  for (const mode of ["light", "dark", "cue", "future"] as const) {
    expect(
      renderToString(
        <Theme mode={mode}>
          <Toaster />
        </Theme>
      )
    ).toBeTypeOf("string")
  }
})
