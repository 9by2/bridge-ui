import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  UploadChangeReason,
  UploadIssueCode,
  UploadIssueDisplay,
  UploadList,
  UploadListLayout,
  composeUploadValidation,
  uploadValidation,
  type UploadAttachment
} from "../../app/component/brand/stylex/upload-list"

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

const png = (name = "a.png", size = 4) => new File(["x".repeat(size)], name, { type: "image/png" })
const pdf = (name = "doc.PDF") => new File(["pdf"], name, { type: "application/pdf" })
const pick = (container: HTMLElement, files: File[]) =>
  fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files } })
const saved: UploadAttachment = { id: "saved", name: "saved.png", type: "image/png", size: 3, url: "/saved.png" }

// Protects: consumers compose validators and get every issue in order (bridge-web dropzone parity).
test("composeUploadValidation concatenates issues from every validator", () => {
  const validate = composeUploadValidation(
    uploadValidation.accept({ "image/*": [] }),
    uploadValidation.extension([".png"]),
    uploadValidation.default({ maxSize: 2 })
  )
  const issue = validate([png("a.png", 4), pdf()], { value: [] })
  expect(issue.map((item) => [item.code, item.file?.name])).toEqual([
    [UploadIssueCode.fileInvalidType, "doc.PDF"],
    [UploadIssueCode.fileInvalidType, "doc.PDF"],
    [UploadIssueCode.fileTooLarge, "a.png"],
    [UploadIssueCode.fileTooLarge, "doc.PDF"]
  ])
})

// Protects: accept matches MIME, wildcard and extension; extension match is case-insensitive.
test("accept and extension builders match MIME, wildcard and extension", () => {
  expect(uploadValidation.accept({ "application/pdf": [] })([pdf()], { value: [] })).toEqual([])
  expect(uploadValidation.accept({ "image/*": [] })([png()], { value: [] })).toEqual([])
  expect(uploadValidation.accept({ "text/plain": [".pdf"] })([pdf()], { value: [] })).toEqual([])
  expect(uploadValidation.extension(["pdf"])([pdf()], { value: [] })).toEqual([])
  expect(uploadValidation.extension([".png"])([pdf()], { value: [] })[0]?.code).toBe(UploadIssueCode.fileInvalidType)
})

// Protects: default builder covers count and size bounds against the resulting list, with replaceable copy.
test("default builder checks count and size bounds with caller message", () => {
  const validate = uploadValidation.default({
    maxFiles: 2,
    minFiles: 2,
    minSize: 2,
    message: { [UploadIssueCode.tooManyFiles]: (limit) => `Up to ${limit}` }
  })
  const over = validate([png("b.png"), png("c.png")], { value: [saved] })
  expect(over.map((item) => [item.code, item.file?.name, item.message])).toEqual([
    [UploadIssueCode.tooManyFiles, "c.png", "Up to 2"]
  ])
  const under = validate([png("tiny.png", 1)], { value: [] })
  expect(under.map((item) => item.code)).toEqual([UploadIssueCode.fileTooSmall, UploadIssueCode.tooFewFiles])
  expect(under[1]?.file).toBeUndefined()
})

// Protects: fallback copy stays actionable (names the file or limit) when the app passes no message,
// and a builder without options never blocks.
test("default builder messages name the file or limit", () => {
  expect(uploadValidation.default()([png()], { value: [] })).toEqual([])
  const issue = uploadValidation.default({
    accept: { "image/*": [] },
    maxSize: 1,
    minSize: 9,
    maxFiles: 0,
    minFiles: 2
  })([pdf()], { value: [] })
  expect(issue.map((item) => item.message)).toEqual([
    "doc.PDF has an unsupported file type",
    "doc.PDF is larger than 1 bytes",
    "doc.PDF is smaller than 9 bytes",
    "Select up to 0 files",
    "Select at least 2 files"
  ])
})

