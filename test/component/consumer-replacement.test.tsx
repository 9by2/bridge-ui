import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { afterEach, expect, test, vi } from "vitest"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxValue
} from "../../app/component/brand/stylex/combobox"
import { UploadList, UploadListPreview, type UploadAttachment } from "../../app/component/brand/stylex/upload-list"
import { UploadViewer, UploadViewerStatus } from "../../app/component/brand/stylex/upload-viewer"

afterEach(cleanup)

// G5: a translated, per-chip remove name lets the consumer use ComboboxChips accessibly.
test("chip remove control is named per chip and removes only that chip", () => {
  const change = vi.fn()
  function Example() {
    const [value, setValue] = useState(["Alpha", "Beta"])
    return (
      <Combobox
        multiple
        items={["Alpha", "Beta"]}
        value={value}
        onValueChange={(next: string[]) => {
          change(next)
          setValue(next)
        }}>
        <ComboboxChips>
          <ComboboxValue>
            {(selected: string[]) =>
              selected.map((item) => (
                <ComboboxChip key={item} removeLabel={`Remove ${item}`}>
                  {item}
                </ComboboxChip>
              ))
            }
          </ComboboxValue>
          <ComboboxChipsInput aria-label="Tag" />
        </ComboboxChips>
      </Combobox>
    )
  }
  render(<Example />)
  fireEvent.click(screen.getByRole("button", { name: "Remove Alpha" }))
  expect(change).toHaveBeenLastCalledWith(["Beta"])
  expect(screen.queryByRole("button", { name: "Remove Alpha" })).toBeNull()
  expect(screen.getByRole("button", { name: "Remove Beta" })).toBeTruthy()
})

test("chip without remove label renders no unnamed remove control", () => {
  render(
    <Combobox multiple items={["Alpha"]} defaultValue={["Alpha"]}>
      <ComboboxChips>
        <ComboboxValue>
          {(selected: string[]) => selected.map((item) => <ComboboxChip key={item}>{item}</ComboboxChip>)}
        </ComboboxValue>
        <ComboboxChipsInput aria-label="Tag" />
      </ComboboxChips>
    </Combobox>
  )
  expect(screen.getByText("Alpha")).toBeTruthy()
  expect(screen.queryByRole("button")).toBeNull()
})

const viewer = {
  open: true,
  onOpenChange: () => {},
  closeLabel: "Close",
  downloadLabel: "Download",
  fallback: "Preview unavailable"
}

// G1: the consumer fetches the blob; the viewer must present loading before a URL exists.
test("viewer loading without URL announces status and renders no media or link", () => {
  render(
    <UploadViewer
      {...viewer}
      status={UploadViewerStatus.loading}
      statusLabel="Loading file"
      source={{ name: "Contract", type: "application/pdf" }}
      action={<button type="button">Open in new tab</button>}
    />
  )
  expect(screen.getByRole("status").textContent).toBe("Loading file")
  expect(document.querySelector("iframe, img")).toBeNull()
  expect(screen.queryByRole("link")).toBeNull()
  expect(screen.queryByRole("button", { name: "Open in new tab" })).toBeNull()
  expect(screen.getByRole("button", { name: "Close" })).toBeTruthy()
})

test("viewer ready PDF shows iframe, download and action without failure copy", () => {
  const { rerender } = render(
    <UploadViewer
      {...viewer}
      status={UploadViewerStatus.loading}
      statusLabel="Loading file"
      source={{ name: "Contract", type: "application/pdf" }}
    />
  )
  rerender(
    <UploadViewer
      {...viewer}
      status={UploadViewerStatus.ready}
      source={{ name: "Contract", type: "application/pdf", url: "blob:https://app/contract" }}
      action={<button type="button">Open in new tab</button>}
    />
  )
  expect(document.querySelector("iframe")).not.toBeNull()
  expect(screen.getByRole("link", { name: "Download" }).getAttribute("href")).toBe("blob:https://app/contract")
  expect(screen.getByRole("button", { name: "Open in new tab" })).toBeTruthy()
  expect(screen.queryByText("Preview unavailable")).toBeNull()
})

