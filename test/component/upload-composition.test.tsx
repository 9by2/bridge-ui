import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { UploadPreview } from "../../app/component/brand/upload-preview"
import { UploadViewer } from "../../app/component/brand/upload-viewer"

afterEach(cleanup)

test("transfer progress and retry/cancel are caller controlled", () => {
  const action = vi.fn()
  render(
    <UploadPreview
      name="Report"
      transfer={{ state: "uploading", label: "Sending", progress: 42 }}
      retryAction={{ label: "Retry", onClick: action }}
      cancelAction={{ label: "Cancel", onClick: action }}
    />
  )
  expect(screen.getByRole("progressbar").getAttribute("value")).toBe("42")
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
  expect(action).toHaveBeenCalledOnce()
})

test("viewer selects media renderer and preserves fallback download", () => {
  for (const [type, tag] of [
    ["image/png", "img"],
    ["video/mp4", "video"],
    ["audio/mpeg", "audio"],
    ["application/pdf", "iframe"],
    ["application/zip", "a"]
  ]) {
    const view = render(
      <UploadViewer
        open
        onOpenChange={() => {}}
        source={{ name: "Attachment", type: type!, url: "https://example.com/file" }}
        closeLabel="Close preview"
        downloadLabel="Download"
        fallback="Preview unavailable"
      />
    )
    expect(document.querySelector(tag!)).not.toBeNull()
    expect(screen.getByRole("link", { name: "Download" }).getAttribute("href")).toBe("https://example.com/file")
    view.unmount()
  }
})

test("viewer handles media failure and unsafe URL without linking it", () => {
  for (const [type, tag] of [
    ["image/png", "img"],
    ["video/mp4", "video"],
    ["audio/mpeg", "audio"]
  ]) {
    const view = render(
      <UploadViewer
        open
        onOpenChange={() => {}}
        source={{ name: "Broken", type: type!, url: "/broken", description: "Metadata" }}
        closeLabel="Close"
        downloadLabel="Download"
        fallback="Unavailable"
      />
    )
    fireEvent.error(document.querySelector(tag!)!)
    expect(screen.getByRole("status").textContent).toBe("Unavailable")
    view.unmount()
  }
  render(
    <UploadViewer
      open
      onOpenChange={() => {}}
      source={{ name: "Unsafe", type: "text/plain", url: "javascript:alert(1)" }}
      closeLabel="Close"
      downloadLabel="Download"
      fallback="Unavailable"
    />
  )
  expect(screen.queryByRole("link")).toBeNull()
})

test("transfer state supports determinate, indeterminate and terminal feedback", () => {
  const action = vi.fn()
  for (const state of ["queued", "uploading", "success", "error", "cancelled"] as const) {
    const view = render(
      <UploadPreview
        name="Report"
        transfer={{ state, label: state }}
        retryAction={{ label: "Retry", onClick: action }}
        cancelAction={{ label: "Cancel", onClick: action }}
      />
    )
    if (state === "uploading") expect(screen.getByRole("progressbar").hasAttribute("value")).toBe(false)
    if (state === "error" || state === "cancelled") fireEvent.click(screen.getByRole("button", { name: "Retry" }))
    view.unmount()
    const empty = render(<UploadPreview name="Report" transfer={{ state, label: state, progress: 120 }} />)
    expect(screen.queryByRole("button")).toBeNull()
    empty.unmount()
  }
  expect(action).toHaveBeenCalledTimes(2)
})
