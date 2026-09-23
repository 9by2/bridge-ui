import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const view = Bun.spawnSync(["bunx", "shadcn", "view", "carousel"], { stdout: "pipe", stderr: "pipe" })
if (view.exitCode !== 0) throw new Error(view.stderr.toString())

const items: Array<{
  name: string
  files: Array<{ content: string; type: string; target?: string }>
}> = JSON.parse(view.stdout.toString())
const [item] = items
if (!item || item.name !== "carousel" || item.files.length !== 1) throw new Error("Unexpected carousel registry item")

const before = '      api?.off("select", onSelect)'
const source = item.files[0]!.content
if (source.split(before).length !== 2) throw new Error("Carousel registry cleanup has changed; review the override")
const buttonImport = 'import { Button } from "@/registry/base-nova/ui/button"'
const iconImport = 'import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"'
if (!source.includes(buttonImport) || !source.includes(iconImport)) throw new Error("Carousel registry imports changed")
let content = source
  .replace(buttonImport, 'import { Button } from "@bridge/ui/app/component/shadcn/button"')
  .replace(iconImport, 'import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"')
  .replace(before, '      api.off("reInit", onSelect)\n' + before)
for (const [icon, name] of [
  ["ChevronLeftIcon", "Previous"],
  ["ChevronRightIcon", "Next"]
]) {
  const pattern = new RegExp(`      <IconPlaceholder\\n(?:.*\\n)*?        lucide="${icon}"\\n(?:.*\\n)*?      />`)
  if (!pattern.test(content)) throw new Error(`${name} icon registry markup changed`)
  content = content.replace(pattern, `      <${icon} />`)
}
item.files[0]!.content = content
// The CLI strips directives and does not rewrite registry:file imports, so preserve the local contract above.
const file = item.files[0]!
file.type = "registry:file"
file.target = "app/component/shadcn/carousel.tsx"

const directory = await mkdtemp(path.join(tmpdir(), "shadcn-carousel-"))
try {
  const registry = path.join(directory, "carousel.json")
  await Bun.write(registry, JSON.stringify(item))
  const add = Bun.spawnSync(["bunx", "shadcn", "add", registry, "--overwrite", "--yes"], {
    stdout: "inherit",
    stderr: "inherit"
  })
  if (add.exitCode !== 0) throw new Error(`Shadcn carousel refresh failed: ${add.exitCode}`)
} finally {
  await rm(directory, { recursive: true, force: true })
}
