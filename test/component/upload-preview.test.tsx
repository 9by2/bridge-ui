import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { UploadPreview } from "../../app/component/brand/upload-preview"

afterEach(cleanup)

test("preview presents file type and delegates action", () => {
  for (const type of ["image/png", "video/mp4", "audio/mpeg", "application/pdf", ""]) {
    const preview = vi.fn()
    const remove = vi.fn()
    const view = render(
      <UploadPreview
        name="report"
        type={type}
        description="12 KB"
        previewAction={{ label: "Preview report", onClick: preview }}
        removeAction={{ label: "Remove report", onClick: remove }}
      />
    )
    expect(screen.getByText("report")).toBeDefined()
    expect(screen.getByText("12 KB")).toBeDefined()
    expect(view.container.querySelector('[data-slot="upload-preview"] svg')).not.toBeNull()
    fireEvent.click(screen.getByRole("button", { name: "Preview report" }))
    fireEvent.click(screen.getByRole("button", { name: "Remove report" }))
    expect(preview).toHaveBeenCalledOnce()
    expect(remove).toHaveBeenCalledOnce()
    view.unmount()
  }
})

test("preview supports thumbnail, absent action and disabled action", () => {
  const view = render(<UploadPreview name="Photo" thumbnail={{ src: "photo.png", alt: "Selected photo" }} />)
  expect(screen.getByAltText("Selected photo").getAttribute("src")).toBe("photo.png")
  expect(screen.queryByRole("button")).toBeNull()
  const action = vi.fn()
  view.rerender(
    <UploadPreview
      name="Photo"
      disabled
      previewAction={{ label: "Preview", onClick: action }}
      removeAction={{ label: "Remove", onClick: action }}
    />
  )
  fireEvent.click(screen.getByRole("button", { name: "Preview" }))
  fireEvent.click(screen.getByRole("button", { name: "Remove" }))
  expect(action).not.toHaveBeenCalled()
})
