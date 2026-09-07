import { expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

test("Changesets versions RC, consumes its note and promotes stable", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-changeset-"))
  const cli = path.resolve("node_modules/@changesets/cli/bin.js")
  const run = (...args: string[]) => {
    const result = Bun.spawnSync(["bun", cli, ...args], { cwd: directory, stdout: "pipe", stderr: "pipe" })
    expect(result.exitCode, result.stderr.toString()).toBe(0)
  }
  try {
    await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: "0.1.0" }))
    await Bun.write(path.join(directory, ".changeset/config.json"), await Bun.file(".changeset/config.json").text())
    await Bun.write(path.join(directory, ".changeset/feature.md"), '---\n"@bridge/ui": minor\n---\n\nAdd feature.\n')
    run("pre", "enter", "rc")
    run("version")
    expect((await Bun.file(path.join(directory, "package.json")).json()).version).toBe("0.2.0-rc.0")
    const pre = await Bun.file(path.join(directory, ".changeset/pre.json")).json()
    expect(pre.changesets).toContain("feature")
    run("pre", "exit")
    run("version")
    expect((await Bun.file(path.join(directory, "package.json")).json()).version).toBe("0.2.0")
    expect(await Bun.file(path.join(directory, ".changeset/pre.json")).exists()).toBe(false)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
