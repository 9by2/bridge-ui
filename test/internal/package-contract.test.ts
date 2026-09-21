import { describe, expect, test } from "bun:test"
import path from "node:path"

const root = path.resolve(import.meta.dir, "../..")

describe("package contract", () => {
  test("root entry exports every generated-compatible component from owned StyleX source", async () => {
    const componentName = [...new Bun.Glob("app/component/shadcn/*.tsx").scanSync({ cwd: root })]
      .map((filePath) => path.basename(filePath, ".tsx"))
      .sort()
    const entry = await Bun.file(path.join(root, "app/index.ts")).text()

    for (const name of componentName) {
      const target =
        name === "sonner"
          ? `export { Toaster as SonnerToaster } from "./component/brand/stylex/sonner"`
          : `"./component/brand/stylex/${name}"`
      expect(entry).toContain(target)
    }
  })

  test("manifest exposes JavaScript, declarations, CSS, and publish files", async () => {
    const manifest = await Bun.file(path.join(root, "package.json")).json()

    expect(manifest.files).toEqual(["dist"])
    expect(manifest.exports).toMatchObject({
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js"
      },
      "./style.css": {
        types: "./dist/style.css.d.ts",
        default: "./dist/style.css"
      }
    })
    expect(manifest.sideEffects).toContain("**/*.css")
    expect(manifest.peerDependencies.react).toBeDefined()
    expect(manifest.peerDependencies["react-dom"]).toBeDefined()
    expect(manifest.dependencies.react).toBeUndefined()
    expect(manifest.dependencies["react-dom"]).toBeUndefined()
  })

  test("shell header is available from root and the stable StyleX path", async () => {
    const entry = await Bun.file(path.join(root, "app/index.ts")).text()
    const sidebar = await Bun.file(path.join(root, "app/component/brand/stylex/sidebar.tsx")).text()
    const manifest = await Bun.file(path.join(root, "package.json")).json()

    expect(entry).toContain('export * from "./component/brand/stylex/shell-header"')
    expect(sidebar).toMatch(/inset:\s*\{[\s\S]*?width: "100%",\s*minWidth: 0,\s*flex: 1/)
    expect(manifest.exports["./component/brand/*"]).toEqual({
      types: "./dist/component/brand/*.d.ts",
      import: "./dist/component/brand/*.js"
    })
  })

  test("migration-critical primitives have stable root and direct package exports (REQ-005)", async () => {
    const entry = await Bun.file(path.join(root, "app/index.ts")).text()
    const manifest = await Bun.file(path.join(root, "package.json")).json()

    for (const name of ["button", "calendar", "dialog", "tabs", "select"]) {
      expect(entry).toContain(`export * from "./component/brand/stylex/${name}"`)
      expect(manifest.exports[`./${name}`]).toEqual({
        types: `./dist/component/brand/stylex/${name}.d.ts`,
        import: `./dist/component/brand/stylex/${name}.js`
      })
    }
  })

  test("reusable presentation is available from root and stable direct paths", async () => {
    const entry = await Bun.file(path.join(root, "app/index.ts")).text()
    const manifest = await Bun.file(path.join(root, "package.json")).json()

    for (const name of ["data-state", "table-frame", "timeline-step", "wizard-step", "fractal-glass", "qr-code"]) {
      expect(entry).toContain(`export * from "./component/brand/stylex/${name}"`)
      expect(manifest.exports[`./${name}`]).toEqual({
        types: `./dist/component/brand/stylex/${name}.d.ts`,
        import: `./dist/component/brand/stylex/${name}.js`
      })
    }
    expect(entry).toContain('export * from "./component/brand/stylex/page"')
    expect(manifest.exports["./page"]).toEqual({
      types: "./dist/component/brand/stylex/page.d.ts",
      import: "./dist/component/brand/stylex/page.js"
    })
  })

  test("flip text is available from root and its stable direct package path", async () => {
    const entry = await Bun.file(path.join(root, "app/index.ts")).text()
    const manifest = await Bun.file(path.join(root, "package.json")).json()

    expect(entry).toContain('export * from "./component/brand/stylex/flip-text"')
    expect(manifest.exports["./flip-text"]).toEqual({
      types: "./dist/component/brand/stylex/flip-text.d.ts",
      import: "./dist/component/brand/stylex/flip-text.js"
    })
  })

  test("built root and direct entry preserve component and provider identity", async () => {
    const entry = await import(path.join(root, "dist/index.js"))
    for (const file of new Bun.Glob("dist/component/brand/stylex/*.js").scanSync({ cwd: root })) {
      if (file.endsWith(".stylex.js") || file.endsWith("use-mobile.js")) continue
      const direct = await import(path.join(root, file))
      for (const [name, value] of Object.entries(direct)) {
        if (
          file.endsWith("stylex/multi-select.js") &&
          (name === "MultiSelectValue" || name === "MultiSelectValueAppearance")
        )
          continue
        const publicName = file.endsWith("stylex/sonner.js") && name === "Toaster" ? "SonnerToaster" : name
        expect(entry[publicName], `${file}: ${name}`).toBe(value)
      }
    }
    const brandValue = await import(path.join(root, "dist/component/brand/stylex/multi-select-value.js"))
    expect(entry.MultiSelectValue).toBe(brandValue.MultiSelectValue)
    for (const name of ["drop-area", "upload-preview", "upload-viewer", "upload-list", "image-crop"]) {
      const legacy = await import(path.join(root, `dist/component/brand/${name}.js`))
      const owned = await import(path.join(root, `dist/component/brand/stylex/${name}.js`))
      for (const exportName of Object.keys(legacy))
        expect(legacy[exportName], `${name}: ${exportName}`).toBe(owned[exportName])
    }
  }, 120_000)
})
