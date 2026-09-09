import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount
} from "../../internal/pilot/avatar"

afterEach(cleanup)
test("avatar image load, error and replacement retain fallback and callback", async () => {
  const status = vi.fn()
  const { container, rerender } = render(
    <Avatar>
      <AvatarImage
        keepMounted
        src="/profile.png"
        alt="Profile"
        onLoadingStatusChange={status}
        className={() => "image"}
      />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  )
  const image = container.querySelector("img")!
  expect(image.className).toContain("image")
  fireEvent.load(image)
  await waitFor(() => expect(status).toHaveBeenCalledWith("loaded"))
  expect(screen.getByRole("img", { name: "Profile" })).toBe(image)
  await waitFor(() => expect(screen.queryByText("AB")).toBeNull())
  fireEvent.error(image)
  await waitFor(() => expect(status).toHaveBeenCalledWith("error"))
  expect(await screen.findByText("AB")).toBeTruthy()
  rerender(
    <Avatar>
      <AvatarImage keepMounted src="/replacement.png" alt="Replacement" className="replacement" />
      <AvatarFallback>CD</AvatarFallback>
    </Avatar>
  )
  expect(container.querySelector("img")?.className).toContain("replacement")
  fireEvent.load(container.querySelector("img")!)
  expect(await screen.findByRole("img", { name: "Replacement" })).toBeTruthy()
})
test("avatar callback style remains composable", () => {
  render(
    <Avatar className={() => "root"}>
      <AvatarImage className={() => "image"} alt="Profile" />
      <AvatarFallback className={() => "fallback"}>AB</AvatarFallback>
    </Avatar>
  )
  expect(screen.getByText("AB").className).toContain("fallback")
})
test("avatar preserves image fallback and group composition", async () => {
  for (const size of [undefined, "sm", "lg"] as const) {
    const { unmount } = render(
      <AvatarGroup>
        <Avatar size={size}>
          <AvatarImage alt="Profile" />
          <AvatarFallback>AB</AvatarFallback>
          <AvatarBadge>Badge</AvatarBadge>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    )
    expect(await screen.findByText("AB")).toBeTruthy()
    expect(screen.getByText("Badge").getAttribute("data-slot")).toBe("avatar-badge")
    expect(screen.getByText("+2").getAttribute("data-slot")).toBe("avatar-group-count")
    unmount()
  }
})
