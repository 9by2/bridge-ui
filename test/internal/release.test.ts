import { expect, test } from "bun:test"

test("compiler command resolves an installed TypeScript executable", async () => {
  const manifest = await Bun.file("package.json").json()
  const compiler = await Bun.file("node_modules/typescript/package.json").json()
  expect(compiler.bin.tsc).toBeDefined()
  expect(manifest.scripts.typecheck).toBe("bun node_modules/typescript/bin/tsc --noEmit")
  expect(await Bun.file("cmd/build-package.ts").text()).not.toContain('"tsgo"')
})

test("release refuses local execution without a protected prerelease context", () => {
  const result = Bun.spawnSync(["bun", "cmd/publish-package.ts"], {
    env: { ...process.env, CI_COMMIT_TAG: "v0.1.0", CI_COMMIT_REF_PROTECTED: "false" },
    stdout: "pipe",
    stderr: "pipe"
  })
  expect(result.exitCode).not.toBe(0)
  expect(result.stderr.toString()).toContain("Protected prerelease tag required")
})
