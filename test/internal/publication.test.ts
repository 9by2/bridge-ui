import { expect, test } from "bun:test"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { publishPackage } from "../../cmd/publish-package"

test("publication uses latest for stable and safely resumes an existing version", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-publication-"))
  try {
    await Bun.write(path.join(directory, "dist/index.js"), "export const Button = {}; export const UploadList = {}")
    for (const version of ["0.2.0"]) {
      await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version }))
      await Bun.write(path.join(directory, "CHANGELOG.md"), `# Changelog\n\n## ${version}\n`)
      for (const scenario of ["new", "retry", "denied", "verify-failure", "tag-conflict", "already-released"]) {
        const output: string[] = []
        const command: string[][] = []
        const run = publishPackage({
          cwd: directory,
          env: {
            CI_COMMIT_REF_PROTECTED: "true",
            CI_DEFAULT_BRANCH: "main",
            CI_COMMIT_BRANCH: "main",
            CI_COMMIT_TAG: "",
            CI_API_V4_URL: "https://registry.example/api/v4",
            CI_PROJECT_ID: "872",
            CI_JOB_TOKEN: "test-token"
          },
          fetch: Object.assign(
            async () =>
              new Response(
                JSON.stringify(["retry", "already-released"].includes(scenario) ? { versions: { [version]: {} } } : {}),
                { status: scenario === "denied" ? 403 : 200 }
              ),
            { preconnect() {} }
          ),
          log: (message) => output.push(message),
          spawn: (args) => {
            command.push(args)
            const lookup = args.includes("--verify")
            const install = args[1] === "install"
            return {
              exitCode: lookup
                ? ["tag-conflict", "already-released"].includes(scenario)
                  ? 0
                  : 1
                : install && scenario === "verify-failure"
                  ? 1
                  : 0,
              stdout: Buffer.from(lookup && ["tag-conflict", "already-released"].includes(scenario) ? "other" : "head"),
              stderr: Buffer.from("")
            }
          }
        })
        if (["denied", "verify-failure", "tag-conflict"].includes(scenario)) {
          await expect(run).rejects.toBeDefined()
          expect(output).not.toContain(`New tag: v${version}`)
        } else {
          await run
          if (scenario === "new")
            expect(command).toContainEqual([
              "bun",
              "publish",
              "--tag",
              "latest",
              "--registry",
              "https://registry.example/api/v4/projects/872/packages/npm/"
            ])
          else expect(command.some((args) => args.includes("publish"))).toBe(false)
          if (scenario !== "already-released") expect(output).toContain(`New tag: v${version}`)
        }
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test("publication rejects RC versions before contacting the registry", async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "bridge-publication-"))
  try {
    await Bun.write(path.join(directory, "package.json"), JSON.stringify({ name: "@bridge/ui", version: "0.2.0-rc.0" }))
    await expect(
      publishPackage({
        cwd: directory,
        env: { CI_COMMIT_REF_PROTECTED: "true", CI_DEFAULT_BRANCH: "main", CI_COMMIT_BRANCH: "main" },
        fetch: Object.assign(
          () => {
            throw new Error("Registry must not be contacted")
          },
          { preconnect() {} }
        )
      })
    ).rejects.toThrow("Stable version required")
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
