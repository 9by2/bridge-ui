import { cp, rm, writeFile } from "node:fs/promises"
import path from "node:path"

import tailwind from "bun-plugin-tailwind"

const root = path.resolve(import.meta.dir, "../..")
const outdir = path.join(root, "dist")
await rm(outdir, { force: true, recursive: true })

const manifest = await Bun.file(path.join(root, "package.json")).json()
const external = [...Object.keys(manifest.dependencies ?? {}), ...Object.keys(manifest.peerDependencies ?? {})]
const componentPaths = [...new Bun.Glob("app/component/{shadcn,brand}/*.tsx").scanSync({ cwd: root })]
const result = await Bun.build({
  entrypoints: [
    path.join(root, "app/index.ts"),
    path.join(root, "app/style/global.css"),
    ...componentPaths.map((file) => path.join(root, file))
  ],
  root: path.join(root, "app"),
  splitting: true,
  external,
  format: "esm",
  naming: {
    asset: "[name].[ext]",
    chunk: "[name]-[hash].[ext]",
    entry: "[dir]/[name].[ext]"
  },
  outdir,
  plugins: [tailwind],
  sourcemap: "linked",
  target: "browser"
})

if (!result.success) {
  for (const log of result.logs) console.error(log)
  process.exit(1)
}

await cp(path.join(outdir, "style/global.css"), path.join(outdir, "style.css"))
await rm(path.join(outdir, "style/global.css"))
await writeFile(path.join(outdir, "style.css.d.ts"), "declare const stylesheet: string\nexport default stylesheet\n")

const declaration = Bun.spawnSync(["bunx", "--bun", "tsgo", "-p", "tsconfig.build.json"], {
  cwd: root,
  stderr: "inherit",
  stdout: "inherit"
})
if (declaration.exitCode !== 0) process.exit(declaration.exitCode)