// Protects DEC-006/DEC-010: onIssue receives every issue; file-bound issue rejects only its file,
// advisory (file-less) issue does not block; deprecated onReject still fires.
test("validator issue reaches onIssue, rejects its file and keeps accepted file", async () => {
  const change = vi.fn()
  const issue = vi.fn()
  const reject = vi.fn()
  const view = render(
    <UploadList
      value={[]}
      onValueChange={change}
      onIssue={issue}
      onReject={reject}
      validate={composeUploadValidation(
        uploadValidation.accept({ "image/*": [] }),
        uploadValidation.default({ minFiles: 3 })
      )}
      copy={copy}>
      Choose
    </UploadList>
  )
  pick(view.container, [png(), pdf()])
  await waitFor(() => expect(issue).toHaveBeenCalledOnce())
  const [payload, event] = issue.mock.calls[0]!
  expect(payload.map((item: { code: string }) => item.code)).toEqual([
    UploadIssueCode.fileInvalidType,
    UploadIssueCode.tooFewFiles
  ])
  expect(payload[0].file.name).toBe("doc.PDF")
  expect(payload[0].message).toBeTypeOf("string")
  expect(event.accepted.map((file: File) => file.name)).toEqual(["a.png"])
  expect(event.rejected.map((file: File) => file.name)).toEqual(["doc.PDF"])
  expect(change.mock.calls[0]?.[0].map((item: UploadAttachment) => item.name)).toEqual(["a.png"])
  expect(change.mock.calls[0]?.[1].reason).toBe(UploadChangeReason.append)
  expect(reject.mock.calls[0]?.[0][0].file.name).toBe("doc.PDF")
})

// Protects: existing count limit and react-dropzone rejection also surface through onIssue.
test("count limit and native rejection surface through onIssue", async () => {
  const issue = vi.fn()
  const view = render(
    <UploadList value={[saved]} onValueChange={() => undefined} onIssue={issue} maxCount={1} maxSize={2} copy={copy}>
      Choose
    </UploadList>
  )
  pick(view.container, [png("big.png", 9), png("ok.png", 1)])
  await waitFor(() => expect(issue).toHaveBeenCalledOnce())
  expect(issue.mock.calls[0]?.[0].map((item: { code: string; file: File }) => [item.code, item.file.name])).toEqual([
    [UploadIssueCode.fileTooLarge, "big.png"],
    [UploadIssueCode.tooManyFiles, "ok.png"]
  ])
})

// Protects: change reason for replace (single mode), remove and clear.
test("change reason covers replace, remove and clear", async () => {
  const change = vi.fn()
  const view = render(
    <UploadList value={[saved]} onValueChange={change} multiple={false} copy={copy}>
      Choose
    </UploadList>
  )
  pick(view.container, [png("next.png")])
  await waitFor(() => expect(change).toHaveBeenCalledOnce())
  expect(change.mock.calls[0]?.[0].map((item: UploadAttachment) => item.name)).toEqual(["next.png"])
  expect(change.mock.calls[0]?.[1]).toMatchObject({ reason: UploadChangeReason.replace })
  expect(change.mock.calls[0]?.[1].attachment.map((item: UploadAttachment) => item.name)).toEqual(["next.png"])

  fireEvent.click(screen.getByRole("button", { name: "Remove saved.png" }))
  expect(change.mock.calls[1]?.[1]).toEqual({ reason: UploadChangeReason.remove, attachment: [saved] })

  view.rerender(
    <UploadList
      value={[saved]}
      onValueChange={change}
      copy={copy}
      renderItem={(attachment, helper) => (
        <button type="button" onClick={helper.clear}>
          Clear {attachment.name}
        </button>
      )}>
      Choose
    </UploadList>
  )
  fireEvent.click(screen.getByRole("button", { name: "Clear saved.png" }))
  expect(change.mock.calls[2]).toEqual([[], { reason: UploadChangeReason.clear, attachment: [saved] }])
})

