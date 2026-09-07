import { expect, test } from "bun:test"
import path from "node:path"

test("package build removes private declaration alias", async () => {
  const root = path.resolve(import.meta.dir, "../..")
  const result = Bun.spawnSync(["bun", "run", "build"], { cwd: root, stdout: "pipe", stderr: "pipe" })
  expect(result.exitCode, result.stderr.toString()).toBe(0)
  const files = [...new Bun.Glob("dist/**/*.d.ts").scanSync({ cwd: root })]
  expect(files.length).toBeGreaterThan(63)
  for (const file of files) {
    expect(await Bun.file(path.join(root, file)).text(), file).not.toContain("@bridge/ui/app/")
  }
}, 120_000)
