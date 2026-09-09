import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test, vi } from "vitest"

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../../internal/pilot/carousel"

const engine = vi.hoisted(() => ({
  api: {
    canScrollPrev: vi.fn(() => true),
    canScrollNext: vi.fn(() => true),
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  },
  ready: true
}))
vi.mock("embla-carousel-react", () => ({ default: () => [() => {}, engine.ready ? engine.api : undefined] }))

afterEach(cleanup)
test("carousel subscribes to engine and disposes both event handlers", () => {
  const setApi = vi.fn()
  const { unmount } = render(
    <Carousel setApi={setApi}>
      <CarouselContent>
        <CarouselItem>One</CarouselItem>
      </CarouselContent>
      <CarouselPrevious className={() => "previous"} />
      <CarouselNext className={() => "next"} />
    </Carousel>
  )
  expect(setApi).toHaveBeenCalledWith(engine.api)
  fireEvent.click(screen.getByRole("button", { name: "Next slide" }))
  fireEvent.click(screen.getByRole("button", { name: "Previous slide" }))
  fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowLeft" })
  fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowRight" })
  fireEvent.keyDown(screen.getByRole("region"), { key: "Enter" })
  expect(engine.api.scrollNext).toHaveBeenCalledTimes(2)
  expect(engine.api.scrollPrev).toHaveBeenCalledTimes(2)
  const handler = engine.api.on.mock.calls.find((call) => call[0] === "reInit")?.[1]
  act(() => {
    handler?.()
  })
  unmount()
  expect(engine.api.off).toHaveBeenCalledWith("reInit", handler)
  expect(engine.api.off).toHaveBeenCalledWith("select", handler)
})
test("carousel handles engine not yet ready", () => {
  engine.ready = false
  const { unmount } = render(
    <Carousel>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
  fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowLeft" })
  fireEvent.keyDown(screen.getByRole("region"), { key: "ArrowRight" })
  unmount()
  engine.ready = true
})
test("carousel server composition and provider diagnostic", () => {
  expect(() => render(<CarouselItem />)).toThrow("useCarousel must be used within a <Carousel />")
  for (const orientation of ["horizontal", "vertical"] as const) {
    const html = renderToString(
      <Carousel orientation={orientation}>
        <CarouselContent>
          <CarouselItem>One</CarouselItem>
          <CarouselItem>Two</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
    expect(html).toContain('aria-roledescription="carousel"')
    expect(html).toContain('aria-roledescription="slide"')
  }
})
