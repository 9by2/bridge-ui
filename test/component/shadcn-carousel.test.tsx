import { cleanup, render } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { Carousel } from "../../app/component/shadcn/carousel"

const engine = vi.hoisted(() => ({
  api: {
    canScrollPrev: vi.fn(() => false),
    canScrollNext: vi.fn(() => false),
    on: vi.fn(),
    off: vi.fn()
  }
}))

vi.mock("embla-carousel-react", () => ({ default: () => [() => {}, engine.api] }))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

test("generated carousel releases each engine subscription on unmount", () => {
  const { unmount } = render(<Carousel />)
  const reInit = engine.api.on.mock.calls.find(([event]) => event === "reInit")?.[1]
  const select = engine.api.on.mock.calls.find(([event]) => event === "select")?.[1]

  expect(reInit).toBeDefined()
  expect(select).toBeDefined()
  unmount()

  expect(engine.api.off).toHaveBeenCalledWith("reInit", reInit)
  expect(engine.api.off).toHaveBeenCalledWith("select", select)
})
