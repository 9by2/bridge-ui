import { expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { promoteRelease } from "../../cmd/promote-release"

const baseEnv = {
  CI_COMMIT_REF_PROTECTED: "true",
  CI_DEFAULT_BRANCH: "main",
  CI_COMMIT_BRANCH: "main",
  CI_API_V4_URL: "https://registry.example/api/v4",
  CI_PROJECT_ID: "872",
  CI_JOB_TOKEN: "test-token",
  GITLAB_TOKEN: "gitlab-token",
  CI_SERVER_HOST: "gitlab.example.com",
  CI_PROJECT_PATH: "group/project"
}

test("promotion refuses a commit whose version is not an RC", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-promote-"))
  try {
    await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: "0.8.1" }))
    const run = promoteRelease({ cwd: directory, env: baseEnv })
    await expect(run).rejects.toThrow("No RC version to promote")
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test("promotion refuses when the RC itself is not yet published", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-promote-"))
  try {
    await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: "0.9.0-rc.2" }))
    const run = promoteRelease({
      cwd: directory,
      env: baseEnv,
      fetch: Object.assign(async () => new Response(JSON.stringify({}), { status: 404 }), { preconnect() {} })
    })
    await expect(run).rejects.toThrow("RC version is not published yet; nothing to promote")
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test("promotion publishes stable, tags, and pushes when the RC is published and stable is new", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-promote-"))
  try {
    await Bun.write(path.join(directory, "dist/index.js"), "export const Button = {}; export const UploadList = {}")
    await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: "0.9.0-rc.2" }))
    const output: string[] = []
    const command: string[][] = []
    const run = promoteRelease({
      cwd: directory,
      env: baseEnv,
      fetch: Object.assign(
        async (input: RequestInfo | URL) =>
          new Response(JSON.stringify({ versions: { "0.9.0-rc.2": {} } }), { status: 200 }),
        { preconnect() {} }
      ),
      log: (message) => output.push(message),
      spawn: (args) => {
        command.push(args)
        const isTagLookup = args.includes("rev-parse")
        return {
          exitCode: isTagLookup ? 1 : 0,
          stdout: Buffer.from(""),
          stderr: Buffer.from("")
        }
      }
    })
    await run
    expect(command).toContainEqual([
      "bun",
      "publish",
      "--tag",
      "latest",
      "--registry",
      "https://registry.example/api/v4/projects/872/packages/npm/"
    ])
    expect(command).toContainEqual(["git", "tag", "v0.9.0"])
    expect(command.some((args) => args[0] === "git" && args[1] === "push" && args[2]?.includes("oauth2:"))).toBe(true)
    expect(output).toContain("New tag: v0.9.0")
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test("promotion is a safe no-op when stable is already published and tagged", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-promote-"))
  try {
    await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: "0.9.0-rc.2" }))
    const output: string[] = []
    const command: string[][] = []
    const run = promoteRelease({
      cwd: directory,
      env: baseEnv,
      fetch: Object.assign(
        async () => new Response(JSON.stringify({ versions: { "0.9.0-rc.2": {}, "0.9.0": {} } }), { status: 200 }),
        { preconnect() {} }
      ),
      log: (message) => output.push(message),
      spawn: (args) => {
        command.push(args)
        const isTagLookup = args.includes("rev-parse")
        return { exitCode: isTagLookup ? 0 : 0, stdout: Buffer.from(""), stderr: Buffer.from("") }
      }
    })
    await run
    expect(command.some((args) => args.includes("publish"))).toBe(false)
    expect(command.some((args) => args[0] === "git" && args[1] === "tag")).toBe(false)
    expect(output).toContain("Tag v0.9.0 already exists; nothing to push")
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test("promotion refuses local execution without protected default branch context", () => {
  const result = Bun.spawnSync(["bun", "cmd/promote-release.ts"], {
    env: { ...process.env, CI_COMMIT_REF_PROTECTED: "false" },
    stdout: "pipe",
    stderr: "pipe"
  })
  expect(result.exitCode).not.toBe(0)
  expect(result.stderr.toString()).toContain("Protected default branch required")
})
