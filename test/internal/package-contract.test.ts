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

  test("built root and direct entry preserve component and provider identity", async () => {
    const build = Bun.spawnSync([process.execPath, "cmd/build-package.ts"], {
      cwd: root,
      stdout: "pipe",
      stderr: "pipe"
    })
    expect(build.exitCode, build.stderr.toString()).toBe(0)
    const entry = await import(path.join(root, "dist/index.js"))
    for (const file of new Bun.Glob("dist/component/brand/stylex/*.js").scanSync({ cwd: root })) {
      if (file.endsWith("token.stylex.js") || file.endsWith("use-mobile.js")) continue
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
