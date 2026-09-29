import { expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import applyReleasePlan from "@changesets/apply-release-plan"
import getReleasePlan from "@changesets/get-release-plan"
import { getPackages } from "@manypkg/get-packages"

// Real Changesets engine + filesystem; first call lazily loads the changelog generator, slow on shared CI runners.
const EngineTimeout = 30_000

test(
  "Changesets versions a merged feature as stable and consumes its note",
  async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "bridge-changeset-"))
    try {
      await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: "0.1.0" }))
      await Bun.write(path.join(directory, ".changeset/config.json"), await Bun.file(".changeset/config.json").text())
      await Bun.write(path.join(directory, ".changeset/feature.md"), '---\n"@bridge/ui": minor\n---\n\nAdd feature.\n')
      await applyReleasePlan(await getReleasePlan(directory), await getPackages(directory))
      expect((await Bun.file(path.join(directory, "package.json")).json()).version).toBe("0.2.0")
      expect(await Bun.file(path.join(directory, ".changeset/pre.json")).exists()).toBe(false)
      expect(await Bun.file(path.join(directory, ".changeset/feature.md")).exists()).toBe(false)
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  },
  EngineTimeout
)

// Protects a single stable release containing all pending changesets, followed by a new stable bump.
test(
  "successive stable releases include pending changesets without pre mode",
  async () => {
    const directory = await mkdtemp(path.join(tmpdir(), "bridge-changeset-"))
    const version = async () => (await Bun.file(path.join(directory, "package.json")).json()).version
    const add = (name: string, bump: string) =>
      Bun.write(path.join(directory, `.changeset/${name}.md`), `---\n"@bridge/ui": ${bump}\n---\n\n${name}\n`)
    const cut = async () => applyReleasePlan(await getReleasePlan(directory), await getPackages(directory))
    try {
      await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: "0.9.0" }))
      await Bun.write(path.join(directory, ".changeset/config.json"), await Bun.file(".changeset/config.json").text())
      await add("one", "minor")
      await add("two", "patch")
      await cut()
      expect(await version()).toBe("0.10.0")
      const changelog = await Bun.file(path.join(directory, "CHANGELOG.md")).text()
      expect(changelog).toContain("## 0.10.0")
      expect(changelog).toMatch(/## 0\.10\.0[\s\S]*two/)
      await add("three", "patch")
      await cut()
      expect(await version()).toBe("0.10.1")
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  },
  EngineTimeout
)
