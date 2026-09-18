import { expect, test } from "bun:test"

const catalogImage =
  "registry.fountain.sellsuki.com/service/bridge-ui-ci-verify-runtime@sha256:19eddc384cca8f39c94290a0c161ac4c837683418ed288849444ea4eeb750200"

test("catalog:test script runs the Bun.WebView orchestrator", async () => {
  const packageJson = await Bun.file("package.json").json()
  expect(packageJson.scripts["catalog:test"]).toBe("bun cmd/run-catalog-test.ts")
})

test("catalog CI uses a prebuilt version-pinned browser runtime", async () => {
  const root = await Bun.file(".gitlab-ci.yml").text()
  const child = await Bun.file("deployment/.gitlab-ci.yml").text()
  const dockerfile = await Bun.file("deployment/Dockerfile.catalog").text()

  expect(root).not.toContain("catalog-runtime-image:")
  expect(root).not.toContain("/kaniko/executor")
  expect(child).toContain(`CATALOG_IMAGE: "${catalogImage}"`)
  expect(child).toContain("image: $CATALOG_IMAGE")
  expect(child).not.toContain("cmd/install-ci-node.sh")
  expect(child).not.toContain("playwright install")
  expect(child).not.toContain("playwright-report/")
  expect(child).toContain("- bun catalog:test")
  expect(dockerfile).not.toContain("playwright")
  expect(dockerfile).toContain("apt-get install -y --no-install-recommends git chromium")
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
