import { expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { publishNpm, PublicPackage } from "../../cmd/publish-npm"

const MainPush = {
  GITHUB_ACTIONS: "true",
  GITHUB_EVENT_NAME: "push",
  GITHUB_REF: "refs/heads/main",
  NODE_AUTH_TOKEN: "test-token"
} as const

const forbidRegistry = Object.assign(
  () => {
    throw new Error("Registry must not be contacted")
  },
  { preconnect() {} }
)

async function fixture(
  version: string,
  changelog = `# @bridge/ui\n\n## ${version}\n\n### Minor Changes\n\n- Add list.\n\n## 0.1.0\n\n- Old.\n`
) {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-npm-"))
  await Bun.write(path.join(directory, "dist/index.js"), "export const Button = {}")
  await Bun.write(path.join(directory, "README.md"), "# Bridge UI\n")
  await Bun.write(
    path.join(directory, "package.json"),
    JSON.stringify({
      name: "@bridge/ui",
      version,
      exports: { ".": { import: "./dist/index.js" } },
      scripts: { build: "x" },
      devDependencies: { vite: "1" },
      dependencies: { cn: "1" },
      peerDependencies: { react: "^19" }
    })
  )
  await Bun.write(path.join(directory, "CHANGELOG.md"), changelog)
  return directory
}

// Protects: the public mirror never publishes from a laptop, a PR, or a non-main ref.
test("npm publication refuses non-main-push context before contacting the registry", async () => {
  const directory = await fixture("0.2.0")
  try {
    for (const env of [
      {},
      { ...MainPush, GITHUB_EVENT_NAME: "pull_request" },
      { ...MainPush, GITHUB_REF: "refs/heads/feature" }
    ]) {
      await expect(publishNpm({ cwd: directory, env, fetch: forbidRegistry })).rejects.toThrow(
        "GitHub main push required"
      )
    }
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

// Protects: only GitLab-versioned stable releases are mirrored.
test("npm publication rejects RC and skips versions without changelog entry", async () => {
  const rc = await fixture("0.2.0-rc.0")
  const unversioned = await fixture("0.2.0", "# @bridge/ui\n\n## 0.1.0\n")
  try {
    await expect(publishNpm({ cwd: rc, env: MainPush, fetch: forbidRegistry })).rejects.toThrow(
      "Stable version required"
    )
    const output: string[] = []
    await publishNpm({ cwd: unversioned, env: MainPush, fetch: forbidRegistry, log: (line) => output.push(line) })
    expect(output).toContain("No Changesets release entry; nothing to publish")
  } finally {
    await rm(rc, { recursive: true, force: true })
    await rm(unversioned, { recursive: true, force: true })
  }
})

test("public package targets the GitHub Packages registry for the 9by2 organization", () => {
  expect(PublicPackage.REGISTRY).toBe("https://npm.pkg.github.com/")
  expect(PublicPackage.NAME.startsWith("@9by2/")).toBe(true)
})

// Protects: GitHub Packages manifest rename, idempotent publish, verified install, and release outputs.
test("npm publication publishes the renamed public manifest once and emits release output", async () => {
  for (const scenario of ["new", "already-published", "install-failure"] as const) {
    const directory = await fixture("0.2.0")
    const outputFile = path.join(directory, "github-output")
    const commands: string[][] = []
    let staged: Record<string, unknown> | undefined
    let published = scenario === "already-published"
    try {
      const run = publishNpm({
        cwd: directory,
        env: { ...MainPush, GITHUB_OUTPUT: outputFile },
        retryDelayMs: 0,
        fetch: Object.assign(
          async (url: string | URL | Request, init?: RequestInit) => {
            expect(String(url)).toBe(`${PublicPackage.REGISTRY}${encodeURIComponent(PublicPackage.NAME)}`)
            expect(new Headers(init?.headers).get("authorization")).toBe("Bearer test-token")
            return published
              ? new Response(JSON.stringify({ versions: { "0.2.0": {} } }), { status: 200 })
              : new Response("{}", { status: 404 })
          },
          { preconnect() {} }
        ),
        log: () => {},
        spawn: (command, options) => {
          commands.push(command)
          if (command[1] === "publish") {
            staged = JSON.parse(readFileSync(path.join(options.cwd!, "package.json"), "utf8"))
            published = true
          }
          return { exitCode: command[1] === "install" && scenario === "install-failure" ? 1 : 0 }
        }
      })
      if (scenario === "install-failure") {
        await expect(run).rejects.toThrow("Registry install failed")
        continue
      }
      await run
      const didPublish = commands.some((command) => command[1] === "publish")
      expect(didPublish).toBe(scenario === "new")
      if (scenario === "new") {
        expect(commands).toContainEqual([
          "npm",
          "publish",
          "--access",
          "public",
          "--tag",
          "latest",
          "--registry",
          PublicPackage.REGISTRY
        ])
        expect(staged).toMatchObject({
          name: PublicPackage.NAME,
          version: "0.2.0",
          scripts: {},
          devDependencies: {},
          dependencies: { cn: "1" },
          peerDependencies: { react: "^19" },
          repository: { type: "git", url: PublicPackage.REPOSITORY },
          publishConfig: { access: "public", registry: PublicPackage.REGISTRY }
        })
      }
      expect(await Bun.file(outputFile).text()).toContain("version=0.2.0\nrelease=true\n")
      const note = await Bun.file(path.join(directory, "release-note.md")).text()
      expect(note).toContain("- Add list.")
      expect(note).not.toContain("Old.")
      expect(note).toContain(`npm install ${PublicPackage.NAME}@0.2.0`)
      expect(note).toContain(`@9by2:registry=${PublicPackage.REGISTRY}`)
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  }
})
