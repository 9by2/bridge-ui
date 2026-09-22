import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import { ImageCrop } from "../../app/component/brand/stylex/image-crop"

afterEach(cleanup)

test("image crop retains the controlled ReactCrop selection contract", () => {
  const change = vi.fn()
  render(
    <ImageCrop
      crop={{ unit: "%", x: 10, y: 10, width: 50, height: 50 }}
      aspect={1}
      circularCrop
      ruleOfThirds
      onChange={change}>
      <img src="/profile.png" alt="Profile preview" />
    </ImageCrop>
  )
  const surface = document.querySelector('[data-slot="image-crop"]')
  expect(surface).toBeTruthy()
  expect(surface?.firstElementChild?.classList.contains("ReactCrop")).toBe(true)
  expect(surface?.querySelector(".ReactCrop__child-wrapper > img")).toBe(
    screen.getByRole("img", { name: "Profile preview" })
  )
  expect(screen.getByRole("img", { name: "Profile preview" })).toBeTruthy()
  expect(screen.getByRole("group", { name: "Use the arrow keys to move the crop selection area" })).toBeTruthy()
})
