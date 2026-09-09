import { expect, test } from "bun:test"

test("public root and generated-compatible paths resolve owned StyleX source", async () => {
  const entry = await Bun.file("app/index.ts").text()
  const manifest = await Bun.file("package.json").json()

  expect(entry).not.toContain("./component/shadcn/")
  expect(entry).toContain("./component/brand/stylex/button")
  expect(entry).toContain("./component/brand/stylex/theme")
  expect(manifest.exports["./component/shadcn/*"]).toEqual({
    types: "./dist/component/brand/stylex/*.d.ts",
    import: "./dist/component/brand/stylex/*.js"
  })
  expect(manifest.exports["./button"]).toEqual({
    types: "./dist/component/brand/stylex/button.d.ts",
    import: "./dist/component/brand/stylex/button.js"
  })
})
