import assert from "node:assert/strict"

const commandVersion = (command: string[]) => {
  const result = Bun.spawnSync(command, { stdout: "pipe", stderr: "pipe" })
  assert.equal(result.exitCode, 0, result.stderr.toString())
  return result.stdout.toString().trim()
}

assert.equal(Bun.version, "1.4.1")
assert.equal(commandVersion(["node", "--version"]), "v22.22.0")
assert.equal(process.arch, "arm64")
assert.equal(process.env.PLAYWRIGHT_BROWSERS_PATH, "/ms-playwright")
assert.equal(await Bun.file("/ms-playwright/chromium-1243/INSTALLATION_COMPLETE").exists(), true)
assert.equal(await Bun.file("/ms-playwright/chromium_headless_shell-1243/INSTALLATION_COMPLETE").exists(), true)
const playwright = await Bun.file("node_modules/@playwright/test/package.json").json()
assert.equal(playwright.version, "1.63.0")

console.log("Verified Bun, Node and Playwright runtime")
