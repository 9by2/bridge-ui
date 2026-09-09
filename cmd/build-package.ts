import { cp, rm, writeFile } from "node:fs/promises"
import path from "node:path"

import tailwind from "bun-plugin-tailwind"

import { createPackageStylexPlugin } from "../internal/package-stylex"

const root = path.resolve(import.meta.dir, "..")
const outdir = path.join(root, "dist")
await rm(outdir, { force: true, recursive: true })

const manifest = await Bun.file(path.join(root, "package.json")).json()
const external = [...Object.keys(manifest.dependencies ?? {}), ...Object.keys(manifest.peerDependencies ?? {})]
const componentPaths = [...new Bun.Glob("app/component/brand/*.tsx").scanSync({ cwd: root })]
const stylexPaths = [...new Bun.Glob("app/component/brand/stylex/*.{ts,tsx}").scanSync({ cwd: root })].filter(
  (file) => !file.endsWith("/use-mobile.ts")
)
const result = await Bun.build({
  entrypoints: [
    path.join(root, "app/index.ts"),
    path.join(root, "app/style/component.css"),
    ...componentPaths.map((file) => path.join(root, file)),
    ...stylexPaths.map((file) => path.join(root, file))
  ],
  root: path.join(root, "app"),
  splitting: true,
  external,
  format: "esm",
  jsx: { development: false },
  naming: {
    asset: "[name].[ext]",
    chunk: "[name]-[hash].[ext]",
    entry: "[dir]/[name].[ext]"
  },
  outdir,
  plugins: [
    createPackageStylexPlugin({
      dev: false,
      enableMediaQueryOrder: false,
      runtimeInjection: false,
      bunDevCssOutput: path.join(outdir, "stylex.css")
    }),
    tailwind
  ],
  sourcemap: "linked",
  target: "browser"
})

if (!result.success) {
  for (const log of result.logs) console.error(log)
  process.exit(1)
}

await cp(path.join(outdir, "style/component.css"), path.join(outdir, "style.css"))
const extracted = await Bun.file(path.join(outdir, "stylex.css")).text()
if (!/min-height:\s*10rem/.test(extracted)) throw new Error("Missing extracted StyleX presentation")
await writeFile(
  path.join(outdir, "style.css"),
  `${await Bun.file(path.join(outdir, "style.css")).text()}\n${extracted}\n${await Bun.file(path.join(root, "app/component/brand/stylex/adapter.css")).text()}`
)
await rm(path.join(outdir, "stylex.css"))
await rm(path.join(outdir, "style/component.css"))
await writeFile(path.join(outdir, "style.css.d.ts"), "declare const stylesheet: string\nexport default stylesheet\n")

const declaration = Bun.spawnSync(["bun", "node_modules/typescript/bin/tsc", "-p", "tsconfig.build.json"], {
  cwd: root,
  stderr: "inherit",
  stdout: "inherit"
})
if (declaration.exitCode !== 0) process.exit(declaration.exitCode)

// Declaration emission preserves source alias, which is not a public package export.
for (const file of new Bun.Glob("**/*.d.ts").scanSync({ cwd: outdir })) {
  const target = path.join(outdir, file)
  const content = await Bun.file(target).text()
  await writeFile(
    target,
    content.replaceAll(/(["'])@bridge\/ui\/app\/([^"']+)\1/g, (_, quote, modulePath) => {
      const relative = path.relative(path.dirname(target), path.join(outdir, modulePath))
      return `${quote}${relative.startsWith(".") ? relative : `./${relative}`}${quote}`
    })
  )
}
