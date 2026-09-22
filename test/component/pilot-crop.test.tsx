import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { ImageCropEditor } from "../../app/component/brand/stylex/image-crop"

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
test("crop draws, rotates, encodes and closes bitmap", async () => {
  const copy = {
    preview: "Preview",
    zoom: "Zoom",
    horizontal: "Horizontal",
    vertical: "Vertical",
    rotate: "Rotate",
    ratio: "Ratio",
    square: "Square",
    original: "Original",
    banner: "Banner",
    apply: "Apply",
    busy: "Busy",
    error: "Error"
  }
  const bitmap = { width: 100, height: 50, close: vi.fn() }
  const context = {
    clearRect: vi.fn(),
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn(),
    restore: vi.fn()
  }
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue(bitmap))
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((callback) =>
    callback(new Blob(["png"], { type: "image/png" }))
  )
  const pendingApply = Promise.withResolvers<void>()
  const apply = vi.fn((_file: File) => pendingApply.promise)
  const { unmount } = render(<ImageCropEditor file={new File(["image"], "image.png")} onApply={apply} copy={copy} />)
  await waitFor(() => expect(context.drawImage).toHaveBeenCalled())
  const canvas = screen.getByRole("img") as HTMLCanvasElement
  canvas.setPointerCapture = vi.fn()
  vi.stubGlobal("PointerEvent", MouseEvent)
  fireEvent.pointerMove(canvas, { clientX: 3, clientY: 4 })
  fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 })
  fireEvent.pointerMove(canvas, { clientX: 20, clientY: 30 })
  fireEvent.pointerUp(canvas)
  fireEvent.pointerCancel(canvas)
  for (const [name, value] of [
    ["Zoom", "2"],
    ["Horizontal", "0.2"],
    ["Vertical", "0.7"],
    ["Ratio", "original"],
    ["Ratio", "banner"]
  ])
    fireEvent.change(screen.getByLabelText(name!), { target: { value } })
  fireEvent.click(screen.getByRole("button", { name: "Rotate" }))
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Apply" }))
  })
  expect(apply.mock.calls[0]?.[0].name).toBe("image-cropped.png")
  fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10 })
  fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 })
  await act(async () => {
    pendingApply.resolve()
  })
  expect((screen.getByRole("img") as HTMLCanvasElement).height).toBe(256)
  unmount()
  expect(bitmap.close).toHaveBeenCalledOnce()
})
test("crop disposes late decode and handles missing context or encoding", async () => {
  const copy = {
    preview: "Preview",
    zoom: "Zoom",
    horizontal: "Horizontal",
    vertical: "Vertical",
    rotate: "Rotate",
    ratio: "Ratio",
    square: "Square",
    original: "Original",
    banner: "Banner",
    apply: "Apply",
    busy: "Busy",
    error: "Error"
  }
  const pending = Promise.withResolvers<ImageBitmap>()
  vi.stubGlobal(
    "createImageBitmap",
    vi.fn(() => pending.promise)
  )
  const first = render(<ImageCropEditor file={new File(["a"], "a.png")} onApply={vi.fn()} copy={copy} />)
  first.unmount()
  const close = vi.fn()
  await act(async () => {
    pending.resolve({ width: 10, height: 20, close } as unknown as ImageBitmap)
  })
  expect(close).toHaveBeenCalledOnce()
  vi.stubGlobal("createImageBitmap", vi.fn().mockResolvedValue({ width: 10, height: 20, close: vi.fn() }))
  const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
  const second = render(<ImageCropEditor file={new File(["b"], "b.png")} onApply={vi.fn()} copy={copy} />)
  await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Error"))
  second.unmount()
  getContext.mockReturnValue({
    clearRect: vi.fn(),
    save: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn(),
    restore: vi.fn()
  } as unknown as CanvasRenderingContext2D)
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation((callback) => callback(null))
  render(<ImageCropEditor file={new File(["c"], "c.png")} onApply={vi.fn()} copy={copy} />)
  await waitFor(() => expect((screen.getByRole("button", { name: "Apply" }) as HTMLButtonElement).disabled).toBe(false))
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Apply" }))
  })
  expect(screen.getByRole("status").textContent).toBe("Error")
})
test("crop ignores late rejection after disposal", async () => {
  const pending = Promise.withResolvers<ImageBitmap>()
  vi.stubGlobal("createImageBitmap", () => pending.promise)
  const copy = {
    preview: "Preview",
    zoom: "Zoom",
    horizontal: "Horizontal",
    vertical: "Vertical",
    rotate: "Rotate",
    ratio: "Ratio",
    square: "Square",
    original: "Original",
    banner: "Banner",
    apply: "Apply",
    busy: "Busy",
    error: "Error"
  }
  const { unmount } = render(<ImageCropEditor file={new File(["a"], "a.png")} onApply={vi.fn()} copy={copy} />)
  unmount()
  await act(async () => {
    pending.reject(new Error("late"))
  })
})
test("crop reports bitmap decode error", async () => {
  vi.stubGlobal("createImageBitmap", vi.fn().mockRejectedValue(new Error("decode")))
  render(
    <ImageCropEditor
      file={new File(["bad"], "bad.png")}
      onApply={vi.fn()}
      copy={{
        preview: "Preview",
        zoom: "Zoom",
        horizontal: "Horizontal",
        vertical: "Vertical",
        rotate: "Rotate",
        ratio: "Ratio",
        square: "Square",
        original: "Original",
        banner: "Banner",
        apply: "Apply",
        busy: "Busy",
        error: "Error"
      }}
    />
  )
  await waitFor(() => expect(screen.getByRole("status").textContent).toBe("Error"))
})
