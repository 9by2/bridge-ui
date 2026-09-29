import { expect, test } from "bun:test"
import path from "node:path"

// Protects spec console-prototype: each console prototype demonstrates every public component family, composed through
// the public `@bridge/ui` root export with package defaults, so a consumer sees every component in real use.
const root = path.resolve(import.meta.dir, "../..")
const PrototypeConfig = {
  DIRECTORY: "internal/catalog/prototype",
  SHARED: "shared",
  PROTOTYPE: ["backstage", "admin"],
  EXAMPLE: { backstage: "default", admin: "admin" }
} as const

const read = (file: string) => Bun.file(path.join(root, file)).text()

// Runtime export names per family, resolved through the root barrel (including renamed re-exports).
async function familyExport() {
  const barrel = await read("app/index.ts")
  const result = new Map<string, Set<string>>()
  const add = (family: string, name: string) => result.set(family, (result.get(family) ?? new Set()).add(name))
  for (const line of barrel.split("\n")) {
    const star = line.match(/^export \* from "\.\/component\/brand\/(?:stylex\/)?([\w-]+)"/)
    const named = line.match(/^export \{([^}]+)\} from "\.\/component\/brand\/(?:stylex\/)?([\w-]+)"/)
    if (star?.[1]) {
      const family = star[1]
      const source = await read(`app/component/brand/stylex/${family}.tsx`)
      for (const match of source.matchAll(/^export (?:async )?(?:function|const|class) (\w+)/gm))
        add(family, match[1] ?? "")
      for (const block of source.matchAll(/^export \{([^}]+)\}/gm))
        for (const item of block[1]?.split(",") ?? []) {
          const name = item
            .trim()
            .split(/\s+as\s+/)
            .at(-1)
          if (name && !name.startsWith("type ")) add(family, name)
        }
    }
    if (named?.[1] && named[2] && !line.startsWith("export type"))
      for (const item of named[1].split(",")) {
        const name = item
          .trim()
          .split(/\s+as\s+/)
          .at(-1)
        if (name) add(named[2], name)
      }
  }
  return result
}

async function prototypeSource(prototype: string) {
  const file = [
    ...new Bun.Glob(`${PrototypeConfig.DIRECTORY}/{${prototype},${PrototypeConfig.SHARED}}/**/*.tsx`).scanSync({
      cwd: root
    })
  ]
  return (await Promise.all(file.map(read))).join("\n")
}

test("catalog registers both console prototypes", async () => {
  for (const prototype of PrototypeConfig.PROTOTYPE) {
    const source = await read(`internal/catalog/example/prototype/${PrototypeConfig.EXAMPLE[prototype]}.tsx`)
    expect(source).toMatch(/export default function Example|export \{ default \} from/)
  }
})

test("each console prototype uses every public component family", async () => {
  const family = [...new Bun.Glob("internal/catalog/example/*/default.tsx").scanSync({ cwd: root })]
    .map((file) => path.basename(path.dirname(file)))
    .filter((name) => name !== "prototype")
  const exportName = await familyExport()
  for (const prototype of PrototypeConfig.PROTOTYPE) {
    const source = await prototypeSource(prototype)
    const used = new Set([...source.matchAll(/\bUI\.(\w+)/g)].map((match) => match[1]))
    const missing = family.filter((name) => ![...(exportName.get(name) ?? [])].some((item) => used.has(item)))
    expect({ prototype, missing }).toEqual({ prototype, missing: [] })
  }
})

test("console prototypes consume only the public package root", async () => {
  for (const prototype of [...PrototypeConfig.PROTOTYPE, PrototypeConfig.SHARED]) {
    for (const file of new Bun.Glob(`${PrototypeConfig.DIRECTORY}/${prototype}/**/*.tsx`).scanSync({ cwd: root })) {
      const source = await read(file)
      for (const match of source.matchAll(/from "(@bridge[^"]*)"/g))
        expect(`${file} ${match[1]}`).toBe(`${file} @bridge/ui`)
    }
  }
})
