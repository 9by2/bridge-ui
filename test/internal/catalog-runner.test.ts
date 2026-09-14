import { expect, test } from "bun:test"

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
