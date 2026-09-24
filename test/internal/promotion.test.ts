import { expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { promoteRelease } from "../../cmd/promote-release"

const baseEnv = {
  CI_COMMIT_REF_PROTECTED: "true",
  CI_DEFAULT_BRANCH: "main",
  CI_COMMIT_BRANCH: "main",
  CI_API_V4_URL: "https://gitlab.example.com/api/v4",
  CI_PROJECT_ID: "872",
  CI_JOB_TOKEN: "job-token",
  GITLAB_TOKEN: "gitlab-token",
  CI_SERVER_HOST: "gitlab.example.com",
  CI_PROJECT_PATH: "group/project"
}

type Call = { url: string; method: string; body?: unknown }

async function fixture(option: { version: string; changeset?: string[] }) {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-promote-"))
  await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: option.version }))
  await Bun.write(path.join(directory, "CHANGELOG.md"), `# @bridge/ui\n\n## ${option.version}\n`)
  await Bun.write(path.join(directory, ".changeset/config.json"), "{}")
  await Bun.write(path.join(directory, ".changeset/README.md"), "readme")
  for (const name of option.changeset ?? [])
    await Bun.write(path.join(directory, `.changeset/${name}.md`), "---\n---\n")
  return directory
}

/** Simulates `changeset version` after `pre exit`: writes the stable version and its CHANGELOG entry. */
function simulate(
  directory: string,
  stable: string,
  command: string[][],
  exitCode: (args: string[]) => number = () => 0
) {
  return (args: string[]) => {
    command.push(args)
    if (args.join(" ") === "bun changeset version") {
      Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: stable }))
      Bun.write(
        path.join(directory, "CHANGELOG.md"),
        `# @bridge/ui\n\n## ${stable}\n\n### Minor Changes\n\n- Added thing\n\n## 0.9.0\n`
      )
    }
    return { exitCode: exitCode(args), stdout: Buffer.from(""), stderr: Buffer.from("") }
  }
}

function gitlab(option: { published?: string[]; existingMr?: number }, call: Call[]) {
  return Object.assign(
    async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)
      const method = init?.method ?? "GET"
      call.push({ url, method, body: init?.body ? JSON.parse(String(init.body)) : undefined })
      if (url.includes("/packages/npm/"))
        return new Response(
          JSON.stringify({ versions: Object.fromEntries((option.published ?? []).map((item) => [item, {}])) }),
          { status: 200 }
        )
      if (url.includes("/merge_requests?"))
        return new Response(JSON.stringify(option.existingMr ? [{ iid: option.existingMr }] : []), { status: 200 })
      return new Response(JSON.stringify({ iid: option.existingMr ?? 41, web_url: "https://mr/41" }), { status: 200 })
    },
    { preconnect() {} }
  )
}

// Protects: "skip release" — promoting from main with RCs skipped (or none cut) computes stable
// from every pending changeset and opens a stable release MR instead of publishing directly.
test("promotion opens a stable release MR computed from every pending changeset", async () => {
  const directory = await fixture({ version: "0.10.0-rc.1", changeset: ["rate-card", "page-density"] })
  const command: string[][] = []
  const call: Call[] = []
  const output: string[] = []
  try {
    await promoteRelease({
      cwd: directory,
      env: baseEnv,
      log: (message) => output.push(message),
      fetch: gitlab({ published: ["0.9.0", "0.10.0-rc.0"] }, call),
      spawn: simulate(directory, "0.10.0", command)
    })
    const line = command.map((args) => args.join(" "))
    expect(line.slice(0, 5)).toEqual([
      "bun changeset pre exit",
      "bun changeset version",
      "bun changeset pre enter rc",
      "bun install --lockfile-only",
      "bun fmt"
    ])
    expect(line).toContain("git checkout -B changeset-release/stable")
    expect(
      line.some((item) => item.startsWith("git -c user.name=") && item.endsWith("commit -m chore: version package"))
    ).toBe(true)
    const push = command.find((args) => args[0] === "git" && args[1] === "push")
    expect(push?.[2]).toContain("oauth2:gitlab-token@gitlab.example.com/group/project.git")
    expect(push).toContain("--force")
    expect(push?.at(-1)).toBe("HEAD:refs/heads/changeset-release/stable")
    expect(command.some((args) => args.includes("publish"))).toBe(false)
    const create = call.find((item) => item.method === "POST")
    expect(create?.url).toBe("https://gitlab.example.com/api/v4/projects/872/merge_requests")
    expect(create?.body).toMatchObject({
      source_branch: "changeset-release/stable",
      target_branch: "main",
      title: "Release @bridge/ui 0.10.0 (stable)",
      remove_source_branch: true
    })
    expect(JSON.stringify(create?.body)).toContain("Added thing")
    expect(output).toContain("Stable release MR ready for 0.10.0: https://mr/41")
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

// Protects: "skip release" — an ignored stable MR is refreshed from current main on the next promote.
test("promotion updates an existing stable release MR instead of opening another", async () => {
  const directory = await fixture({ version: "0.10.0-rc.2", changeset: ["rate-card"] })
  const call: Call[] = []
  try {
    await promoteRelease({
      cwd: directory,
      env: baseEnv,
      log: () => undefined,
      fetch: gitlab({ published: ["0.9.0"], existingMr: 57 }, call),
      spawn: simulate(directory, "0.10.0", [])
    })
    expect(call.some((item) => item.method === "POST")).toBe(false)
    const update = call.find((item) => item.method === "PUT")
    expect(update?.url).toBe("https://gitlab.example.com/api/v4/projects/872/merge_requests/57")
    expect(update?.body).toMatchObject({ title: "Release @bridge/ui 0.10.0 (stable)" })
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

// Protects the 0924 incident: never report success when the computed stable already exists.
test("promotion fails loudly when the computed stable version is already published", async () => {
  const directory = await fixture({ version: "0.9.0-rc.3", changeset: ["rate-card"] })
  const command: string[][] = []
  try {
    const run = promoteRelease({
      cwd: directory,
      env: baseEnv,
      log: () => undefined,
      fetch: gitlab({ published: ["0.9.0"] }, []),
      spawn: simulate(directory, "0.9.0", command)
    })
    await expect(run).rejects.toThrow("Stable 0.9.0 is already published; repair .changeset/pre.json base version")
    expect(command.some((args) => args[1] === "push")).toBe(false)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

// Protects: promote on a main with nothing unreleased is a clean no-op.
test("promotion skips when no changeset is pending", async () => {
  const directory = await fixture({ version: "0.10.0" })
  const command: string[][] = []
  const output: string[] = []
  try {
    await promoteRelease({
      cwd: directory,
      env: baseEnv,
      log: (message) => output.push(message),
      fetch: gitlab({}, []),
      spawn: simulate(directory, "0.10.0", command)
    })
    expect(output).toContain("No pending changeset; nothing to promote")
    expect(command).toHaveLength(0)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

// Protects: a failing changeset step aborts before anything is pushed.
test("promotion aborts before push when a versioning step fails", async () => {
  const directory = await fixture({ version: "0.10.0-rc.0", changeset: ["rate-card"] })
  const command: string[][] = []
  try {
    const run = promoteRelease({
      cwd: directory,
      env: baseEnv,
      log: () => undefined,
      fetch: gitlab({}, []),
      spawn: simulate(directory, "0.10.0", command, (args) => (args.join(" ") === "bun changeset pre exit" ? 1 : 0))
    })
    await expect(run).rejects.toThrow("Step failed: bun changeset pre exit")
    expect(command.some((args) => args[1] === "push")).toBe(false)
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
