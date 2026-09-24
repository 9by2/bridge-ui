import { expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import applyReleasePlan from "@changesets/apply-release-plan"
import getReleasePlan from "@changesets/get-release-plan"
import { enterPre, exitPre } from "@changesets/pre"
import { getPackages } from "@manypkg/get-packages"

test("Changesets versions RC, consumes its note and promotes stable", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-changeset-"))
  try {
    await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: "0.1.0" }))
    await Bun.write(path.join(directory, ".changeset/config.json"), await Bun.file(".changeset/config.json").text())
    await Bun.write(path.join(directory, ".changeset/feature.md"), '---\n"@bridge/ui": minor\n---\n\nAdd feature.\n')
    await enterPre(directory, "rc")
    await applyReleasePlan(await getReleasePlan(directory), await getPackages(directory))
    expect((await Bun.file(path.join(directory, "package.json")).json()).version).toBe("0.2.0-rc.0")
    const pre = await Bun.file(path.join(directory, ".changeset/pre.json")).json()
    expect(pre.changesets).toContain("feature")
    await exitPre(directory)
    await applyReleasePlan(await getReleasePlan(directory), await getPackages(directory))
    expect((await Bun.file(path.join(directory, "package.json")).json()).version).toBe("0.2.0")
    expect(await Bun.file(path.join(directory, ".changeset/pre.json")).exists()).toBe(false)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

// Protects skippable RC and skippable stable: promote (pre exit → version → pre enter rc) releases every
// pending changeset whether RCs were cut, skipped or never cut, and the next RC is numbered above it.
test("promote flow releases skipped RC and restarts RC above the new stable", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-changeset-"))
  const version = async () => (await Bun.file(path.join(directory, "package.json")).json()).version
  const add = (name: string, bump: string) =>
    Bun.write(path.join(directory, `.changeset/${name}.md`), `---\n"@bridge/ui": ${bump}\n---\n\n${name}\n`)
  const cut = async () => applyReleasePlan(await getReleasePlan(directory), await getPackages(directory))
  const promote = async () => {
    await exitPre(directory)
    await cut()
    await enterPre(directory, "rc")
  }
  try {
    await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: "0.9.0" }))
    await Bun.write(path.join(directory, ".changeset/config.json"), await Bun.file(".changeset/config.json").text())
    await enterPre(directory, "rc")
    await add("one", "minor")
    await cut()
    expect(await version()).toBe("0.10.0-rc.0")
    await add("two", "patch") // RC for "two" skipped: never cut
    await promote()
    expect(await version()).toBe("0.10.0")
    const changelog = await Bun.file(path.join(directory, "CHANGELOG.md")).text()
    expect(changelog).toContain("## 0.10.0")
    expect(changelog).toMatch(/## 0\.10\.0[\s\S]*two/)
    await add("three", "patch")
    await cut()
    expect(await version()).toBe("0.10.1-rc.0")
    // Stable skipped: more RCs follow, then a later promote still releases everything pending.
    await add("four", "minor")
    await cut()
    expect(await version()).toBe("0.11.0-rc.1")
    await promote()
    expect(await version()).toBe("0.11.0")
    // Promote with no RC at all.
    await add("five", "patch")
    await promote()
    expect(await version()).toBe("0.11.1")
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
