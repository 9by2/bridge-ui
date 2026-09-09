import { expect, test } from "bun:test"
import path from "node:path"

test("package build removes private declaration alias", async () => {
  const root = path.resolve(import.meta.dir, "../..")
  const files = [...new Bun.Glob("dist/**/*.d.ts").scanSync({ cwd: root })]
  expect(files.length).toBeGreaterThan(63)
  for (const file of files) {
    expect(await Bun.file(path.join(root, file)).text(), file).not.toContain("@bridge/ui/app/")
  }
}, 120_000)
