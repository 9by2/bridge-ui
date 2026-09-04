import { describe, expect, test } from "bun:test"
import path from "node:path"

import { variantMatrix } from "../../storybook/shadcn/variant-matrix"

const root = path.resolve(import.meta.dir, "../..")

describe("Storybook variant coverage", () => {
  test("every matrix entry has a named story and real fixture", async () => {
    const fixture = await Bun.file(path.join(root, "storybook/shadcn/variant-fixture.tsx")).text()

    for (const name of Object.keys(variantMatrix)) {
      const story = await Bun.file(path.join(root, `storybook/shadcn/${name}.stories.tsx`)).text()
      expect(story).toContain("export const Variants")
      expect(story).toContain(`<VariantFixture name="${name}" />`)
      expect(fixture).toContain(`case "${name}":`)
    }
  })

  test("matrix axes contain unique non-empty values", () => {
    for (const axisByName of Object.values(variantMatrix)) {
      for (const values of Object.values(axisByName)) {
        expect(values.length).toBeGreaterThan(0)
        expect(new Set(values).size).toBe(values.length)
      }
    }
  })
})
