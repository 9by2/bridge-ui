import { expect, test } from "bun:test"

test("promoted package output is precompiled and includes scoped adapter", async () => {
  const css = await Bun.file("dist/style.css").text()
  expect(css).toContain('[data-pilot-theme] [data-slot="badge"] svg')
  // DEC-013: the former DEC-019 global `border-radius: 0 !important` reset is removed.
  // Components self-declare their own Cue-recipe radius; the scoped adapter still
  // carries legitimate narrow rules such as the avatar status-ring pseudo-element.
  expect(css).toContain('[data-pilot-theme] [data-slot="avatar"]::after')
  expect(css).not.toContain("border-radius: 0 !important")
  expect(css).not.toContain('@import "tailwindcss"')
  expect(css).not.toMatch(/@import\s+["']@fontsource/)
  expect(css).toContain("@font-face")
  // Cue's CTA transition-colors contract names its gradient custom properties with
  // the Tailwind convention; static output must still stay independent of Tailwind.
  expect(css).not.toMatch(/@(?:import|layer)\s+[^;]*tailwind/i)
  expect(css).toContain(":root, .xu2yawi")
  expect(css).toContain("--pilot-background")

  for (const file of new Bun.Glob("dist/component/brand/stylex/*.js").scanSync()) {
    const output = await Bun.file(file).text()
    expect(output, file).not.toContain("stylex.create(")
    expect(output, file).not.toContain("runtimeInjection")
  }
})
