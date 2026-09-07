import { act, renderHook } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { useIsMobile } from "../../app/hook/use-mobile"

afterEach(() => vi.unstubAllGlobals())

test("mobile hook follows breakpoint change and removes its listener", () => {
  const media = new EventTarget()
  const add = vi.spyOn(media, "addEventListener")
  const remove = vi.spyOn(media, "removeEventListener")
  const matchMedia = vi.fn(() => media)
  vi.stubGlobal("matchMedia", matchMedia)
  vi.stubGlobal("innerWidth", 767)
  const { result, unmount } = renderHook(() => useIsMobile())
  expect(result.current).toBe(true)
  expect(matchMedia).toHaveBeenCalledWith("(max-width: 767px)")
  act(() => {
    vi.stubGlobal("innerWidth", 768)
    media.dispatchEvent(new Event("change"))
  })
  expect(result.current).toBe(false)
  act(() => {
    vi.stubGlobal("innerWidth", 390)
    media.dispatchEvent(new Event("change"))
  })
  expect(result.current).toBe(true)
  unmount()
  expect(add).toHaveBeenCalledOnce()
  expect(remove).toHaveBeenCalledWith("change", add.mock.calls[0]?.[1])
})
