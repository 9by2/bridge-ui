import { cp, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

type ProcessResult = {
  exitCode: number | null
  stdout?: { toString: () => string }
  stderr?: { toString: () => string }
}

type PublishDependency = {
  cwd?: string
  env?: Record<string, string | undefined>
  fetch?: typeof fetch
  log?: (message: string) => void
  spawn?: (
    command: string[],
    options: { cwd?: string; stdout: "pipe" | "inherit"; stderr: "pipe" | "inherit" }
  ) => ProcessResult
}

export async function publishPackage(dependency: PublishDependency = {}): Promise<void> {
  const cwd = dependency.cwd ?? process.cwd()
  const env = dependency.env ?? process.env
  const fetchRegistry = dependency.fetch ?? fetch
  const log = dependency.log ?? console.log
  const spawn = dependency.spawn ?? ((command, options) => Bun.spawnSync(command, options))

  if (
    env.CI_COMMIT_REF_PROTECTED !== "true" ||
    !env.CI_DEFAULT_BRANCH ||
    env.CI_COMMIT_BRANCH !== env.CI_DEFAULT_BRANCH ||
    env.CI_COMMIT_TAG
  ) {
    throw new Error("Protected default branch required")
  }
  const manifest = await Bun.file(path.join(cwd, "package.json")).json()
  if (!/^\d+\.\d+\.\d+(?:-rc\.\d+)?$/.test(manifest.version)) throw new Error("Stable or RC version required")
  const tag = `v${manifest.version}`
  const channel = manifest.version.includes("-rc.") ? "next" : "latest"
  const changelog = Bun.file(path.join(cwd, "CHANGELOG.md"))
  if (!(await changelog.exists()) || !(await changelog.text()).split("\n").includes(`## ${manifest.version}`)) {
    log("No Changesets release entry; nothing to publish")
    return
  }
  const { CI_API_V4_URL, CI_PROJECT_ID, CI_JOB_TOKEN } = env
  if (!CI_API_V4_URL || !CI_PROJECT_ID || !CI_JOB_TOKEN) throw new Error("GitLab job context required")
  const registry = `${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/npm/`
  if (URL.parse(registry)?.protocol !== "https:") throw new Error("HTTPS registry required")
  const response = await fetchRegistry(`${registry}${encodeURIComponent(manifest.name)}`, {
    headers: { "JOB-TOKEN": CI_JOB_TOKEN }
  })
  if (!response.ok && response.status !== 404) throw new Error(`Registry lookup failed: ${response.status}`)
  const metadata = response.ok ? await response.json() : {}
  const published = Boolean(metadata.versions?.[manifest.version])
  const existingTag = spawn(["git", "rev-parse", "--verify", `refs/tags/${tag}^{commit}`], {
    cwd,
    stdout: "pipe",
    stderr: "pipe"
  })
  const head = spawn(["git", "rev-parse", "HEAD"], { cwd, stdout: "pipe", stderr: "pipe" })
  if (head.exitCode !== 0) throw new Error("Cannot resolve release commit")
  if (existingTag.exitCode === 0 && existingTag.stdout?.toString() !== head.stdout?.toString()) {
    if (published) {
      log("Version already released; nothing to publish")
      return
    }
    throw new Error("Existing release tag points to another commit; do not overwrite it")
  }
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-release-"))
  const npmrc = `@bridge:registry=${registry}\n${registry.replace(/^https:/, "")}:_authToken=\${CI_JOB_TOKEN}\n`
  try {
    await cp(path.join(cwd, "dist"), path.join(directory, "dist"), { recursive: true })
    await Bun.write(
      path.join(directory, "package.json"),
      JSON.stringify({ ...manifest, scripts: {}, devDependencies: {}, publishConfig: { registry, tag: channel } })
    )
    await Bun.write(path.join(directory, ".npmrc"), npmrc)
    const publication = published
      ? undefined
      : spawn(["bun", "publish", "--tag", channel, "--registry", registry], {
          cwd: directory,
          stdout: "inherit",
          stderr: "inherit"
        })
    if (publication && publication.exitCode !== 0) throw new Error("Package publication failed")
    const fixture = path.join(directory, "fixture")
    await Bun.write(
      path.join(fixture, "package.json"),
      JSON.stringify({
        private: true,
        dependencies: { "@bridge/ui": manifest.version, react: "^19", "react-dom": "^19" }
      })
    )
    await Bun.write(path.join(fixture, ".npmrc"), npmrc)
    const install = spawn(["bun", "install", "--ignore-scripts"], {
      cwd: fixture,
      stdout: "inherit",
      stderr: "inherit"
    })
    if (install.exitCode !== 0) throw new Error("Registry install failed; package may already be published")
    const verify = spawn(
      [
        "bun",
        "-e",
        'const ui = await import("@bridge/ui"); if (!ui.Button || !ui.UploadList) throw new Error("Missing package export")'
      ],
      { cwd: fixture, stdout: "inherit", stderr: "inherit" }
    )
    if (verify.exitCode !== 0) throw new Error("Registry import failed; package already published")
    if (existingTag.exitCode !== 0) {
      const createTag = spawn(["git", "tag", tag], { cwd, stdout: "pipe", stderr: "pipe" })
      if (createTag.exitCode !== 0) throw new Error("Package verified but tag creation failed")
      log(`New tag: ${tag}`)
    }
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

if (import.meta.main) await publishPackage()
