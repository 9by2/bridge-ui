import { Effect, Schema } from "effect"

export class ComponentInventoryError extends Schema.TaggedError<ComponentInventoryError>()("ComponentInventoryError", {
  missing: Schema.Array(Schema.String),
  extra: Schema.Array(Schema.String),
  duplicate: Schema.Array(Schema.String)
}) {}

export class ComponentInventoryInputError extends Schema.TaggedError<ComponentInventoryInputError>()(
  "ComponentInventoryInputError",
  {
    message: Schema.String
  }
) {}

export const verifyComponentInventory = Effect.fn("ComponentInventory.verify")(function* (
  sourceInput: unknown,
  matrixInput: unknown
) {
  const source = yield* Schema.decodeUnknownEffect(Schema.Array(Schema.String))(sourceInput)
  const matrix = yield* Schema.decodeUnknownEffect(Schema.String)(matrixInput)
  if (source.length === 0 || new Set(source).size !== source.length)
    return yield* Effect.fail(
      new ComponentInventoryInputError({ message: "Source inventory must be nonempty and unique" })
    )
  const rows = [...matrix.matchAll(/^\|\s+((?:shadcn|brand)\/[^\s|]+)\s+\|/gm)]
    .map((match) => match[1])
    .filter((name): name is string => name !== undefined)
  const sourceName = new Set(source)
  const rowName = new Set<string>()
  const extra = rows.filter((name) => !sourceName.has(name))
  const duplicate = rows.filter((name) => {
    if (rowName.has(name)) return true
    rowName.add(name)
    return false
  })
  const missing = source.filter((name) => !rowName.has(name))
  if (missing.length || extra.length || duplicate.length)
    return yield* Effect.fail(new ComponentInventoryError({ missing, extra, duplicate }))
  return { count: source.length }
})
