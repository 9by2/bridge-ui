import { expect, test } from "bun:test"

test("runtime coverage keeps package source and separate CI verification", async () => {
  const result = Bun.spawnSync(
    ["bun", "--eval", 'import config from "./vitest.config.ts"; console.log(JSON.stringify(config.test.coverage))'],
    { env: { ...process.env, COVERAGE_SCOPE: "runtime" }, stdout: "pipe", stderr: "pipe" }
  )
  expect(result.exitCode).toBe(0)
  const coverage = JSON.parse(result.stdout.toString())
  expect(coverage.exclude).toEqual(["app/component/shadcn/**", "app/index.ts"])
  expect(coverage.include).toEqual(["app/**/*.{ts,tsx}", "shared/**/*.{ts,tsx}"])
  expect(coverage.thresholds).toEqual({
    statements: 90,
    branches: 90,
    functions: 90,
    lines: 90,
    "app/component/brand/**/*.tsx": { statements: 90, branches: 90, functions: 90, lines: 90 }
  })
  const manifest = await Bun.file("package.json").json()
  expect(manifest.scripts["coverage:runtime"]).toBe("COVERAGE_SCOPE=runtime vitest run --coverage")
  expect(manifest.scripts["coverage:repository"]).toBeUndefined()
  const ci = await Bun.file("deployment/.gitlab-ci.yml").text()
  for (const command of [
    "coverage:runtime",
    "test",
    "boundary",
    "verify:package",
    "verify:tree-shaking",
    "catalog:test"
  ]) {
    expect(ci).toContain(`- bun ${command}\n`)
  }
  const entry = await Bun.file("app/index.ts").text()
  expect(
    entry
      .trim()
      .split("\n")
      .every((line) => /^export (?:\*|(?:type )?\{[\w ,]+\}) from "\.\/[^" ]+"$/.test(line))
  ).toBe(true)
})
