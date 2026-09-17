import { expect, test } from "bun:test"
import path from "node:path"

const catalogOnlyStylexName = ["shell-header"]
const catalogExcludedStylexName = ["theme"]

const directoryName = (file: string) => path.basename(path.dirname(file))
const hasImport = (value: unknown): value is { import: string } =>
  typeof value === "object" && value !== null && "import" in value && typeof value.import === "string"

test("catalog exposes a default example for every public component family", async () => {
  const manifest = await Bun.file("package.json").json()
  const generatedName = [...new Bun.Glob("app/component/shadcn/*.tsx").scanSync()]
    .map((file) => path.basename(file, ".tsx"))
    .sort()
  const directStylexName = Object.entries(manifest.exports)
    .flatMap(([packagePath, target]) =>
      hasImport(target) && target.import.startsWith("./dist/component/brand/stylex/") && !packagePath.includes("*")
        ? [packagePath.slice(2)]
        : []
    )
    .filter((name) => !catalogExcludedStylexName.includes(name))
  const publicFamilyName = [
    ...new Set([...generatedName, ...directStylexName, ...catalogOnlyStylexName, "ts-chart"])
  ].sort()
  const examples = [...new Bun.Glob("internal/catalog/example/*/default.tsx").scanSync()]

  expect(examples.map(directoryName).sort()).toEqual(publicFamilyName)
  for (const file of examples) {
    const source = await Bun.file(file).text()
    expect(source, file).toContain('from "@bridge/ui"')
    expect(source, file).toContain("export default function Example")
  }
})
