/**
 * Orchestrates the Bun.WebView catalog browser suite: builds the static catalog, starts a
 * Bun static server, runs the browser suite in bounded parallel workers, and always stops the
 * server. `bun test` has no built-in server lifecycle, so this orchestrator owns it.
 */
import path from "node:path"

const root = path.resolve(import.meta.dir, "..")
const port = Number(process.env.CATALOG_PORT ?? 6007)
const baseUrl = `http://127.0.0.1:${port}`
const catalogDist = path.join(root, "catalog-dist")

const build = Bun.spawnSync(["bun", "catalog:build"], { cwd: root, stdout: "inherit", stderr: "inherit" })
if (build.exitCode !== 0) process.exit(build.exitCode ?? 1)

const server = Bun.serve({
  hostname: "127.0.0.1",
  port,
  async fetch(request) {
    const url = new URL(request.url)
    const relativePath = url.pathname === "/" ? "index.html" : url.pathname.slice(1)
    const filePath = path.resolve(catalogDist, relativePath)
    if (!filePath.startsWith(`${catalogDist}${path.sep}`)) return new Response("Not found", { status: 404 })
    const file = Bun.file(filePath)
    if (await file.exists()) return new Response(file)
    if (!path.extname(relativePath)) return new Response(Bun.file(path.join(catalogDist, "index.html")))
    return new Response("Not found", { status: 404 })
  }
})

let exitCode = 1
try {
  const args = process.argv.slice(2)
  const test = Bun.spawn(
    ["bun", "test", "--timeout", "30000", "--parallel=2", ...(args.length > 0 ? args : ["./test/browser"])],
    { cwd: root, stdout: "inherit", stderr: "inherit", env: { ...process.env, CATALOG_URL: baseUrl } }
  )
  exitCode = await test.exited
} finally {
  server.stop(true)
}

process.exit(exitCode)
