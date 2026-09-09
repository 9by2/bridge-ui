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
