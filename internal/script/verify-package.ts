import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const root = path.resolve(import.meta.dir, "../..")
const fixtureRoot = await mkdtemp(path.join(tmpdir(), "bridge-ui-package-"))

try {
  run(["bun", "run", "build"], root)
  run(["bun", "pm", "pack", "--ignore-scripts", "--destination", fixtureRoot, "--quiet"], root)
  const tarballName = [...new Bun.Glob("*.tgz").scanSync({ cwd: fixtureRoot })][0]
  if (!tarballName) throw new Error("Package tarball was not created")
  const tarball = path.join(fixtureRoot, tarballName)

  const entries = run(["tar", "-tzf", tarball], root).stdout
  const forbiddenEntry = entries
    .split("\n")
    .filter(Boolean)
    .find((entry) => !entry.match(/^package\/(?:README\.md|package\.json|dist\/)/))
  if (forbiddenEntry) throw new Error(`Tarball contains forbidden entry: ${forbiddenEntry}`)

  await verifyClient(path.join(fixtureRoot, "client"), tarball)
  await verifySsr(path.join(fixtureRoot, "ssr"), tarball)
} finally {
  await rm(fixtureRoot, { force: true, recursive: true })
}

async function verifyClient(fixture: string, packageTarball: string): Promise<void> {
  await writeFixture(fixture, packageTarball, {
    "index.html": '<div id="root"></div><script type="module" src="/src/main.tsx"></script>\n',
    "src/main.tsx": `
import { Button, Input } from "@bridge/ui"
import "@bridge/ui/style.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")!).render(
  <StrictMode><Button>Continue</Button><Input aria-label="Name" /></StrictMode>
)
`
  })

  run(["bun", "install", "--ignore-scripts"], fixture)
  run(["bunx", "--bun", "tsc", "--noEmit"], fixture)
  run(["bunx", "--bun", "vite", "build"], fixture)
}

async function verifySsr(fixture: string, packageTarball: string): Promise<void> {
  await writeFixture(fixture, packageTarball, {
    "src/entry-server.tsx": `
import { Button } from "@bridge/ui"
import { renderToString } from "react-dom/server"

export const html = renderToString(<Button>Continue</Button>)
`
  })

  run(["bun", "install", "--ignore-scripts"], fixture)
  run(["bunx", "--bun", "tsc", "--noEmit"], fixture)
  run(["bunx", "--bun", "vite", "build", "--ssr", "src/entry-server.tsx"], fixture)
}

async function writeFixture(
  fixture: string,
  packageTarball: string,
  fileByPath: Readonly<Record<string, string>>
): Promise<void> {
  await mkdir(fixture, { recursive: true })
  const manifest = {
    private: true,
    type: "module",
    dependencies: {
      "@bridge/ui": `file:${packageTarball}`,
      react: "^19",
      "react-dom": "^19"
    },
    devDependencies: {
      "@types/react": "^19",
      "@types/react-dom": "^19",
      typescript: "^7",
      vite: "^7.3.1"
    }
  }
  await writeFile(path.join(fixture, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`)
  await writeFile(
    path.join(fixture, "tsconfig.json"),
    `${JSON.stringify(
      {
        compilerOptions: {
          jsx: "react-jsx",
          lib: ["ESNext", "DOM"],
          module: "ESNext",
          moduleResolution: "Bundler",
          skipLibCheck: true,
          strict: true,
          target: "ESNext"
        },
        include: ["src"]
      },
      null,
      2
    )}\n`
  )

  await Promise.all(
    Object.entries(fileByPath).map(async ([filePath, content]) => {
      const absolutePath = path.join(fixture, filePath)
      await mkdir(path.dirname(absolutePath), { recursive: true })
      await writeFile(absolutePath, content.trimStart())
    })
  )
}

function run(command: string[], cwd: string): { stdout: string } {
  const result = Bun.spawnSync(command, { cwd, stderr: "inherit", stdout: "pipe" })
  const stdout = result.stdout.toString()
  if (result.exitCode !== 0) {
    if (stdout) console.error(stdout)
    throw new Error(`Command failed: ${command.join(" ")}`)
  }
  return { stdout }
}
