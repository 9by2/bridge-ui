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
  expect(ci).not.toContain("when: manual")
  expect(ci).not.toContain("\npromote:")
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
    '$CI_PIPELINE_SOURCE == "parent_pipeline" && $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH && $CI_COMMIT_REF_PROTECTED == "true" && $CI_COMMIT_TITLE == "chore: version package"'
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

// Protects: GitHub mirror publishes only from verified main pushes, with provenance-capable permissions.
test("GitHub workflow publishes npm only after verification on main push", async () => {
  const workflow = await Bun.file(".github/workflows/release.yml").text()
  const manifest = await Bun.file("package.json").json()
  expect(workflow).toContain(
    "release:\n    needs: verify\n    if: github.event_name == 'push' && github.ref == 'refs/heads/main'"
  )
  expect(workflow).toContain("id-token: write")
  expect(workflow).toContain("run: bun release:npm")
  expect(workflow).toContain("NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}")
  expect(workflow).toContain('BUN_VERSION: "1.4.1"')
  expect(workflow).not.toContain("changeset version")
  expect(manifest.scripts["release:npm"]).toBe("bun cmd/publish-npm.ts")
})

test("merged changesets prepare a stable version MR without pre-release or manual promotion", async () => {
  const ci = await Bun.file("deployment/.gitlab-ci.yml").text()
  expect(ci).toContain('INPUT_TITLE: "Release @bridge/ui"')
  expect(ci).not.toContain("(rc)")
  expect(await Bun.file(".changeset/pre.json").exists()).toBe(false)
  const manifest = await Bun.file("package.json").json()
  expect(manifest.scripts["release:version"]).toContain("bun changeset version")
  expect(manifest.scripts["release:promote"]).toBeUndefined()
})
