import { expect, test } from "bun:test"

import { Effect, Exit } from "effect"

import { ComponentInventoryError, verifyComponentInventory } from "../../internal/component-inventory"

test("inventory rejects a matrix that omits a source component", async () => {
  const result = await Effect.runPromiseExit(
    verifyComponentInventory(["shadcn/button", "brand/drop-area"], "| shadcn/button | Action |")
  )
  expect(Exit.isFailure(result)).toBe(true)
})

test("inventory rejects duplicate and unknown matrix component", async () => {
  const result = await Effect.runPromiseExit(
    verifyComponentInventory(
      ["shadcn/button"],
      "| shadcn/button | Action |\n| shadcn/button | Duplicate |\n| brand/missing | Unknown |"
    )
  )
  expect(Exit.isFailure(result)).toBe(true)
})

test("inventory reports the exact mismatch to its caller", async () => {
  const result = await Effect.runPromise(
    verifyComponentInventory(
      ["shadcn/button", "brand/drop-area"],
      "| shadcn/button | A |\n| shadcn/button | B |\n| brand/missing | C |"
    ).pipe(Effect.catchTag("ComponentInventoryError", (error) => Effect.succeed(error)))
  )
  expect(result).toBeInstanceOf(ComponentInventoryError)
  expect(result).toMatchObject({ missing: ["brand/drop-area"], extra: ["brand/missing"], duplicate: ["shadcn/button"] })
})

test("inventory accepts a complete matrix independent of source order", async () => {
  const result = await Effect.runPromise(
    verifyComponentInventory(
      ["brand/drop-area", "shadcn/button"],
      "# Inventory\n| shadcn/button | A |\n| brand/drop-area | B |"
    )
  )
  expect(result).toEqual({ count: 2 })
})

test("inventory rejects an empty or duplicate source inventory", async () => {
  for (const source of [[], ["shadcn/button", "shadcn/button"]]) {
    expect(Exit.isFailure(await Effect.runPromiseExit(verifyComponentInventory(source, "| shadcn/button | A |")))).toBe(
      true
    )
  }
})

test("inventory rejects malformed boundary input", async () => {
  expect(Exit.isFailure(await Effect.runPromiseExit(verifyComponentInventory([42], "| shadcn/button | A |")))).toBe(
    true
  )
  expect(Exit.isFailure(await Effect.runPromiseExit(verifyComponentInventory(["shadcn/button"], null)))).toBe(true)
})

test("inventory command verifies the checked-in component matrix", () => {
  const result = Bun.spawnSync([process.execPath, "cmd/verify-component-inventory.ts"], {
    stdout: "pipe",
    stderr: "pipe"
  })
  expect(result.exitCode).toBe(0)
  const report = JSON.parse(result.stdout.toString())
  expect(report.count).toBe(74)
  expect(report.modules["shadcn/button"]).toEqual([
    { name: "Button", kind: "value" },
    { name: "buttonVariants", kind: "value" }
  ])
  expect(report.modules["brand/ts-chart"]).toEqual([{ name: "TsChart", kind: "value" }])
  expect(report.modules["brand/page"]).toEqual([
    { name: "Page", kind: "value" },
    { name: "PageAction", kind: "value" },
    { name: "PageBreadcrumb", kind: "value" },
    { name: "PageContent", kind: "value" },
    { name: "PageDescription", kind: "value" },
    { name: "PageHeader", kind: "value" },
    { name: "PageHeading", kind: "value" },
    { name: "PageTitle", kind: "value" },
    { name: "PageToolbar", kind: "value" }
  ])
  expect(report.modules["shadcn/direction"]).toEqual([
    { name: "DirectionProvider", kind: "value" },
    { name: "useDirection", kind: "value" }
  ])
})
