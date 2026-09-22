import { expect, test } from "bun:test"

test("compiler command resolves an installed TypeScript executable", async () => {
  const manifest = await Bun.file("package.json").json()
  const compiler = await Bun.file("node_modules/typescript/package.json").json()
  expect(compiler.bin.tsc).toBeDefined()
  expect(manifest.scripts.typecheck).toBe("bun node_modules/typescript/bin/tsc --noEmit")
  expect(await Bun.file("cmd/build-package.ts").text()).not.toContain('"tsgo"')
})

test("release refuses local execution without protected default branch context", () => {
  const result = Bun.spawnSync(["bun", "cmd/publish-package.ts"], {
    env: { ...process.env, CI_COMMIT_TAG: "v0.1.0", CI_COMMIT_REF_PROTECTED: "false" },
    stdout: "pipe",
    stderr: "pipe"
  })
  expect(result.exitCode).not.toBe(0)
  expect(result.stderr.toString()).toContain("Protected default branch required")
})

test("release automation runs after verification on protected default branch only", async () => {
  const ci = await Bun.file("deployment/.gitlab-ci.yml").text()
  expect(ci).toContain('CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH && $CI_COMMIT_REF_PROTECTED == "true"')
  expect(ci).toContain("INPUT_VERSION: bun release:version")
  expect(ci).toContain("INPUT_PUBLISH: bun release:publish")
  expect(ci).not.toContain("when: manual")
  const root = await Bun.file(".gitlab-ci.yml").text()
  expect(root).toContain('".changeset/**/*"')
})

test("child verification explicitly accepts an MR parent pipeline", async () => {
  const ci = await Bun.file("deployment/.gitlab-ci.yml").text()
  for (const job of ["source", "coverage"]) {
    expect(ci).toContain(`${job}:\n  stage: verify\n  rules:\n    - if: '$CI_PIPELINE_SOURCE == "parent_pipeline"'`)
  }
  expect(ci).toContain('catalog:\n  stage: verify\n  rules:\n    - if: \'$CI_PIPELINE_SOURCE == "parent_pipeline"')
})
