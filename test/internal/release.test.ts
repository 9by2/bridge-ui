import { expect, test } from "bun:test"

test("release refuses local execution without a protected prerelease context", () => {
  const result = Bun.spawnSync(["bun", "internal/script/publish-package.ts"], {
    env: { ...process.env, CI_COMMIT_TAG: "v0.1.0", CI_COMMIT_REF_PROTECTED: "false" },
    stdout: "pipe",
    stderr: "pipe"
  })
  expect(result.exitCode).not.toBe(0)
  expect(result.stderr.toString()).toContain("Protected prerelease tag required")
})