test("viewer error status announces fallback alert without media, link or action", () => {
  render(
    <UploadViewer
      {...viewer}
      status={UploadViewerStatus.error}
      source={{ name: "Contract", type: "application/pdf", url: "/contract.pdf" }}
      action={<button type="button">Open in new tab</button>}
    />
  )
  expect(screen.getByRole("alert").textContent).toBe("Preview unavailable")
  expect(document.querySelector("iframe")).toBeNull()
  expect(screen.queryByRole("link")).toBeNull()
  expect(screen.queryByRole("button", { name: "Open in new tab" })).toBeNull()
})

test("viewer media failure hides download and action, and a new URL clears the failure", () => {
  const action = <button type="button">Open in new tab</button>
  const { rerender } = render(
    <UploadViewer {...viewer} source={{ name: "Photo", type: "image/png", url: "/broken.png" }} action={action} />
  )
  fireEvent.error(screen.getByRole("img"))
  expect(screen.getByRole("status").textContent).toBe("Preview unavailable")
  expect(screen.queryByRole("link")).toBeNull()
  expect(screen.queryByRole("button", { name: "Open in new tab" })).toBeNull()
  rerender(
    <UploadViewer {...viewer} source={{ name: "Photo", type: "image/png", url: "/photo.png" }} action={action} />
  )
  expect(screen.getByRole("img")).toBeTruthy()
  expect(screen.getByRole("link", { name: "Download" })).toBeTruthy()
})

test("viewer ready without safe URL renders fallback and no package link or action", () => {
  for (const url of [undefined, "javascript:alert(1)"]) {
    const view = render(
      <UploadViewer
        {...viewer}
        source={{ name: "File", type: "image/png", url }}
        action={<button type="button">Open in new tab</button>}
      />
    )
    expect(screen.getByRole("status").textContent).toBe("Preview unavailable")
    expect(screen.queryByRole("link")).toBeNull()
    expect(screen.queryByRole("button", { name: "Open in new tab" })).toBeNull()
    view.unmount()
  }
})

const copy = {
  choose: "Choose file",
  remove: (name: string) => `Remove ${name}`,
  preview: (name: string) => `Preview ${name}`,
  size: (size: number) => `${size} bytes`,
  rejected: (name: string) => `Rejected ${name}`,
  removed: (name: string) => `Removed ${name}`,
  selected: (count: number) => `Selected ${count}`
}
const saved: UploadAttachment = { id: "a", name: "photo.png", type: "image/png", size: 3, url: "/photo.png" }

// G2: CMS/media sites own their item presentation but still need validated selection.
test("preview none hides default items while selection and callbacks still run", async () => {
  const change = vi.fn()
  const { container } = render(
    <UploadList value={[saved]} onValueChange={change} preview={UploadListPreview.none} copy={copy}>
      Drop media
    </UploadList>
  )
  expect(screen.queryByRole("button", { name: "Remove photo.png" })).toBeNull()
  expect(screen.queryByRole("list")).toBeNull()
  await act(async () => {
    fireEvent.change(container.querySelector('input[type="file"]')!, {
      target: { files: [new File(["b"], "b.png", { type: "image/png" })] }
    })
  })
  expect(change.mock.calls[0]?.[0]).toHaveLength(2)
  expect(change.mock.calls[0]?.[1].reason).toBe("append")
  expect(screen.getByRole("status").textContent).toBe("Selected 1")
})

test("preview none also suppresses renderItem", () => {
  render(
    <UploadList
      value={[saved]}
      onValueChange={() => {}}
      preview={UploadListPreview.none}
      renderItem={(item) => <span>Custom {item.name}</span>}
      copy={copy}>
      Drop media
    </UploadList>
  )
  expect(screen.queryByText("Custom photo.png")).toBeNull()
})

test("thumbnail and row previews keep named item actions", () => {
  for (const preview of [UploadListPreview.thumbnail, UploadListPreview.row]) {
    const remove = vi.fn()
    const preview_ = vi.fn()
    const view = render(
      <UploadList
        value={[{ ...saved, thumbnail: { src: "/photo.png", alt: "Photo thumbnail" } }]}
        onValueChange={remove}
        onPreview={preview_}
        preview={preview}
        copy={copy}>
        Drop media
      </UploadList>
    )
    expect(screen.getByAltText("Photo thumbnail")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: "Preview photo.png" }))
    fireEvent.click(screen.getByRole("button", { name: "Remove photo.png" }))
    expect(preview_).toHaveBeenCalledOnce()
    expect(remove.mock.calls[0]?.[1].reason).toBe("remove")
    view.unmount()
  }
})
