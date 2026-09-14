import { expect, test } from "bun:test"

const catalogImage =
  "registry.fountain.sellsuki.com/service/bridge-ui-catalog-runner@sha256:887a2a4f53dd81fb6cada6384e5075e18a938ff07999d65a5115378e1a74ef8c"

for (const ci of ["true", ""]) {
  test(`catalog runner preserves the gate with CI=${ci || "unset"}`, () => {
    const result = Bun.spawnSync(
      [
        process.execPath,
        "-e",
        'import config from "./playwright.config"; console.log(JSON.stringify({ workers: config.workers, timeout: config.timeout, retries: config.retries ?? 0, expectTimeout: config.expect?.timeout ?? 5000, reporter: config.reporter }))'
      ],
      { env: { ...process.env, CI: ci }, stdout: "pipe", stderr: "pipe" }
    )
    expect(result.exitCode).toBe(0)
    expect(JSON.parse(result.stdout.toString())).toEqual({
      workers: ci ? 1 : 4,
      timeout: 30000,
      retries: 0,
      expectTimeout: 5000,
      reporter: [["list"], ["html", { open: "never" }]]
    })
  })
}

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
  expect(child).toContain("- bun catalog:test")
  expect(child).toContain("- playwright-report/")
  expect(dockerfile).toContain("bunx playwright@1.63.0 install --with-deps chromium")
  expect(dockerfile).toContain("FROM oven/bun:1.4.1")
  expect(dockerfile).toContain("FROM node:22.22.0-bookworm-slim")
})
