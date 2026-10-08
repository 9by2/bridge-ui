import { appendFile, cp, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

export const PublicPackage = {
  NAME: "@9by2/bridge-ui",
  SCOPE: "@9by2",
  REGISTRY: "https://npm.pkg.github.com/",
  REPOSITORY: "https://github.com/9by2/bridge-ui.git",
  NOTE_FILE: "release-note.md",
  CHANNEL: "latest"
} as const

type ProcessResult = { exitCode: number | null }

type PublishNpmDependency = {
  cwd?: string
  env?: Record<string, string | undefined>
  fetch?: typeof fetch
  log?: (message: string) => void
  retryDelayMs?: number
  spawn?: (command: string[], options: { cwd?: string; stdout: "inherit"; stderr: "inherit" }) => ProcessResult
}

export function releaseNote(changelog: string, version: string): string | undefined {
  const lines = changelog.split("\n")
  const start = lines.indexOf(`## ${version}`)
  if (start === -1) return undefined
  const end = lines.findIndex((line, index) => index > start && line.startsWith("## "))
  return lines
    .slice(start + 1, end === -1 ? undefined : end)
    .join("\n")
    .trim()
}

export async function publishNpm(dependency: PublishNpmDependency = {}): Promise<void> {
  const cwd = dependency.cwd ?? process.cwd()
  const env = dependency.env ?? process.env
  const fetchRegistry = dependency.fetch ?? fetch
  const log = dependency.log ?? console.log
  const retryDelayMs = dependency.retryDelayMs ?? 5_000
  const spawn = dependency.spawn ?? ((command, options) => Bun.spawnSync(command, options))

  if (env.GITHUB_ACTIONS !== "true" || env.GITHUB_EVENT_NAME !== "push" || env.GITHUB_REF !== "refs/heads/main") {
    throw new Error("GitHub main push required")
  }
  const manifest = await Bun.file(path.join(cwd, "package.json")).json()
  const version: string = manifest.version
  if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error("Stable version required")
  const changelog = Bun.file(path.join(cwd, "CHANGELOG.md"))
  const note = (await changelog.exists()) ? releaseNote(await changelog.text(), version) : undefined
  if (note === undefined) {
    log("No Changesets release entry; nothing to publish")
    return
  }
  if (!env.NODE_AUTH_TOKEN) throw new Error("NODE_AUTH_TOKEN required")

  const isPublished = async () => {
    const response = await fetchRegistry(`${PublicPackage.REGISTRY}${encodeURIComponent(PublicPackage.NAME)}`, {
      headers: { Authorization: `Bearer ${env.NODE_AUTH_TOKEN}` }
    })
    if (!response.ok && response.status !== 404) throw new Error(`Registry lookup failed: ${response.status}`)
    const metadata = response.ok ? await response.json() : {}
    return Boolean(metadata.versions?.[version])
  }

  const npmrc = `${PublicPackage.SCOPE}:registry=${PublicPackage.REGISTRY}\n${PublicPackage.REGISTRY.replace(/^https:/, "")}:_authToken=\${NODE_AUTH_TOKEN}\n`
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-npm-release-"))
  try {
    if (await isPublished()) {
      log(`${PublicPackage.NAME}@${version} already published; skipping publish`)
    } else {
      const stage = path.join(directory, "package")
      await cp(path.join(cwd, "dist"), path.join(stage, "dist"), { recursive: true })
      await cp(path.join(cwd, "README.md"), path.join(stage, "README.md"))
      await Bun.write(
        path.join(stage, "package.json"),
        JSON.stringify(
          {
            ...manifest,
            name: PublicPackage.NAME,
            repository: { type: "git", url: PublicPackage.REPOSITORY },
            scripts: {},
            devDependencies: {},
            publishConfig: { access: "public", registry: PublicPackage.REGISTRY }
          },
          null,
          2
        )
      )
      await Bun.write(path.join(stage, ".npmrc"), npmrc)
      const publication = spawn(
        ["npm", "publish", "--access", "public", "--tag", PublicPackage.CHANNEL, "--registry", PublicPackage.REGISTRY],
        { cwd: stage, stdout: "inherit", stderr: "inherit" }
      )
      if (publication.exitCode !== 0) throw new Error("Package publication failed")
      let visible = false
      for (let attempt = 0; attempt < 12 && !visible; attempt++) {
        if (attempt > 0) await Bun.sleep(retryDelayMs)
        visible = await isPublished()
      }
      if (!visible) throw new Error("Published version is not visible on the registry")
    }

    const fixture = path.join(directory, "fixture")
    await Bun.write(path.join(fixture, ".npmrc"), npmrc)
    await Bun.write(
      path.join(fixture, "package.json"),
      JSON.stringify({
        private: true,
        dependencies: { [PublicPackage.NAME]: version, react: "^19", "react-dom": "^19" }
      })
    )
    const install = spawn(["bun", "install", "--ignore-scripts"], {
      cwd: fixture,
      stdout: "inherit",
      stderr: "inherit"
    })
    if (install.exitCode !== 0) throw new Error("Registry install failed")
    const verify = spawn(
      [
        "bun",
        "-e",
        `const ui = await import("${PublicPackage.NAME}"); if (!ui.Button) throw new Error("Missing package export")`
      ],
      { cwd: fixture, stdout: "inherit", stderr: "inherit" }
    )
    if (verify.exitCode !== 0) throw new Error("Registry import failed")

    await Bun.write(
      path.join(cwd, PublicPackage.NOTE_FILE),
      `${note}\n\n---\n\nAdd to \`.npmrc\` (any GitHub token with \`read:packages\`):\n\n\`\`\`ini\n${PublicPackage.SCOPE}:registry=${PublicPackage.REGISTRY}\n//npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}\n\`\`\`\n\n\`\`\`sh\nnpm install ${PublicPackage.NAME}@${version}\n\`\`\`\n`
    )
    if (env.GITHUB_OUTPUT) await appendFile(env.GITHUB_OUTPUT, `version=${version}\nrelease=true\n`)
    log(`Verified ${PublicPackage.NAME}@${version}`)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

if (import.meta.main) await publishNpm()
