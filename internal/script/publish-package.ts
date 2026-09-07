import { cp, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const tag = process.env.CI_COMMIT_TAG ?? ""
if (process.env.CI_COMMIT_REF_PROTECTED !== "true" || !/^v\d+\.\d+\.\d+-[0-9A-Za-z.-]+$/.test(tag)) {
  throw new Error("Protected prerelease tag required")
}
const manifest = await Bun.file("package.json").json()
if (tag !== `v${manifest.version}`) throw new Error("Tag must match package version")
const { CI_API_V4_URL, CI_PROJECT_ID, CI_JOB_TOKEN } = process.env
if (!CI_API_V4_URL || !CI_PROJECT_ID || !CI_JOB_TOKEN) throw new Error("GitLab job context required")
const registry = `${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/packages/npm/`
if (new URL(registry).protocol !== "https:") throw new Error("HTTPS registry required")
const directory = await mkdtemp(path.join(tmpdir(), "bridge-release-"))
const npmrc = `@bridge:registry=${registry}\n${registry.replace(/^https:/, "")}:_authToken=\${CI_JOB_TOKEN}\n`
try {
  await cp("dist", path.join(directory, "dist"), { recursive: true })
  await Bun.write(
    path.join(directory, "package.json"),
    JSON.stringify({ ...manifest, scripts: {}, devDependencies: {}, publishConfig: { registry, tag: "next" } })
  )
  await Bun.write(path.join(directory, ".npmrc"), npmrc)
  const publish = Bun.spawnSync(["bun", "publish", "--tag", "next", "--registry", registry], {
    cwd: directory,
    stdout: "inherit",
    stderr: "inherit"
  })
  if (publish.exitCode !== 0) throw new Error("Package publication failed")
  const fixture = path.join(directory, "fixture")
  await Bun.write(
    path.join(fixture, "package.json"),
    JSON.stringify({
      private: true,
      dependencies: { "@bridge/ui": manifest.version, react: "^19", "react-dom": "^19" }
    })
  )
  await Bun.write(path.join(fixture, ".npmrc"), npmrc)
  const install = Bun.spawnSync(["bun", "install", "--ignore-scripts"], {
    cwd: fixture,
    stdout: "inherit",
    stderr: "inherit"
  })
  if (install.exitCode !== 0) throw new Error("Registry install failed; package may already be published")
  const verify = Bun.spawnSync(
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
