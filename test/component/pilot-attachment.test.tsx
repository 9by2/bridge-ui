import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger
} from "../../app/component/brand/stylex/attachment"

afterEach(cleanup)
test("attachment trigger accepts caller rendered anchor", () => {
  render(
    <Attachment>
      <AttachmentMedia />
      <AttachmentTrigger render={<a href="#preview" />} aria-label="Preview" />
    </Attachment>
  )
  expect(screen.getByRole("link").getAttribute("href")).toBe("#preview")
})
test("attachment keeps caller action and media state", () => {
  for (const size of [undefined, null, "default", "sm", "xs"] as const) {
    const action = vi.fn()
    const { unmount } = render(
      <AttachmentGroup>
        <Attachment size={size} state="error" orientation="vertical">
          <AttachmentMedia variant="image">
            <img alt="Preview" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>File</AttachmentTitle>
            <AttachmentDescription>Error</AttachmentDescription>
          </AttachmentContent>
          <AttachmentTrigger aria-label="Preview file" />
          <AttachmentActions>
            <AttachmentAction onClick={action}>Remove</AttachmentAction>
          </AttachmentActions>
        </Attachment>
      </AttachmentGroup>
    )
    fireEvent.click(screen.getByRole("button", { name: "Remove" }))
    expect(action).toHaveBeenCalledOnce()
    expect(screen.getByRole("button", { name: "Preview file" }).getAttribute("type")).toBe("button")
    unmount()
  }
})