// Protects: inline issue display is opt-in and accessible; default renders nothing extra (DEC-002).
test("inline issue display renders an alert only when opted in", async () => {
  const view = render(
    <UploadList value={[]} onValueChange={() => undefined} validate={uploadValidation.extension([".png"])} copy={copy}>
      Choose
    </UploadList>
  )
  pick(view.container, [pdf()])
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Rejected doc.PDF"))
  expect(screen.queryByRole("alert")).toBeNull()
  view.rerender(
    <UploadList
      value={[]}
      onValueChange={() => undefined}
      validate={uploadValidation.extension([".png"], { message: (file) => `${file.name} must be PNG` })}
      issueDisplay={UploadIssueDisplay.inline}
      copy={copy}>
      Choose
    </UploadList>
  )
  pick(view.container, [pdf()])
  expect((await screen.findByRole("alert")).textContent).toContain("doc.PDF must be PNG")
})

// Protects: renderEmpty only when empty; renderItem helper removes and restores focus; grid layout exposed.
test("render slot, empty state and grid layout", () => {
  const change = vi.fn()
  const view = render(
    <UploadList
      value={[]}
      onValueChange={change}
      layout={UploadListLayout.grid}
      renderEmpty={() => <p>No attachment yet</p>}
      copy={copy}>
      Choose
    </UploadList>
  )
  expect(screen.getByText("No attachment yet")).toBeTruthy()
  expect(view.container.querySelector('[data-slot="upload-list"]')?.getAttribute("data-layout")).toBe("grid")
  view.rerender(
    <UploadList
      value={[saved]}
      onValueChange={change}
      layout={UploadListLayout.grid}
      renderEmpty={() => <p>No attachment yet</p>}
      renderItem={(attachment, helper) => (
        <button type="button" onClick={helper.remove}>
          Drop {attachment.name} ({helper.layout})
        </button>
      )}
      copy={copy}>
      Choose
    </UploadList>
  )
  expect(screen.queryByText("No attachment yet")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: "Drop saved.png (grid)" }))
  expect(change).toHaveBeenCalledWith([], { reason: UploadChangeReason.remove, attachment: [saved] })
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Choose" }))
})

// Protects: custom renderItem can open the consumer preview through the helper.
test("renderItem helper preview delegates to onPreview", () => {
  const preview = vi.fn()
  render(
    <UploadList
      value={[saved]}
      onValueChange={() => undefined}
      onPreview={preview}
      renderItem={(attachment, helper) => (
        <button type="button" onClick={helper.preview}>
          Open {attachment.name}
        </button>
      )}
      copy={copy}>
      Choose
    </UploadList>
  )
  fireEvent.click(screen.getByRole("button", { name: "Open saved.png" }))
  expect(preview).toHaveBeenCalledWith(saved)
})

// Protects: keyboard activation of the drop target opens the file picker.
test("Enter on the drop target opens the file input", () => {
  const view = render(
    <UploadList value={[]} onValueChange={() => undefined} copy={copy}>
      Choose
    </UploadList>
  )
  const input = view.container.querySelector<HTMLInputElement>('input[type="file"]')!
  const click = vi.spyOn(input, "click")
  fireEvent.keyDown(screen.getByRole("button", { name: "Choose" }), { key: "Enter" })
  expect(click).toHaveBeenCalled()
})

// Protects DEC-002: upload modules never import a toast engine; the app decides feedback.
test("upload modules import no toast module", async () => {
  const { readFile } = await import("node:fs/promises")
  for (const name of ["drop-area", "upload-list", "upload-preview", "upload-viewer", "upload-validation"]) {
    const source = await readFile(
      `app/component/brand/stylex/${name}.ts${name === "upload-validation" ? "" : "x"}`,
      "utf8"
    )
    expect(source, name).not.toMatch(/from\s+["'](sonner|\.\/(sonner|toast))["']/)
  }
})
