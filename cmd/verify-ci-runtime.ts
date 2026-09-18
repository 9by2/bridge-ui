import assert from "node:assert/strict"

const commandVersion = (command: string[]) => {
  const result = Bun.spawnSync(command, { stdout: "pipe", stderr: "pipe" })
  assert.equal(result.exitCode, 0, result.stderr.toString())
  return result.stdout.toString().trim()
}

assert.equal(Bun.version, "1.4.1")
assert.equal(commandVersion(["node", "--version"]), "v22.22.0")
assert.equal(["arm64", "x64"].includes(process.arch), true)

try {
  await using view = new Bun.WebView({ backend: { type: "chrome", url: false }, width: 10, height: 10 })
  await view.navigate("about:blank")
} finally {
  Bun.WebView.closeAll()
}

console.log("Verified Bun, Node and Chrome runtime")
