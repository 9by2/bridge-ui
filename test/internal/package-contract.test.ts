import { describe, expect, test } from "bun:test"
import path from "node:path"

const root = path.resolve(import.meta.dir, "../..")

describe("package contract", () => {
  test("root entry exports every generated component module", async () => {
    const componentName = [...new Bun.Glob("app/component/shadcn/*.tsx").scanSync({ cwd: root })]
      .map((filePath) => path.basename(filePath, ".tsx"))
      .sort()
    const entry = await Bun.file(path.join(root, "app/index.ts")).text()

    for (const name of componentName) {
      expect(entry).toContain(`"./component/shadcn/${name}"`)
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
    for (const file of new Bun.Glob("dist/component/{shadcn,brand}/*.js").scanSync({ cwd: root })) {
      const direct = await import(path.join(root, file))
      for (const [name, value] of Object.entries(direct)) {
        if (file.endsWith("shadcn/multi-select.js") && name === "MultiSelectValue") continue
        const publicName = file.endsWith("shadcn/sonner.js") && name === "Toaster" ? "SonnerToaster" : name
        expect(entry[publicName], `${file}: ${name}`).toBe(value)
      }
    }
    const brandValue = await import(path.join(root, "dist/component/brand/multi-select-value.js"))
    expect(entry.MultiSelectValue).toBe(brandValue.MultiSelectValue)
  }, 120_000)
})
