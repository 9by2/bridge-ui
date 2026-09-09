import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import path from "node:path"
import { gzipSync } from "node:zlib"

import { createPackageStylexPlugin } from "../internal/package-stylex"

const temporary = await mkdtemp(path.resolve(".stylex-contract-"))
try {
  const reports = []
  for (const candidate of [false, true]) {
    const result = await Bun.build({
      entrypoints: [candidate ? "internal/pilot/button.tsx" : "dist/component/shadcn/button.js"],
      outdir: path.join(temporary, candidate ? "candidate" : "baseline"),
      target: "browser",
      format: "esm",
      minify: true,
      metafile: true,
      jsx: { development: false },
      external: ["react", "react-dom", "react/jsx-runtime"],
      plugins: candidate
        ? [
            createPackageStylexPlugin({
              dev: false,
              runtimeInjection: false,
              useCSSLayers: true,
              bunDevCssOutput: path.join(temporary, "style.css")
            })
          ]
        : []
    })
    assert(result.success, String(result.logs))
    assert(result.metafile)
    const js = await result.outputs.find((file) => file.path.endsWith(".js"))?.text()
    assert(js)
    const gzip = gzipSync(js).byteLength
    assert(gzip <= 18_000, `Button gzip budget exceeded: ${gzip}`)
    const retained = Object.values(result.metafile.outputs).flatMap((file) =>
      Object.entries(file.inputs)
        .filter(([, input]) => input.bytesInOutput > 0)
        .map(([name]) => name)
    )
    assert(!retained.some((name) => /node_modules\/(effect|recharts|react-dropzone|@tanstack)/.test(name)))
    const css = candidate
      ? (await Bun.file(path.join(temporary, "style.css")).text()) +
        (await Bun.file("internal/pilot/adapter.css").text())
      : await Bun.file("dist/style.css").text()
    reports.push({ candidate, js: js.length, gzip, css: css.length, cssGzip: gzipSync(css).byteLength, retained })
  }
  await Bun.write(".eval/0908-stylex-foundation/budget.json", JSON.stringify(reports, null, 2))
  console.log(reports.map(({ retained, ...report }) => report))
} finally {
  await rm(temporary, { recursive: true, force: true })
}
