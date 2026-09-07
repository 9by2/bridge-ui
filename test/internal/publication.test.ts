import { expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

test("publication routes stable/RC and safely resumes an existing version", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-publication-"))
  const script = path.resolve("cmd/publish-package.ts")
  try {
    await Bun.write(path.join(directory, "dist/index.js"), "export const Button = {}; export const UploadList = {}")
    await Bun.write(
      path.join(directory, "mock.ts"),
      `
      globalThis.fetch = async () => new Response(JSON.stringify(
        process.env.EXISTS === "true" ? { versions: { [process.env.VERSION]: {} } } : {}
      ), { status: Number(process.env.STATUS ?? 200) });
      Bun.spawnSync = (args) => {
        console.log(JSON.stringify(args));
        const lookup = args.includes("--verify");
        const install = args[1] === "install";
        return { exitCode: lookup ? (process.env.TAG_EXISTS === "true" ? 0 : 1) : install && process.env.FAIL_INSTALL === "true" ? 1 : 0,
          stdout: Buffer.from(lookup && process.env.TAG_CONFLICT === "true" ? "other" : "head"), stderr: Buffer.from("") };
      };
    `
    )
    for (const version of ["0.2.0", "0.2.0-rc.0"]) {
      await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version }))
      await Bun.write(path.join(directory, "CHANGELOG.md"), `# Changelog\n\n## ${version}\n`)
      for (const scenario of ["new", "retry", "denied", "verify-failure", "tag-conflict", "already-released"]) {
        const result = Bun.spawnSync([process.execPath, "--preload", "./mock.ts", script], {
          cwd: directory,
          env: {
            ...process.env,
            CI_COMMIT_REF_PROTECTED: "true",
            CI_DEFAULT_BRANCH: "main",
            CI_COMMIT_BRANCH: "main",
            CI_COMMIT_TAG: "",
            CI_API_V4_URL: "https://registry.example/api/v4",
            CI_PROJECT_ID: "872",
            CI_JOB_TOKEN: "test-token",
            VERSION: version,
            EXISTS: String(["retry", "already-released"].includes(scenario)),
            STATUS: scenario === "denied" ? "403" : "200",
            FAIL_INSTALL: String(scenario === "verify-failure"),
            TAG_EXISTS: String(["tag-conflict", "already-released"].includes(scenario)),
            TAG_CONFLICT: "true"
          },
          stdout: "pipe",
          stderr: "pipe"
        })
        const output = result.stdout.toString()
        if (["denied", "verify-failure", "tag-conflict"].includes(scenario)) {
          expect(result.exitCode).not.toBe(0)
          expect(output).not.toContain("New tag:")
        } else {
          expect(result.exitCode, result.stderr.toString()).toBe(0)
          if (scenario === "new") expect(output).toContain(`"--tag","${version.includes("rc") ? "next" : "latest"}"`)
          else expect(output).not.toContain('"publish"')
          if (scenario !== "already-released") expect(output).toContain(`New tag: v${version}`)
        }
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
