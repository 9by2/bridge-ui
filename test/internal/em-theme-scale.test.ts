import { expect, test } from "bun:test"

test("published theme font and radius scale uses relative units", async () => {
  const css = await Bun.file("dist/style.css").text()
  expect(css).toMatch(/--bridge-font-size-base: 0?\.875em/)
  expect(css).toMatch(/--bridge-radius-10: 0?\.625em/)
  expect(css).toMatch(/var\(--bridge-font-size-base, 0?\.875em\)/)
  expect(css).toMatch(/var\(--bridge-radius-10, 0?\.625em\)/)
})
