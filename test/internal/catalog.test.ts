import { expect, test } from "bun:test"
import path from "node:path"

test("catalog exposes a real example for every package module", async () => {
  const names = [...new Bun.Glob("app/component/shadcn/*.tsx").scanSync()]
    .map((file) => path.basename(file, ".tsx"))
    .sort()
  const examples = [...new Bun.Glob("internal/catalog/example/*/default.tsx").scanSync()]
  expect(examples.map((file) => path.basename(path.dirname(file))).sort()).toEqual(
    [...names, "ts-chart", "drop-area", "upload-preview", "upload-viewer", "upload-list", "image-crop"].sort()
  )
  for (const file of examples) {
    const source = await Bun.file(file).text()
    expect(source).toContain('from "@bridge/ui"')
    expect(source).toContain("export default function Example")
  }
})
