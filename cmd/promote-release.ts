import { cp, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

type ProcessResult = {
  exitCode: number | null
  stdout?: { toString: () => string }
  stderr?: { toString: () => string }
}

type PromoteDependency = {
  cwd?: string
  env?: Record<string, string | undefined>
  fetch?: typeof fetch
  log?: (message: string) => void
  spawn?: (
    command: string[],
    options: { cwd?: string; stdout: "pipe" | "inherit"; stderr: "pipe" | "inherit" }
  ) => ProcessResult
}

export async function promoteRelease(dependency: PromoteDependency = {}): Promise<void> {
  const cwd = dependency.cwd ?? process.cwd()
  const env = dependency.env ?? process.env
  const fetchRegistry = dependency.fetch ?? fetch
  const log = dependency.log ?? console.log
  const spawn = dependency.spawn ?? ((command, options) => Bun.spawnSync(command, options))

  if (
    env.CI_COMMIT_REF_PROTECTED !== "true" ||
    !env.CI_DEFAULT_BRANCH ||
    env.CI_COMMIT_BRANCH !== env.CI_DEFAULT_BRANCH
  ) {
    throw new Error("Protected default branch required")
  }
  const manifest = await Bun.file(path.join(cwd, "package.json")).json()
  const match = /^(\d+\.\d+\.\d+)-rc\.\d+$/.exec(manifest.version)
  const stableVersion = match?.[1]
  if (!stableVersion) {
    log("No RC version to promote; skipping")
    return
  }
  const stableTag = `v${stableVersion}`

  const { CI_API_V4_URL, CI_PROJECT_ID, CI_JOB_TOKEN, GITLAB_TOKEN, CI_SERVER_HOST, CI_PROJECT_PATH } = env
  if (!CI_API_V4_URL || !CI_PROJECT_ID || !CI_JOB_TOKEN) throw new Error("GitLab job context required")
  if (!GITLAB_TOKEN || !CI_SERVER_HOST || !CI_PROJECT_PATH) throw new Error("GitLab push context required")
  const registry = `${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/npm/`
  if (URL.parse(registry)?.protocol !== "https:") throw new Error("HTTPS registry required")

  const lookupPublished = async (version: string) => {
    const response = await fetchRegistry(`${registry}${encodeURIComponent(manifest.name)}`, {
      headers: { "JOB-TOKEN": CI_JOB_TOKEN }
    })
    if (!response.ok && response.status !== 404) throw new Error(`Registry lookup failed: ${response.status}`)
    const metadata = response.ok ? await response.json() : {}
    return Boolean(metadata.versions?.[version])
  }

  if (!(await lookupPublished(manifest.version))) {
    throw new Error("RC version is not published yet; nothing to promote")
  }

  if (!(await lookupPublished(stableVersion))) {
    const directory = await mkdtemp(path.join(tmpdir(), "bridge-promote-"))
    const npmrc = `@bridge:registry=${registry}\n${registry.replace(/^https:/, "")}:_authToken=\${CI_JOB_TOKEN}\n`
    try {
      await cp(path.join(cwd, "dist"), path.join(directory, "dist"), { recursive: true })
      await Bun.write(
        path.join(directory, "package.json"),
        JSON.stringify({
          ...manifest,
          version: stableVersion,
          scripts: {},
          devDependencies: {},
          publishConfig: { registry, tag: "latest" }
        })
      )
      await Bun.write(path.join(directory, ".npmrc"), npmrc)
      const publication = spawn(["bun", "publish", "--tag", "latest", "--registry", registry], {
        cwd: directory,
        stdout: "inherit",
        stderr: "inherit"
      })
      if (publication.exitCode !== 0) throw new Error("Stable publication failed")
      const fixture = path.join(directory, "fixture")
      await Bun.write(
        path.join(fixture, "package.json"),
        JSON.stringify({
          private: true,
          dependencies: { "@bridge/ui": stableVersion, react: "^19", "react-dom": "^19" }
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
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  } else {
    log("Stable version already published; nothing to publish")
  }

  const existingTag = spawn(["git", "rev-parse", "--verify", `refs/tags/${stableTag}^{commit}`], {
    cwd,
    stdout: "pipe",
    stderr: "pipe"
  })
  if (existingTag.exitCode === 0) {
    log(`Tag ${stableTag} already exists; nothing to push`)
    return
  }
  const createTag = spawn(["git", "tag", stableTag], { cwd, stdout: "pipe", stderr: "pipe" })
  if (createTag.exitCode !== 0) throw new Error("Stable published but tag creation failed")
  const pushUrl = `https://oauth2:${GITLAB_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git`
  const pushTag = spawn(["git", "push", pushUrl, stableTag], { cwd, stdout: "pipe", stderr: "pipe" })
  if (pushTag.exitCode !== 0) throw new Error("Stable tag created locally but push failed")
  log(`New tag: ${stableTag}`)
}

if (import.meta.main) await promoteRelease()
