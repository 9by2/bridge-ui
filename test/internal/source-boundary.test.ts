import { afterEach, describe, expect, test } from "bun:test"
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const fixtureRoots: string[] = []

afterEach(async () => {
  await Promise.all(fixtureRoots.splice(0).map((fixtureRoot) => rm(fixtureRoot, { force: true, recursive: true })))
})

describe("source boundary CLI", () => {
  test("accepts package-owned source and ignores generated Shadcn source", async () => {
    const fixtureRoot = await createFixture({
      "app/component/global/notice.component.tsx": "export function Notice() { return null }\n",
      "app/component/shadcn/generated.tsx": 'import { m } from "@cue/web/shared/i18n/runtime/messages"\n'
    })

    const result = await runBoundaryCheck(fixtureRoot)

    expect(result.exitCode).toBe(0)
    expect(result.stderr).toBe("")
  })

  test("rejects consumer, product i18n, router, and private package imports", async () => {
    const fixtureRoot = await createFixture({
      "app/component/global/consumer.component.tsx": 'import { m } from "@cue/web/shared/i18n/runtime/messages"\n',
      "app/component/global/css.ts": 'import "@bridge/ui/app/component/global/editor.css"\n',
      "app/component/global/private.component.tsx": 'import { Button } from "@bridge/ui/app/component/shadcn/button"\n',
      "app/component/global/route.component.tsx": 'import { Link } from "@tanstack/react-router"\n'
    })

    const result = await runBoundaryCheck(fixtureRoot)

    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain("@cue/web")
    expect(result.stderr).toContain("@bridge/ui/app/")
    expect(result.stderr).toContain("@tanstack/react-router")
  })

  test("rejects a private bare import", async () => {
    const fixtureRoot = await createFixture({
      "app/component/global/editor.ts": 'import "@bridge/ui/app/component/global/editor.css"\n'
    })

    const result = await runBoundaryCheck(fixtureRoot)

    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain("@bridge/ui/app/component/global/editor.css")
  })

  test("rejects application-layer paths and production containers", async () => {
    const fixtureRoot = await createFixture({
      "app/component/container/order.tsx": "export function OrderContainer() { return null }\n",
      "app/component/global/order.tsx": 'import type { OrderDto } from "../../../shared/dto/order"\n'
    })

    const result = await runBoundaryCheck(fixtureRoot)

    expect(result.exitCode).toBe(1)
    expect(result.stderr).toContain("production container")
    expect(result.stderr).toContain("application-layer import")
  })
})

async function createFixture(fileByPath: Readonly<Record<string, string>>): Promise<string> {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "bridge-ui-boundary-"))
  fixtureRoots.push(fixtureRoot)

  await Promise.all(
    Object.entries(fileByPath).map(async ([filePath, content]) => {
      const absolutePath = path.join(fixtureRoot, filePath)
      await mkdir(path.dirname(absolutePath), { recursive: true })
      await writeFile(absolutePath, content)
    })
  )

  return fixtureRoot
}

async function runBoundaryCheck(fixtureRoot: string): Promise<{ exitCode: number; stderr: string }> {
  const process = Bun.spawn(["bun", "internal/script/check-source-boundary.ts", fixtureRoot], {
    cwd: path.resolve(import.meta.dir, "../.."),
    stderr: "pipe",
    stdout: "ignore"
  })

  const stderr = await new Response(process.stderr).text()
  const exitCode = await process.exited
  return { exitCode, stderr }
}
