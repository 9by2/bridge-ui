import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { UploadList } from "../../app/component/brand/upload-list"

afterEach(cleanup)
const copy = {
  choose: "Choose",
  remove: (name: string) => `Remove ${name}`,
  preview: (name: string) => `Preview ${name}`,
  size: (size: number) => `${size} bytes`,
  rejected: (name: string) => `Rejected ${name}`,
  removed: (name: string) => `Removed ${name}`,
  selected: (count: number) => `Selected ${count}`
}

test("remote metadata remains controlled and removal returns focus to drop target", () => {
  const change = vi.fn()
  const preview = vi.fn()
  render(
    <UploadList
      value={[{ id: "remote", name: "Saved.pdf", type: "application/pdf", size: 20, url: "/saved.pdf" }]}
      onValueChange={change}
      onPreview={preview}
      copy={copy}>
      Choose file
    </UploadList>
  )
  fireEvent.click(screen.getByRole("button", { name: "Preview Saved.pdf" }))
  expect(preview.mock.calls[0]?.[0].url).toBe("/saved.pdf")
  fireEvent.click(screen.getByRole("button", { name: "Remove Saved.pdf" }))
  expect(change).toHaveBeenCalledWith([])
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Choose" }))
  expect(screen.getByRole("status").textContent).toBe("Removed Saved.pdf")
})

test("cumulative count and byte limit reject per file without losing existing attachment", async () => {
  const change = vi.fn()
  const reject = vi.fn()
  const view = render(
    <UploadList value={[]} onValueChange={change} onReject={reject} maxCount={1} maxTotalSize={5} copy={copy}>
      Choose
    </UploadList>
  )
  fireEvent.change(view.container.querySelector('input[type="file"]')!, {
    target: { files: [new File(["123"], "a.txt"), new File(["123"], "b.txt")] }
  })
  await waitFor(() => expect(change).toHaveBeenCalledOnce())
  expect(change.mock.calls[0]?.[0]).toHaveLength(1)
  expect(reject.mock.calls[0]?.[0][0].errors[0].code).toBe("too-many-files")
  view.rerender(
    <UploadList value={[]} onValueChange={change} onReject={reject} maxTotalSize={1} copy={copy}>
      Choose
    </UploadList>
  )
  fireEvent.change(view.container.querySelector('input[type="file"]')!, {
    target: { files: [new File(["123"], "large.txt")] }
  })
  await waitFor(() => expect(reject).toHaveBeenCalledTimes(2))
  expect(reject.mock.calls[1]?.[0][0].errors[0].code).toBe("total-size-exceeded")
})

test("list delegates retry and cancel and reports native file rejection", async () => {
  const retry = vi.fn()
  const cancel = vi.fn()
  const change = vi.fn()
  const value = [
    {
      id: "a",
      name: "a",
      type: "text/plain",
      size: 1,
      file: new File(["a"], "a"),
      description: "Saved",
      transfer: { state: "error" as const, label: "Failed" }
    }
  ]
  const view = render(
    <UploadList
      value={value}
      onValueChange={change}
      onRetry={retry}
      onCancel={cancel}
      copy={{ ...copy, retry: "Retry", cancel: "Cancel" }}>
      Choose
    </UploadList>
  )
  fireEvent.click(screen.getByRole("button", { name: "Retry" }))
  expect(retry).toHaveBeenCalledWith(value[0])
  view.rerender(
    <UploadList
      value={[{ ...value[0]!, transfer: { state: "queued", label: "Queued" } }]}
      onValueChange={change}
      onRetry={retry}
      onCancel={cancel}
      maxSize={1}
      copy={{ ...copy, retry: "Retry", cancel: "Cancel" }}>
      Choose
    </UploadList>
  )
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }))
  expect(cancel).toHaveBeenCalledOnce()
  fireEvent.change(view.container.querySelector('input[type="file"]')!, {
    target: { files: [new File(["too large"], "large.txt")] }
  })
  await waitFor(() => expect(screen.getByText(/Rejected large.txt/)).toBeDefined())
  expect(change).not.toHaveBeenCalled()
  view.rerender(
    <UploadList value={value} onValueChange={change} onRetry={retry} onCancel={cancel} copy={copy}>
      Choose
    </UploadList>
  )
  expect(screen.queryByRole("button", { name: "Retry" })).toBeNull()
})

test("accepted selection retains File identity", async () => {
  const change = vi.fn()
  const view = render(
    <UploadList value={[]} onValueChange={change} copy={copy}>
      Choose
    </UploadList>
  )
  const file = new File(["a"], "a.txt")
  fireEvent.change(view.container.querySelector('input[type="file"]')!, { target: { files: [file] } })
  await waitFor(() => expect(change).toHaveBeenCalledOnce())
  expect(change.mock.calls[0]?.[0][0].file).toBe(file)
})
