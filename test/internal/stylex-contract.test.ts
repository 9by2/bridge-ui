import { expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import path from "node:path"

import stylex from "@stylexjs/unplugin"
import { build } from "vite"

import { createPackageStylexPlugin } from "../../internal/package-stylex"

test("installed compiler extracts token, theme, state, media and motion without consumer transform", async () => {
  const temporary = await mkdtemp(path.resolve(".stylex-contract-"))
  try {
    const result = await Bun.build({
      entrypoints: [
        path.resolve("test/fixture/stylex-contract/entry.tsx"),
        path.resolve("test/fixture/stylex-contract/token.stylex.ts")
      ],
      outdir: temporary,
      target: "browser",
      format: "esm",
      jsx: { development: false },
      external: ["react", "react/jsx-runtime", "@stylexjs/stylex"],
      plugins: [
        createPackageStylexPlugin({
          dev: false,
          runtimeInjection: false,
          useCSSLayers: true,
          bunDevCssOutput: path.join(temporary, "style.css")
        })
      ]
    })
    expect(result.success, String(result.logs)).toBe(true)
    const css = await Bun.file(path.join(temporary, "style.css")).text()
    expect(css).toMatch(/--[\w-]+:\s*#fff;[\s\S]*--[\w-]+:\s*#141414;/)
    for (const value of ["@layer", ":disabled", ":focus-visible", "400px", "prefers-reduced-motion", "@keyframes"])
      expect(css).toContain(value)
    const js = await Bun.file(path.join(temporary, "entry.js")).text()
    expect(js).not.toContain("stylex.create(")
    expect(js).not.toContain("jsxDEV")
    const run = Bun.spawnSync(
      [
        process.execPath,
        "-e",
        `
      import { renderToString } from 'react-dom/server';
      import { createElement } from 'react';
      const { Contract } = await import(${JSON.stringify(path.join(temporary, "entry.js"))});
      console.log(renderToString(createElement(Contract, { isDark: true, width: 137 })));
    `
      ],
      { env: { ...process.env, NODE_ENV: "production" }, stdout: "pipe", stderr: "pipe" }
    )
    expect(run.exitCode, run.stderr.toString()).toBe(0)
    expect(run.stdout.toString()).toContain("Contract")
    expect(run.stdout.toString()).toContain("137")
    await build({
      configFile: false,
      plugins: [stylex.vite({ dev: false, runtimeInjection: false, useCSSLayers: true })],
      build: {
        outDir: path.join(temporary, "vite"),
        lib: { entry: path.resolve("test/fixture/stylex-contract/entry.tsx"), formats: ["es"], fileName: "entry" },
        rollupOptions: { external: ["react", "react/jsx-runtime", "@stylexjs/stylex"] }
      }
    })
    const cssFiles = [...new Bun.Glob("**/*.css").scanSync({ cwd: path.join(temporary, "vite") })]
    expect(cssFiles.length).toBeGreaterThan(0)
    const viteCss = (
      await Promise.all(cssFiles.map((file) => Bun.file(path.join(temporary, "vite", file)).text()))
    ).join("\n")
    for (const value of ["@layer", ":disabled", ":focus-visible", "400px", "prefers-reduced-motion", "@keyframes"])
      expect(viteCss).toContain(value)
    expect(viteCss).toMatch(/--[\w-]+:\s*#fff;[\s\S]*--[\w-]+:\s*#141414;/)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}, 120_000)
