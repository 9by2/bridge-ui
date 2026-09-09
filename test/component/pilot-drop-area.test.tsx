import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import { DropArea } from "../../app/component/brand/stylex/drop-area"

afterEach(cleanup)
test("drop area preserves caller label and disabled layout", () => {
  for (const layout of [undefined, "inline", "compact"] as const) {
    const { unmount } = render(
      <DropArea label="Upload" layout={layout} disabled>
        Choose file
      </DropArea>
    )
    expect(screen.getByRole("button", { name: "Upload" }).getAttribute("aria-disabled")).toBe("true")
    unmount()
  }
})
