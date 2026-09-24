/**
 * Manual `promote` job: prepare a stable release from the current `main`.
 *
 * Every pending changeset since the last stable is released, regardless of how many RCs were cut
 * or skipped (including none). The job never publishes; it opens (or refreshes) a
 * `Release @bridge/ui x.y.z (stable)` MR. Merging it lets the existing `release` job publish under
 * `latest` and tag `vx.y.z`, then `main` is already back in RC mode with the stable as its new base.
 * Ignoring or closing the MR skips the stable release; the next promote rebuilds it from current `main`.
 */
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

export const StableReleaseBranch = "changeset-release/stable"
const ReservedChangesetFile = new Set(["README.md", "config.json", "pre.json"])

async function pendingChangeset(cwd: string) {
  const file = [...new Bun.Glob("*.md").scanSync({ cwd: path.join(cwd, ".changeset") })]
  return file.filter((name) => !ReservedChangesetFile.has(name))
}

function releaseNote(changelog: string, version: string) {
  const start = changelog.indexOf(`## ${version}\n`)
  if (start < 0) return ""
  const rest = changelog.slice(start)
  const next = rest.indexOf("\n## ", 1)
  return (next < 0 ? rest : rest.slice(0, next)).trim()
}

export async function promoteRelease(dependency: PromoteDependency = {}): Promise<void> {
  const cwd = dependency.cwd ?? process.cwd()
  const env = dependency.env ?? process.env
  const request = dependency.fetch ?? fetch
  const log = dependency.log ?? console.log
  const spawn = dependency.spawn ?? ((command, options) => Bun.spawnSync(command, options))

  if (
    env.CI_COMMIT_REF_PROTECTED !== "true" ||
    !env.CI_DEFAULT_BRANCH ||
    env.CI_COMMIT_BRANCH !== env.CI_DEFAULT_BRANCH
  ) {
    throw new Error("Protected default branch required")
  }
  const {
    CI_API_V4_URL,
    CI_PROJECT_ID,
    CI_JOB_TOKEN,
    GITLAB_TOKEN,
    CI_SERVER_HOST,
    CI_PROJECT_PATH,
    CI_DEFAULT_BRANCH
  } = env
  if (!CI_API_V4_URL || !CI_PROJECT_ID || !CI_JOB_TOKEN) throw new Error("GitLab job context required")
  if (!GITLAB_TOKEN || !CI_SERVER_HOST || !CI_PROJECT_PATH) throw new Error("GitLab push context required")

  if ((await pendingChangeset(cwd)).length === 0) {
    log("No pending changeset; nothing to promote")
    return
  }

  const run = (command: string[]) => {
    const result = spawn(command, { cwd, stdout: "inherit", stderr: "inherit" })
    if (result.exitCode !== 0) throw new Error(`Step failed: ${command.join(" ")}`)
  }
  run(["bun", "changeset", "pre", "exit"])
  run(["bun", "changeset", "version"])
  run(["bun", "changeset", "pre", "enter", "rc"])
  run(["bun", "install", "--lockfile-only"])
  run(["bun", "fmt"])

  const manifest = await Bun.file(path.join(cwd, "package.json")).json()
  const stable: string = manifest.version
  if (!/^\d+\.\d+\.\d+$/.test(stable)) throw new Error(`Expected a stable version, got ${stable}`)

  const registry = `${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/npm/`
  const lookup = await request(`${registry}${encodeURIComponent(manifest.name)}`, {
    headers: { "JOB-TOKEN": CI_JOB_TOKEN }
  })
  if (!lookup.ok && lookup.status !== 404) throw new Error(`Registry lookup failed: ${lookup.status}`)
  const metadata = lookup.ok ? await lookup.json() : {}
  if (metadata.versions?.[stable])
    throw new Error(`Stable ${stable} is already published; repair .changeset/pre.json base version`)

  run(["git", "checkout", "-B", StableReleaseBranch])
  run(["git", "add", "-A"])
  run([
    "git",
    "-c",
    "user.name=Bridge Release",
    "-c",
    "user.email=release@bridge.local",
    "commit",
    "-m",
    "chore: version package"
  ])
  const remote = `https://oauth2:${GITLAB_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git`
  run(["git", "push", remote, "--force", `HEAD:refs/heads/${StableReleaseBranch}`])

  const api = `${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/merge_requests`
  const header = { "PRIVATE-TOKEN": GITLAB_TOKEN, "Content-Type": "application/json" }
  const changelog = await Bun.file(path.join(cwd, "CHANGELOG.md")).text()
  const body = {
    title: `Release @bridge/ui ${stable} (stable)`,
    description: [
      `Merging publishes \`${stable}\` under \`latest\` and tags \`v${stable}\`. Close it to skip this stable release; the next promote rebuilds it from current \`main\`.`,
      "",
      releaseNote(changelog, stable)
    ].join("\n")
  }
  const existing = await request(
    `${api}?state=opened&source_branch=${encodeURIComponent(StableReleaseBranch)}&target_branch=${encodeURIComponent(CI_DEFAULT_BRANCH)}`,
    { headers: header }
  )
  if (!existing.ok) throw new Error(`Merge request lookup failed: ${existing.status}`)
  const [open]: { iid: number }[] = await existing.json()
  const response = open
    ? await request(`${api}/${open.iid}`, { method: "PUT", headers: header, body: JSON.stringify(body) })
    : await request(api, {
        method: "POST",
        headers: header,
        body: JSON.stringify({
          ...body,
          source_branch: StableReleaseBranch,
          target_branch: CI_DEFAULT_BRANCH,
          remove_source_branch: true
        })
      })
  if (!response.ok) throw new Error(`Merge request update failed: ${response.status}`)
  const mr: { web_url?: string } = await response.json()
  log(`Stable release MR ready for ${stable}: ${mr.web_url}`)
}

if (import.meta.main) await promoteRelease()
