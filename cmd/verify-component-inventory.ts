import { Effect, Schema } from "effect"

import { inspectComponentExport } from "../internal/component-export"
import { verifyComponentInventory } from "../internal/component-inventory"

class InventoryReadError extends Schema.TaggedError<InventoryReadError>()("InventoryReadError", {
  message: Schema.String
}) {}

const program = Effect.gen(function* () {
  const source = yield* Effect.try({
    try: () =>
      [...new Bun.Glob("app/component/{shadcn,brand}/*.tsx").scanSync()].map((file) =>
        file.replace("app/component/", "").replace(/\.tsx$/, "")
      ),
    catch: (error) => new InventoryReadError({ message: String(error) })
  })
  const matrix = yield* Effect.tryPromise({
    try: () => Bun.file("plan/stylex-component-foundation/component-matrix.md").text(),
    catch: (error) => new InventoryReadError({ message: String(error) })
  })
  const report = yield* verifyComponentInventory(source, matrix)
  const modules: Record<string, { name: string; kind: "type" | "value" }[]> = {}
  for (const name of source.sort()) {
    const content = yield* Effect.tryPromise({
      try: () => Bun.file(`app/component/${name}.tsx`).text(),
      catch: (error) => new InventoryReadError({ message: String(error) })
    })
    modules[name] = yield* inspectComponentExport(content)
  }
  return { ...report, modules }
})

await Effect.runPromise(program).then(
  (report) => console.log(JSON.stringify(report)),
  (error) => {
    console.error(String(error))
    process.exitCode = 1
  }
)
