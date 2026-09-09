import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { UploadList } from "../../internal/pilot/upload-list"
import { UploadPreview } from "../../internal/pilot/upload-preview"
import { UploadViewer } from "../../internal/pilot/upload-viewer"

afterEach(cleanup)
test("upload list forwards per-item action and accepts unrestricted file", async () => {
  const action = vi.fn()
  const change = vi.fn()
  const copy = {
    choose: "Choose",
    remove: (name: string) => `Remove ${name}`,
    preview: (name: string) => `Preview ${name}`,
    size: String,
    rejected: String,
    removed: String,
    selected: String,
    retry: "Retry",
    cancel: "Cancel"
  }
  const { container, rerender } = render(
    <UploadList
      value={[
        {
          id: "a",
          name: "File",
          type: "text/plain",
          size: 1,
          url: "/file",
          description: "Description",
          transfer: { state: "error", label: "Error" }
        }
      ]}
      onValueChange={change}
      onPreview={action}
      onRetry={action}
      onCancel={action}
      copy={copy}>
      Drop
    </UploadList>
  )
  fireEvent.click(screen.getByRole("button", { name: "Preview File" }))
  fireEvent.click(screen.getByRole("button", { name: "Retry" }))
  rerender(
    <UploadList
      value={[
        {
          id: "a",
          name: "File",
          type: "text/plain",
          size: 1,
          url: "/file",
          transfer: { state: "queued", label: "Queued" }
        }
      ]}
      onValueChange={change}
      onCancel={action}
      copy={copy}>
      Drop
    </UploadList>
  )
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
  expect(action).toHaveBeenCalledTimes(3)
  await act(async () => {
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [new File(["a"], "a.txt")] } })
  })
  expect(change.mock.calls.at(-1)?.[0]).toHaveLength(2)
})
test("upload preview MIME and transfer matrix", () => {
  for (const type of ["image/png", "video/mp4", "audio/mpeg", "application/pdf", "text/plain"]) {
    for (const state of ["queued", "uploading", "success", "error", "cancelled"] as const) {
      const action = vi.fn()
      const { unmount } = render(
        <UploadPreview
          name="File"
          type={type}
          description="Description"
          transfer={{ state, label: "State" }}
          thumbnail={type === "image/png" ? { src: "/image.png", alt: "Thumbnail" } : undefined}
          previewAction={{ label: "Preview", onClick: action }}
          removeAction={{ label: "Remove", onClick: action }}
          cancelAction={{ label: "Cancel", onClick: action }}
          retryAction={{ label: "Retry", onClick: action }}
        />
      )
      fireEvent.click(screen.getByRole("button", { name: "Preview" }))
      fireEvent.click(screen.getByRole("button", { name: "Remove" }))
      expect(action).toHaveBeenCalledTimes(2)
      unmount()
    }
  }
})
test("upload viewer MIME fallback and download", () => {
  for (const type of ["video/mp4", "audio/mpeg", "application/pdf", "text/plain"]) {
    const { unmount } = render(
      <UploadViewer
        open
        onOpenChange={vi.fn()}
        source={{ name: "Media", type, url: `https://example.com/${type}`, description: "Description" }}
        closeLabel="Close"
        downloadLabel="Download"
        fallback="Fallback"
      />
    )
    expect(screen.getByRole("link", { name: "Download" })).toBeTruthy()
    const media = document.querySelector("video, audio")
    if (media) {
      fireEvent.error(media)
      expect(screen.getByRole("status").textContent).toBe("Fallback")
    }
    unmount()
  }
})
test("upload list enforces cumulative count and byte limit", async () => {
  const copy = {
    choose: "Choose",
    remove: String,
    preview: String,
    size: String,
    rejected: String,
    removed: String,
    selected: String
  }
  for (const limit of ["count", "size", "accept"] as const) {
    const change = vi.fn()
    const reject = vi.fn()
    const { container, unmount } = render(
      <UploadList
        value={[]}
        onValueChange={change}
        onReject={reject}
        maxCount={limit === "count" ? 1 : undefined}
        maxTotalSize={limit === "size" ? 1 : undefined}
        accept={limit === "accept" ? { "image/png": [".png"] } : undefined}
        copy={copy}>
        Drop
      </UploadList>
    )
    await act(async () => {
      fireEvent.change(container.querySelector('input[type="file"]')!, {
        target: {
          files: [new File(["a"], "a.txt", { type: "text/plain" }), new File(["b"], "b.txt", { type: "text/plain" })]
        }
      })
    })
    expect(reject).toHaveBeenCalledOnce()
    if (limit !== "accept") expect(change.mock.calls[0]?.[0]).toHaveLength(1)
    unmount()
  }
})
test("upload list removal returns focus and emits controlled value", () => {
  const change = vi.fn()
  render(
    <UploadList
      value={[{ id: "a", name: "File", type: "text/plain", size: 1, url: "/file" }]}
      onValueChange={change}
      copy={{
        choose: "Choose",
        remove: (name) => `Remove ${name}`,
        preview: (name) => `Preview ${name}`,
        size: String,
        rejected: (name) => name,
        removed: (name) => name,
        selected: String
      }}>
      Drop
    </UploadList>
  )
  fireEvent.click(screen.getByRole("button", { name: "Remove File" }))
  expect(change).toHaveBeenCalledWith([])
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Choose" }))
})
test("upload viewer rejects unsafe URL and handles failed media", async () => {
  const props = {
    open: true,
    onOpenChange: vi.fn(),
    closeLabel: "Close",
    downloadLabel: "Download",
    fallback: "Unavailable"
  }
  const { rerender } = render(
    <UploadViewer {...props} source={{ name: "Image", type: "image/png", url: "javascript:alert(1)" }} />
  )
  expect(await screen.findByRole("status")).toHaveProperty("textContent", "Unavailable")
  expect(screen.queryByRole("link")).toBeNull()
  rerender(<UploadViewer {...props} source={{ name: "Image", type: "image/png", url: "/image.png" }} />)
  fireEvent.error(screen.getByRole("img"))
  expect(screen.getByRole("status").textContent).toBe("Unavailable")
})
test("upload preview preserves caller transfer and action", () => {
  const retry = vi.fn()
  const { rerender } = render(
    <UploadPreview name="File" transfer={{ state: "uploading", label: "Uploading", progress: 150 }} />
  )
  expect((screen.getByRole("progressbar") as HTMLProgressElement).value).toBe(100)
  rerender(
    <UploadPreview
      name="File"
      transfer={{ state: "error", label: "Failed" }}
      retryAction={{ label: "Retry", onClick: retry }}
    />
  )
  fireEvent.click(screen.getByRole("button", { name: "Retry" }))
  expect(retry).toHaveBeenCalledOnce()
})
