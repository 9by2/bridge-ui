import { mkdtemp, rm, writeFile } from "node:fs/promises"
import path from "node:path"

const directory = await mkdtemp(path.resolve(".tree-shaking-"))
try {
  for (const entry of ["dist/index.js", "dist/component/shadcn/button.js"]) {
    const file = path.join(directory, "consumer.ts")
    await writeFile(file, `import { Button } from ${JSON.stringify(path.resolve(entry))}; console.log(Button);`)
    const result = await Bun.build({
      entrypoints: [file],
      target: "browser",
      minify: true,
      external: ["react", "react-dom", "react/jsx-runtime"]
    })
    if (!result.success) throw new Error(String(result.logs))
    const output = await result.outputs[0]?.text()
    if (!output) throw new Error("Missing consumer bundle")
    for (const token of ["ts-chart", "recharts", "DropArea", "react-dropzone", "premium-kpi", "ChartContainer"]) {
      if (output.includes(token)) throw new Error(`${entry} retained ${token}`)
    }
    if (output.length > 150_000) throw new Error(`${entry} exceeded Button bundle budget: ${output.length}`)
    console.log(`${entry}: ${output.length} byte Button-only bundle; no chart or upload runtime`)
  }
} finally {
  await rm(directory, { recursive: true, force: true })
}
