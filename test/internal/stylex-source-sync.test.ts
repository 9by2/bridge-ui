import { expect, test } from "bun:test"

const hasImport = (value: unknown): value is { import: string } =>
  typeof value === "object" && value !== null && "import" in value && typeof value.import === "string"

test("package public entries own StyleX source instead of the private pilot", async () => {
  const [entry, buildSource, manifest] = await Promise.all([
    Bun.file("app/index.ts").text(),
    Bun.file("cmd/build-package.ts").text(),
    Bun.file("package.json").json()
  ])
  const exportTarget = Object.values(manifest.exports).flatMap((value) => (hasImport(value) ? [value.import] : []))

  expect(manifest.files).toEqual(["dist"])
  expect(entry).not.toContain("./component/shadcn/")
  expect(entry).toContain("./component/brand/stylex/button")
  expect(entry).toContain("./component/brand/stylex/theme")
  expect(buildSource).toContain('new Bun.Glob("app/component/brand/stylex/*.{ts,tsx}")')
  expect(buildSource).not.toContain("internal/pilot")
  expect(JSON.stringify(manifest.exports)).not.toContain("pilot")
  expect(exportTarget).not.toContain(expect.stringContaining("pilot"))
  expect(exportTarget).toContain("./dist/component/brand/stylex/button.js")
  expect(manifest.exports["./component/shadcn/*"]).toEqual({
    types: "./dist/component/brand/stylex/*.d.ts",
    import: "./dist/component/brand/stylex/*.js"
  })
})
