import { parse } from "@babel/parser"
import { Effect, Schema } from "effect"

export class ComponentExportError extends Schema.TaggedError<ComponentExportError>()("ComponentExportError", {
  message: Schema.String
}) {}

export const inspectComponentExport = Effect.fn("ComponentExport.inspect")(function* (input: string) {
  const ast = yield* Effect.try({
    try: () => parse(input, { sourceType: "module", plugins: ["typescript", "jsx"] }),
    catch: (error) => new ComponentExportError({ message: String(error) })
  })
  const entries: { name: string; kind: "type" | "value" }[] = []
  const localTypes = new Set<string>()
  for (const statement of ast.program.body) {
    const declaration = statement.type === "ExportNamedDeclaration" ? statement.declaration : statement
    if (declaration?.type === "TSTypeAliasDeclaration" || declaration?.type === "TSInterfaceDeclaration")
      localTypes.add(declaration.id.name)
  }
  for (const statement of ast.program.body) {
    if (statement.type === "ExportAllDeclaration" || statement.type === "ExportDefaultDeclaration")
      return yield* Effect.fail(
        new ComponentExportError({ message: "Wildcard/default export requires explicit inventory resolution" })
      )
    if (statement.type !== "ExportNamedDeclaration") continue
    const declaration = statement.declaration
    if (declaration?.type === "VariableDeclaration") {
      for (const variable of declaration.declarations) {
        if (variable.id.type !== "Identifier")
          return yield* Effect.fail(
            new ComponentExportError({ message: "Destructured export requires explicit inventory support" })
          )
        entries.push({ name: variable.id.name, kind: "value" })
      }
    }
    if (declaration && "id" in declaration && declaration.id?.type === "Identifier")
      entries.push({ name: declaration.id.name, kind: statement.exportKind === "type" ? "type" : "value" })
    for (const specifier of statement.specifiers) {
      entries.push({
        name: specifier.exported.type === "Identifier" ? specifier.exported.name : specifier.exported.value,
        kind:
          statement.exportKind === "type" ||
          (specifier.type === "ExportSpecifier" &&
            (specifier.exportKind === "type" || (!statement.source && localTypes.has(specifier.local.name))))
            ? "type"
            : "value"
      })
    }
  }
  return [...new Map(entries.map((entry) => [`${entry.kind}:${entry.name}`, entry])).values()].sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0
  )
})
