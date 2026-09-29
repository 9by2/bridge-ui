import { expect, test } from "bun:test"
import path from "node:path"

// Protects the catalog contract (catalog-consumer-parity): an example must render the way a consumer sees the
// same exported components. Consumers import Tailwind before @bridge/ui/style.css, so utilities never beat
// package StyleX. The catalog must use that cascade, and examples must not restyle what a component owns.
const root = path.resolve(import.meta.dir, "../..")

test("catalog cascade orders Tailwind utilities before package StyleX layers like a consumer", async () => {
  const html = await Bun.file(path.join(root, "internal/catalog/index.html")).text()
  const order =
    html
      .match(/@layer ([^;]+);/)?.[1]
      ?.split(",")
      .map((name) => name.trim()) ?? []
  expect(order.indexOf("utilities")).toBeGreaterThanOrEqual(0)
  expect(order.indexOf("utilities")).toBeLessThan(order.indexOf("priority1"))
})

// Component-owned appearance: spacing, typography, border, radius, color, elevation. Size/layout utilities
// (w-*, h-*, max-w-*, min-h-*, flex/grid placement) remain local layout owned by the caller.
const ComponentStyleUtility =
  /(?:^|\s|:)(?:-?[mp][trblxyse]?-\S+|gap-\S+|space-[xy]-\S+|text-(?:xs|sm|base|lg|xl|\d?xl|\[|[a-z]+-[a-z-]*foreground|white|black|foreground|primary|muted)\S*|font-\S+|leading-\S+|tracking-\S+|border\S*|rounded\S*|shadow\S*|bg-\S+|ring\S*|capitalize|uppercase)(?=\s|$)/
// Components with no package-owned appearance: the caller owns every visual property of the rendered element.
const UnstyledComponent = new Set(["UI.ResponsiveImage"])
const openingTag = /<(UI\.[A-Za-z]+)\b((?:[^<>{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)>/g
const classNameValue = /className=("[^"]*"|\{(?:[^{}]|\{[^{}]*\})*\})/

test("catalog examples never restyle appearance owned by a package component", async () => {
  const violation: string[] = []
  for await (const file of new Bun.Glob("internal/catalog/{example,prototype}/**/*.tsx").scan(root)) {
    const source = await Bun.file(path.join(root, file)).text()
    for (const match of source.matchAll(openingTag)) {
      if (UnstyledComponent.has(match[1] ?? "")) continue
      const value = match[2]?.match(classNameValue)?.[1]
      const literal = value?.match(/"([^"]*)"|`([^`]*)`/g)?.join(" ") ?? ""
      if (ComponentStyleUtility.test(literal)) violation.push(`${file} ${match[1]} ${literal}`)
    }
  }
  expect(violation).toEqual([])
})
