import { mkdtemp, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { gzipSync } from "node:zlib"

const directory = await mkdtemp(path.resolve(".tree-shaking-"))
try {
  for (const entry of ["dist/index.js", "dist/component/brand/stylex/button.js"]) {
    const file = path.join(directory, "consumer.ts")
    await writeFile(file, `import { Button } from ${JSON.stringify(path.resolve(entry))}; console.log(Button);`)
    const result = await Bun.build({
      entrypoints: [file],
      target: "browser",
      minify: true,
      metafile: true,
      external: ["react", "react-dom", "react/jsx-runtime"]
    })
    if (!result.success) throw new Error(String(result.logs))
    const output = await result.outputs[0]?.text()
    if (!output) throw new Error("Missing consumer bundle")
    if (!result.metafile) throw new Error("Missing consumer dependency graph")
    const retained = Object.values(result.metafile.outputs).flatMap((chunk) =>
      Object.entries(chunk.inputs)
        .filter(([, input]) => input.bytesInOutput > 0)
        .map(([name]) => name)
    )
    if (!retained.some((name) => name.includes("@base-ui"))) throw new Error("Missing Button dependency evidence")
    for (const name of retained) {
      if (/@tanstack|recharts|react-dropzone|d3-|chart|drop-area/.test(name))
        throw new Error(`${entry} retained unrelated dependency: ${name}`)
    }
    const compressed = gzipSync(output).byteLength
    if (compressed > 18_000) throw new Error(`${entry} exceeded gzip budget: ${compressed}`)
    for (const token of ["ts-chart", "recharts", "DropArea", "react-dropzone", "premium-kpi", "ChartContainer"]) {
      if (output.includes(token)) throw new Error(`${entry} retained ${token}`)
    }
    if (output.length > 150_000) throw new Error(`${entry} exceeded Button bundle budget: ${output.length}`)
    console.log(
      `${entry}: ${output.length} byte / ${compressed} gzip byte; ${retained.length} retained module; no chart or upload runtime`
    )
  }
  const directEntry = [
    { entry: "dist/component/brand/stylex/sonner.js", name: ["Toaster", "toast"], evidence: "sonner" },
    { entry: "dist/component/brand/stylex/spinner.js", name: ["Spinner"], evidence: "lucide-react" }
  ] as const
  for (const item of directEntry) {
    const file = path.join(directory, "direct.ts")
    await writeFile(
      file,
      `import { ${item.name.join(", ")} } from ${JSON.stringify(path.resolve(item.entry))}; console.log(${item.name.join(", ")});`
    )
    const result = await Bun.build({
      entrypoints: [file],
      target: "browser",
      minify: true,
      metafile: true,
      external: ["react", "react-dom", "react/jsx-runtime"]
    })
    if (!result.success || !result.metafile) throw new Error(String(result.logs))
    const retained = Object.values(result.metafile.outputs).flatMap((chunk) =>
      Object.entries(chunk.inputs)
        .filter(([, input]) => input.bytesInOutput > 0)
        .map(([name]) => name)
    )
    if (!retained.some((name) => name.includes(item.evidence)))
      throw new Error(`${item.entry} missing ${item.evidence} evidence`)
    for (const name of retained) {
      if (/@tanstack|recharts|react-dropzone|d3-|chart|drop-area|@base-ui\/react\/toast/.test(name))
        throw new Error(`${item.entry} retained unrelated dependency: ${name}`)
    }
    console.log(`${item.entry}: ${retained.length} retained module; no chart, upload or Base UI toast runtime`)
  }
} finally {
  await rm(directory, { recursive: true, force: true })
}
