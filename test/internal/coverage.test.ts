import { expect, test } from "bun:test"

test("repository coverage excludes generated Shadcn without relaxing owned coverage", () => {
  const result = Bun.spawnSync(
    ["bun", "--eval", 'import config from "./vitest.config.ts"; console.log(JSON.stringify(config.test.coverage))'],
    { env: { ...process.env, COVERAGE_SCOPE: "repository" }, stdout: "pipe", stderr: "pipe" }
  )
  expect(result.exitCode).toBe(0)
  const coverage = JSON.parse(result.stdout.toString())
  expect(coverage.exclude).toEqual([
    "app/component/shadcn/**",
    "internal/catalog/vendor/**",
    "internal/catalog/example/**"
  ])
  expect(coverage.include).toEqual([
    "app/**/*.{ts,tsx}",
    "shared/**/*.{ts,tsx}",
    "internal/**/*.{ts,tsx}",
    "cmd/**/*.{ts,tsx}"
  ])
  expect(coverage.thresholds).toEqual({
    statements: 90,
    branches: 90,
    functions: 90,
    lines: 90,
    "app/component/brand/**/*.tsx": { statements: 100, branches: 100, functions: 100, lines: 100 }
  })
})
