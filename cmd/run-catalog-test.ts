/**
 * Orchestrates the Bun.WebView catalog browser suite: builds the static catalog, starts a
 * Vite preview server, waits for it to accept connections, runs `bun test test/browser`
 * against it, and always tears the preview server down. `bun test` has no built-in dev-server
 * lifecycle, so this orchestrator owns start/stop of the preview server.
 */
import path from "node:path"

const root = path.resolve(import.meta.dir, "..")
const port = Number(process.env.CATALOG_PORT ?? 6007)
const baseUrl = `http://127.0.0.1:${port}`

const build = Bun.spawnSync(["bun", "catalog:build"], { cwd: root, stdout: "inherit", stderr: "inherit" })
if (build.exitCode !== 0) process.exit(build.exitCode ?? 1)

const preview = Bun.spawn(
  [
    "bunx",
    "vite",
    "preview",
    "--config",
    "vite.config.ts",
    "--port",
    String(port),
    "--strictPort",
    "--host",
    "127.0.0.1"
  ],
  { cwd: root, stdout: "ignore", stderr: "inherit" }
)

let exitCode = 1
try {
  await waitForServer(baseUrl)
  const args = process.argv.slice(2)
  const test = Bun.spawnSync(["bun", "test", "--timeout", "30000", ...(args.length > 0 ? args : ["./test/browser"])], {
    cwd: root,
    stdout: "inherit",
    stderr: "inherit",
    env: { ...process.env, CATALOG_URL: baseUrl }
  })
  exitCode = test.exitCode ?? 1
} finally {
  preview.kill()
}

process.exit(exitCode)

async function waitForServer(url: string): Promise<void> {
  for (let attempt = 0; attempt < 200; attempt++) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {}
    await Bun.sleep(50)
  }
  throw new Error(`Timed out waiting for ${url}`)
}
