import { expect, test } from "bun:test"
import path from "node:path"

const root = path.resolve(import.meta.dir, "../..")
const catalogOnlyStylexName = ["shell-header"]
const catalogExcludedStylexName: string[] = []

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

test("catalog semantic headings use the shared typography primitive", async () => {
  const example = [...new Bun.Glob("internal/catalog/example/**/*.tsx").scanSync({ cwd: root })]
  for (const file of example) {
    const source = await Bun.file(path.join(root, file)).text()
    expect(source, file).not.toMatch(/<h[1-6][\s>]/)
  }

  const page = await Bun.file(path.join(root, "app/component/brand/stylex/page.tsx")).text()
  expect(page).toContain('import { Heading, WAIHeading } from "./typography"')
  expect(page).toContain("<Heading")
  expect(page).toContain("as={WAIHeading.H1}")
})
