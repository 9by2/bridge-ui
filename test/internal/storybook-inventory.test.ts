import { describe, expect, test } from "bun:test"
import path from "node:path"

const root = path.resolve(import.meta.dir, "../..")

describe("Storybook inventory", () => {
  test("has one package-root story for every generated component module", async () => {
    const componentName = [...new Bun.Glob("app/component/shadcn/*.tsx").scanSync({ cwd: root })]
      .map((filePath) => path.basename(filePath, ".tsx"))
      .sort()
    const storyPath = [...new Bun.Glob("storybook/shadcn/*.stories.tsx").scanSync({ cwd: root })].sort()
    const storyName = storyPath.map((filePath) => path.basename(filePath, ".stories.tsx")).sort()
    const fixture = await Bun.file(path.join(root, "storybook/shadcn/story-fixture.tsx")).text()

    expect(storyName).toEqual(componentName)
    for (const name of componentName) expect(fixture).toContain(`case "${name}":`)
    for (const filePath of storyPath) {
      const content = await Bun.file(path.join(root, filePath)).text()
      expect(content).toContain('from "@bridge/ui"')
      expect(content).not.toContain("@bridge/ui/app/")
      expect(content).not.toContain("app/component/shadcn/")
    }
  })
})
