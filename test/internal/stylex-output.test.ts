import { expect, test } from "bun:test"

test("promoted package output is precompiled and includes scoped adapter", async () => {
  const build = Bun.spawnSync([process.execPath, "cmd/build-package.ts"], { stdout: "pipe", stderr: "pipe" })
  expect(build.exitCode, build.stderr.toString()).toBe(0)

  const css = await Bun.file("dist/style.css").text()
  expect(css).toContain('[data-pilot-theme] [data-slot="badge"] svg')
  expect(css).not.toContain('@import "tailwindcss"')
  expect(css).not.toContain("--tw-")
  expect(css).toContain(":root, .xu2yawi")
  expect(css).toContain(".xbpea0i.xbpea0i")

  for (const file of new Bun.Glob("dist/component/brand/stylex/*.js").scanSync()) {
    const output = await Bun.file(file).text()
    expect(output, file).not.toContain("stylex.create(")
    expect(output, file).not.toContain("runtimeInjection")
  }
})
