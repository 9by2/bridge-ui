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
  expect(ci).toContain('INPUT_COMMIT: "chore: version package"')
  const releaseJobEnd = ci.indexOf("\n\npromote:")
  expect(releaseJobEnd).toBeGreaterThan(0)
  expect(ci.slice(0, releaseJobEnd)).not.toContain("when: manual")
  const root = await Bun.file(".gitlab-ci.yml").text()
  expect(root).toContain('".changeset/**/*"')
})

test("child verification explicitly accepts an MR parent pipeline", async () => {
  const ci = await Bun.file("deployment/.gitlab-ci.yml").text()
  for (const job of ["source", "coverage"]) {
    expect(ci).toContain(`${job}:\n  stage: verify\n  rules:\n    - if: '$CI_PIPELINE_SOURCE == "parent_pipeline"`)
    expect(ci).toContain(`    - if: '$CI_PIPELINE_SOURCE == "parent_pipeline"'\n  script:`)
  }
  expect(ci).toContain('catalog:\n  stage: verify\n  rules:\n    - if: \'$CI_PIPELINE_SOURCE == "parent_pipeline"')
})

test("source and coverage skip the version-only release-automation merge commit on protected main", async () => {
  const ci = await Bun.file("deployment/.gitlab-ci.yml").text()
  const skipRule =
    '$CI_PIPELINE_SOURCE == "parent_pipeline" && $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH && $CI_COMMIT_REF_PROTECTED == "true" && $CI_COMMIT_TITLE =~ /^chore: version package( \\(rc\\))?$/'
  for (const job of ["source", "coverage"]) {
    expect(ci).toContain(`${job}:\n  stage: verify\n  rules:\n    - if: '${skipRule}'\n      when: never`)
  }
  // Skip condition title must stay in sync with the automation's actual commit title.
  expect(ci).toContain('INPUT_COMMIT: "chore: version package"')
  // The release MR's own merge-request pipeline is unaffected: its branch is never $CI_DEFAULT_BRANCH.
  expect(ci).toContain("$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH && $CI_COMMIT_REF_PROTECTED")
  // The release job's protected-branch gate is untouched by the fast path.
  expect(ci).toContain("release:\n  stage: deploy\n  resource_group: package-release\n  variables:\n    GIT_DEPTH:")
})

test("main carries permanent RC pre-release mode", async () => {
  const pre = await Bun.file(".changeset/pre.json").json()
  expect(pre.mode).toBe("pre")
  expect(pre.tag).toBe("rc")
})

test("promote is a manual job gated identically to release, and prepares a stable release MR", async () => {
  const ci = await Bun.file("deployment/.gitlab-ci.yml").text()
  expect(ci).toContain(
    'promote:\n  stage: deploy\n  resource_group: package-release\n  variables:\n    GIT_DEPTH: "0"\n  rules:\n    - if: \'$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH && $CI_COMMIT_REF_PROTECTED == "true"\'\n      when: manual'
  )
  expect(ci).toContain("- bun run release:promote")
  const manifest = await Bun.file("package.json").json()
  expect(manifest.scripts["release:promote"]).toBe("bun cmd/promote-release.ts")
})
