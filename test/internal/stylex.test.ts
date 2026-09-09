import { expect, test } from "bun:test"
import path from "node:path"

test("package statically extracts owned StyleX presentation", async () => {
  const root = path.resolve(import.meta.dir, "../..")
  const css = await Bun.file(path.join(root, "dist/style.css")).text()
  expect(css.includes("--stylex-injection: 0")).toBe(true)
  const source = await Bun.file(path.join(root, "app/component/brand/stylex/drop-area.tsx")).text()
  expect(source).toContain("stylex.create")
  for (const file of new Bun.Glob("dist/**/*.js").scanSync({ cwd: root })) {
    expect(await Bun.file(path.join(root, file)).text()).not.toContain("stylex.create(")
  }
}, 120_000)
