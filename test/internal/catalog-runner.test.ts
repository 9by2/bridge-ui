import { expect, test } from "bun:test"

const catalogImage =
  "registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime@sha256:19eddc384cca8f39c94290a0c161ac4c837683418ed288849444ea4eeb750200"

test("catalog commands split compact contracts from visual and memory diagnostics", async () => {
  const packageJson = await Bun.file("package.json").json()
  expect(packageJson.scripts["catalog:test"]).toBe("bun cmd/run-catalog-test.ts")
  expect(packageJson.scripts["catalog:test:visual"]).toBe("bun cmd/run-catalog-test.ts ./test/browser/visual.test.ts")
  expect(packageJson.scripts["catalog:test:memory"]).toBe("bun cmd/run-catalog-test.ts ./test/browser/memory.test.ts")
  const runner = await Bun.file("cmd/run-catalog-test.ts").text()
  expect(runner).toContain('"--parallel=2"')
  expect(runner).not.toContain('"--concurrent"')
  expect(runner).toContain("Bun.serve")
  expect(runner).toContain("server.stop(true)")
  expect(runner).toContain("path.extname(relativePath)")
  expect(runner).toContain("server.port")
  expect(runner).toContain('"./test/browser/accessibility.test.ts"')
  expect(runner).toContain('"./test/browser/render-pipeline.test.ts"')
  expect(runner).toContain('"./test/browser/responsive.test.ts"')
  expect(runner).not.toContain('"./test/browser"')
})

test("complete WebView verification runs before push while CI retains the static catalog gate", async () => {
  const root = await Bun.file(".gitlab-ci.yml").text()
  const child = await Bun.file("deployment/.gitlab-ci.yml").text()
  const dockerfile = await Bun.file("deployment/Dockerfile.catalog").text()
  const packageJson = await Bun.file("package.json").json()
  const hook = await Bun.file(".githooks/pre-push").text()

  expect(root).not.toContain("catalog-runtime-image:")
  expect(root).not.toContain("/kaniko/executor")
  expect(child).toContain(`CATALOG_IMAGE: "${catalogImage}"`)
  expect(child).toContain("image: $CATALOG_IMAGE")
  expect(child).not.toContain("cmd/install-ci-node.sh")
  expect(child).not.toContain("playwright install")
  expect(child).not.toContain("playwright-report/")
  expect(packageJson.scripts["hooks:install"]).toBe("git config core.hooksPath .githooks")
  expect(packageJson.scripts.postinstall).toBeUndefined()
  expect(packageJson.scripts.prepare).toBeUndefined()
  expect(hook).toContain('CATALOG_PORT="${CATALOG_PORT:-0}"')
  expect(hook).toContain("exec bun catalog:test")
  expect(child).toContain("- bun catalog:build")
  expect(child).not.toContain("- bun catalog:test")
  expect(await Bun.file("cmd/verify-ci-runtime.ts").text()).not.toContain("Bun.WebView")
  expect(child).toContain("$CI_COMMIT_TITLE !~ /^chore(\\([^)]*\\))?:/")
  expect(child).toContain("$IS_MERGE_REQUEST =~ /^(merge_request_event|external_pull_request_event)$/")
  expect(child).toContain("$CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH")
  expect(root).toContain("workflow:\n  rules:")
  expect(root).toContain("$CI_COMMIT_BRANCH && $CI_OPEN_MERGE_REQUESTS")
  expect(root).toContain("when: never")
  expect(dockerfile).not.toContain("playwright")
  expect(dockerfile).toContain("FROM oven/bun:1.4.1")
  expect(dockerfile).toContain("FROM node:22.22.0-bookworm-slim")
})

test("every Bun.WebView chrome backend passes --no-sandbox (Dockerfile runs as root)", async () => {
  const result = Bun.spawnSync(["grep", "-rl", 'type: "chrome"', "cmd", "test"], {
    stdout: "pipe",
    stderr: "pipe"
  })
  const matches = result.stdout
    .toString()
    .split("\n")
    .filter(Boolean)
    .filter((file) => !file.endsWith(".test.ts"))
  expect(matches.length).toBeGreaterThan(0)
  for (const file of matches) {
    const text = await Bun.file(file).text()
    const sites = [...text.matchAll(/backend:\s*\{[^}]*type:\s*"chrome"[^}]*\}/g)]
    expect(sites.length).toBeGreaterThan(0)
    for (const [site] of sites) expect(site).toContain('argv: ["--no-sandbox"]')
  }
})

test("no Playwright dependency or runtime usage remains", async () => {
  const packageJson = await Bun.file("package.json").text()
  expect(packageJson).not.toContain("playwright")

  const result = Bun.spawnSync(["grep", "-rli", "playwright", "app", "shared", "internal", "cmd", "test"], {
    stdout: "pipe",
    stderr: "pipe"
  })
  const matches = result.stdout
    .toString()
    .split("\n")
    .filter(Boolean)
    // Remaining hits are prose: the harness's own doc comments cross-reference Playwright's
    // prior API for readers migrating from it, and historical evaluation READMEs describe
    // what was true when that evidence was generated. Neither is a dependency or runtime call.
    .filter((file) => file !== "test/internal/catalog-runner.test.ts")
  for (const file of matches) {
    const text = await Bun.file(file).text()
    const hasImportOrRequire = /(?:from\s+["']|require\(["'])@?playwright/i.test(text)
    expect(hasImportOrRequire).toBe(false)
  }
})
