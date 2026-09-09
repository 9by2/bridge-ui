import { expect, test } from "bun:test"
import path from "node:path"

import { renderToStaticMarkup } from "react-dom/server"

test("brand multiselect value retains placeholder and badge styling", async () => {
  const build = Bun.spawnSync([process.execPath, "cmd/build-package.ts"], { stdout: "pipe", stderr: "pipe" })
  expect(build.exitCode, build.stderr.toString()).toBe(0)
  const { MultiSelect, MultiSelectValue } = await import(path.resolve("dist/index.js"))
  const placeholder = renderToStaticMarkup(
    <MultiSelect>
      <MultiSelectValue placeholder="Choose team" />
    </MultiSelect>
  )
  expect(placeholder).toContain("Choose team")
  const value = renderToStaticMarkup(
    <MultiSelect defaultValues={["design"]}>
      <MultiSelectValue className="custom-value" />
    </MultiSelect>
  )
  expect(value).toContain('data-slot="badge"')
  expect(value).not.toContain("bg-primary")
  expect(value).toContain("custom-value")
})
