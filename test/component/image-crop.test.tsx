import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { ImageCrop } from "../../app/component/brand/image-crop"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
test("crop applies output separately and closes bitmap", async () => {
  const close = vi.fn()
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue({ width: 400, height: 200, close }))
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn()
  } as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((callback) =>
    callback(new Blob(["crop"], { type: "image/png" }))
  )
  const apply = vi.fn()
  const view = render(
    <ImageCrop
      file={new File(["image"], "photo.png")}
      onApply={apply}
      copy={{
        preview: "Crop preview",
        zoom: "Zoom",
        horizontal: "Horizontal",
        vertical: "Vertical",
        rotate: "Rotate",
        ratio: "Ratio",
        square: "Square",
        original: "Original",
        banner: "Banner",
        apply: "Apply crop",
        busy: "Working",
        error: "Failed"
      }}
    />
  )
  await waitFor(() => expect(screen.getByRole("button", { name: "Apply crop" }).hasAttribute("disabled")).toBe(false))
  fireEvent.change(screen.getByLabelText("Zoom"), { target: { value: "2" } })
  fireEvent.click(screen.getByRole("button", { name: "Rotate" }))
  fireEvent.change(screen.getByLabelText("Ratio"), { target: { value: "banner" } })
  fireEvent.click(screen.getByRole("button", { name: "Apply crop" }))
  await waitFor(() => expect(apply).toHaveBeenCalledOnce())
  expect(apply.mock.calls[0]?.[0].type).toBe("image/png")
  view.unmount()
  expect(close).toHaveBeenCalledOnce()
})

const copy = {
  preview: "Crop preview",
  zoom: "Zoom",
  horizontal: "Horizontal",
  vertical: "Vertical",
  rotate: "Rotate",
  ratio: "Ratio",
  square: "Square",
  original: "Original",
  banner: "Banner",
  apply: "Apply crop",
  busy: "Working",
  error: "Failed"
}

test("crop drag and keyboard position share bounded geometry", async () => {
  vi.stubGlobal("PointerEvent", MouseEvent)
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue({ width: 200, height: 400, close: vi.fn() }))
  const draw = vi.fn()
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: draw
  } as unknown as CanvasRenderingContext2D)
  const view = render(<ImageCrop file={new File(["image"], "photo")} onApply={vi.fn()} copy={copy} />)
  await waitFor(() => expect(draw).toHaveBeenCalled())
  const canvas = screen.getByRole("img")
  Object.defineProperty(canvas, "setPointerCapture", { value: vi.fn() })
  fireEvent.pointerMove(canvas, { clientX: 10, clientY: 10 })
  fireEvent.pointerDown(canvas, { clientX: 100, clientY: 100 })
  fireEvent.pointerMove(canvas, { clientX: 110, clientY: 90 })
  expect((screen.getByLabelText("Horizontal") as HTMLInputElement).value).toBe("0")
  expect((screen.getByLabelText("Vertical") as HTMLInputElement).value).toBe("1")
  fireEvent.pointerUp(canvas)
  fireEvent.pointerCancel(canvas)
  fireEvent.change(screen.getByLabelText("Horizontal"), { target: { value: "0.25" } })
  fireEvent.change(screen.getByLabelText("Vertical"), { target: { value: "0.75" } })
  fireEvent.change(screen.getByLabelText("Ratio"), { target: { value: "original" } })
  expect((canvas as HTMLCanvasElement).height).toBe(1536)
  fireEvent.click(screen.getByRole("button", { name: "Rotate" }))
  expect((canvas as HTMLCanvasElement).height).toBe(384)
  view.unmount()
})

test("crop reports decoding and canvas failure and disposes late bitmap", async () => {
  const decode = vi.fn().mockRejectedValue(new Error("Bad image"))
  vi.stubGlobal("createImageBitmap", decode)
  const view = render(<ImageCrop file={new File([], "bad")} onApply={vi.fn()} copy={copy} />)
  await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Failed"))
  view.unmount()
  const close = vi.fn()
  decode.mockResolvedValue({ width: 10, height: 10, close })
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
  const missing = render(<ImageCrop file={new File([], "no-context")} onApply={vi.fn()} copy={copy} />)
  await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Failed"))
  missing.unmount()
  let resolve!: (value: unknown) => void
  decode.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  const late = render(<ImageCrop file={new File([], "late")} onApply={vi.fn()} copy={copy} />)
  late.unmount()
  resolve({ width: 10, height: 10, close })
  await waitFor(() => expect(close).toHaveBeenCalledTimes(2))
  let reject!: (reason: Error) => void
  decode.mockImplementation(
    () =>
      new Promise((_, fail) => {
        reject = fail
      })
  )
  const rejected = render(<ImageCrop file={new File([], "late-error")} onApply={vi.fn()} copy={copy} />)
  rejected.unmount()
  reject(new Error("Late error"))
})

test("crop handles failed encoding and disables editing during apply", async () => {
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue({ width: 10, height: 10, close: vi.fn() }))
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    clearRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn()
  } as unknown as CanvasRenderingContext2D)
  let encode!: BlobCallback
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((callback) => {
    encode = callback
  })
  render(<ImageCrop file={new File([], "photo.png")} onApply={vi.fn()} copy={copy} />)
  await waitFor(() => expect(screen.getByRole("button", { name: "Apply crop" }).hasAttribute("disabled")).toBe(false))
  const canvas = screen.getByRole("img")
  Object.defineProperty(canvas, "setPointerCapture", { value: vi.fn() })
  fireEvent.pointerDown(canvas, { clientX: 0, clientY: 0 })
  fireEvent.click(screen.getByRole("button", { name: "Apply crop" }))
  expect(screen.getByRole("button", { name: "Working" }).hasAttribute("disabled")).toBe(true)
  fireEvent.pointerDown(canvas)
  fireEvent.pointerMove(canvas)
  encode(null)
  await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Failed"))
})
