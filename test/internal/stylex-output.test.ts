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
  for (const name of ["brand", "brand-foreground", "brand-text", "brand-accent", "brand-accent-foreground"]) {
    expect(css, name).toContain(`var(--bridge-color-${name},`)
  }
  for (const name of ["primary", "primary-foreground", "dialog", "dialog-foreground", "ring"]) {
    expect(css, name).toContain(`var(--bridge-color-${name},`)
  }
  for (const name of [
    "background",
    "foreground",
    "secondary",
    "muted",
    "accent",
    "destructive",
    "warning",
    "sidebar"
  ]) {
    expect(css, name).toContain(`var(--bridge-color-${name},`)
  }
  expect(css).toContain("var(--bridge-font-heading,")
  expect(css).toContain("var(--bridge-font-size-base,")
  expect(css).toMatch(/--bridge-font-size-base: 0?\.875em/)
  expect(css).toMatch(/--bridge-radius-10: var\(--bridge-control-radius\)/)
  expect(css).toMatch(/var\(--bridge-font-size-base, 0?\.875em\)/)
  expect(css).toMatch(/var\(--bridge-radius-10, 0?\.625em\)/)
  expect(css).not.toMatch(/--bridge-(?:button|slider)-[a-z-]+/)

  for (const file of new Bun.Glob("dist/component/brand/stylex/*.js").scanSync()) {
    const output = await Bun.file(file).text()
    expect(output, file).not.toContain("stylex.create(")
    expect(output, file).not.toContain("runtimeInjection")
  }
})

test("every generated single-variable class references a defined custom property", async () => {
  // Regression: a plain-object token (not `stylex.defineVars`/`stylex.defineConsts`) that
  // repeats an identical literal across files — e.g. the former `geometryToken` and
  // `themeToken` — gets folded by the StyleX compiler into a shared internal CSS variable
  // whose `:root` definition is silently dropped from the output. Consumers of that token
  // (Button, Input, Textarea, Kanban, Dialog, Popover, and more) then render with the
  // property missing entirely (e.g. `border-radius: 0px` in every Theme mode) instead of
  // Cue's documented control radius.
  const css = await Bun.file("dist/style.css").text()
  const singleVariableRule = [...css.matchAll(/\.(x[0-9a-z]+)\s*\{\s*([a-zA-Z-]+):\s*var\(--([0-9a-z]+)\)\s*;?\s*\}/g)]
  expect(singleVariableRule.length).toBeGreaterThan(0)
  const undefinedReference = singleVariableRule.filter(([, , , name]) => !new RegExp(`--${name}\\s*:`).test(css))
  expect(
    undefinedReference.map(([, className, property, name]) => `.${className} { ${property}: var(--${name}) }`)
  ).toEqual([])
})
