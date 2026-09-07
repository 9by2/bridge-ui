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
  const installed = path.join(fixture, "node_modules/@bridge/ui")
  const manifest = await Bun.file(path.join(installed, "package.json")).json()
  const imports: string[] = []
  for (const [key, value] of Object.entries(manifest.exports)) {
    if (!value || typeof value !== "object" || !("types" in value) || typeof value.types !== "string")
      throw new Error(`Missing declaration export: ${key}`)
    const targets = [...new Bun.Glob(value.types).scanSync({ cwd: installed })]
    if (!targets.length) throw new Error(`Missing declaration target: ${key}`)
    for (const target of targets) {
      const prefix = value.types.split("*")[0] ?? ""
      const suffix = value.types.split("*")[1] ?? ""
      const name = key.includes("*")
        ? key.replace("*", target.slice(prefix.length, suffix ? -suffix.length : undefined))
        : key
      imports.push(name === "." ? "@bridge/ui" : `@bridge/ui/${name.slice(2)}`)
    }
  }
  await writeFile(
    path.join(fixture, "src/export.ts"),
    imports
      .map((name, index) => `import * as entry${index} from ${JSON.stringify(name)}; console.log(entry${index});`)
      .join("\n")
  )
  run(["bunx", "--bun", "tsc", "--noEmit"], fixture)
  for (const name of imports.filter((entry) => !entry.endsWith(".css"))) {
    run(["bun", "-e", `await import(${JSON.stringify(name)})`], fixture)
  }
  console.log(`Verified ${imports.length} installed public entry with declaration checking`)
  run(["bunx", "--bun", "vite", "build"], fixture)
}

async function verifySsr(fixture: string, packageTarball: string): Promise<void> {
  await writeFixture(fixture, packageTarball, {
    "src/entry-server.tsx": `
import { Button } from "@bridge/ui/button"
import { TsChart } from "@bridge/ui/ts-chart"
import { DropArea } from "@bridge/ui/drop-area"
import { renderToString } from "react-dom/server"

export const html = renderToString(<Button>Continue</Button>)
export const component = { TsChart, DropArea }
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
          skipLibCheck: false,
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
