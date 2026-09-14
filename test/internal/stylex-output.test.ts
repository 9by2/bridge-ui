import { expect, test } from "bun:test"

test("promoted package output is precompiled and includes scoped adapter", async () => {
  const css = await Bun.file("dist/style.css").text()
  expect(css).toContain('[data-pilot-theme] [data-slot="badge"] svg')
  expect(css).toContain("[data-pilot-theme] [data-slot] *)::after")
  expect(css).toContain("border-radius: 0 !important")
  expect(css).not.toContain('@import "tailwindcss"')
  expect(css).not.toMatch(/@import\s+["']@fontsource/)
  expect(css).toContain("@font-face")
  expect(css).not.toContain("--tw-")
  expect(css).toContain(":root, .xu2yawi")
  expect(css).toContain("--pilot-background")

  for (const file of new Bun.Glob("dist/component/brand/stylex/*.js").scanSync()) {
    const output = await Bun.file(file).text()
    expect(output, file).not.toContain("stylex.create(")
    expect(output, file).not.toContain("runtimeInjection")
  }
})
