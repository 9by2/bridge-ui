/**
 * Orchestrates the Bun.WebView catalog browser suite: builds the static catalog, starts a
 * Bun static server, runs the browser suite in bounded parallel workers, and always stops the
 * server. `bun test` has no built-in server lifecycle, so this orchestrator owns it.
 */
import path from "node:path"

const root = path.resolve(import.meta.dir, "..")
const port = Number(process.env.CATALOG_PORT ?? 6007)
const catalogDist = path.join(root, "catalog-dist")
const BrowserContractFile = [
  "./test/browser/catalog.test.ts",
  "./test/browser/accessibility.test.ts",
  "./test/browser/render-pipeline.test.ts",
  "./test/browser/menu-focus.test.ts",
  "./test/browser/upload-composition.test.ts",
  "./test/browser/consumer-replacement.test.ts",
  "./test/browser/responsive.test.ts",
  "./test/browser/bridge-calendar.test.ts",
  "./test/browser/nested-text-size.test.ts",
  "./test/browser/consumer-parity.test.ts",
  "./test/browser/prototype.test.ts",
  "./test/browser/rich-content-parity.test.ts",
  "./test/browser/content-video-media.test.ts",
  "./test/browser/document-content.test.ts"
] as const

// Catalog, packed package output, and the independent consumer fixture that renders from dist/.
for (const command of [
  ["bun", "catalog:build"],
  ["bun", "run", "build"],
  ["bunx", "--bun", "vite", "build", "--config", "test/fixture/consumer-parity/vite.config.ts"]
]) {
  const build = Bun.spawnSync(command, { cwd: root, stdout: "inherit", stderr: "inherit" })
  if (build.exitCode !== 0) process.exit(build.exitCode ?? 1)
}
const consumerDist = path.join(root, "test-results/consumer-parity")

function serveStatic(directory: string, listenPort: number) {
  return Bun.serve({
    hostname: "127.0.0.1",
    port: listenPort,
    async fetch(request) {
      const url = new URL(request.url)
      const relativePath = url.pathname === "/" ? "index.html" : url.pathname.slice(1)
      const filePath = path.resolve(directory, relativePath)
      if (!filePath.startsWith(`${directory}${path.sep}`)) return new Response("Not found", { status: 404 })
      const file = Bun.file(filePath)
      if (await file.exists()) return new Response(file)
      if (!path.extname(relativePath)) return new Response(Bun.file(path.join(directory, "index.html")))
      return new Response("Not found", { status: 404 })
    }
  })
}
const server = serveStatic(catalogDist, port)
const consumerServer = serveStatic(consumerDist, 0)
const baseUrl = `http://127.0.0.1:${server.port}`

let exitCode = 1
try {
  const args = process.argv.slice(2)
  const test = Bun.spawn(
    ["bun", "test", "--timeout", "30000", "--parallel=2", ...(args.length > 0 ? args : BrowserContractFile)],
    {
      cwd: root,
      stdout: "inherit",
      stderr: "inherit",
      env: { ...process.env, CATALOG_URL: baseUrl, CONSUMER_URL: `http://127.0.0.1:${consumerServer.port}` }
    }
  )
  exitCode = await test.exited
} finally {
  server.stop(true)
  consumerServer.stop(true)
}

process.exit(exitCode)
