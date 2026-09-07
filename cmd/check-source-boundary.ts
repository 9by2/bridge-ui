import path from "node:path"

const sourceRoot = path.resolve(process.argv[2] ?? process.cwd())
const forbiddenModule = [
  "@bridge/ui/app/",
  "@bridge/ui/cmd/",
  "@bridge/ui/internal/",
  "@bridge/web",
  "@cue/web",
  "@tanstack/react-router",
  "@yudiel/react-qr-scanner"
]
const applicationSegment =
  /(?:^|\/)(?:adapter|auth|authorization|container|dto|i18n|mapper|query|repository|route|usecase|workflow)(?:\/|$)/
const modulePattern = /(?:from\s*|import\s*(?:\(\s*)?|require\s*\(\s*)["']([^"']+)["']/g
const violations: string[] = []

for await (const relativePath of new Bun.Glob("app/**/*.{ts,tsx}").scan({ cwd: sourceRoot })) {
  if (relativePath.startsWith("app/component/shadcn/")) continue
  if (applicationSegment.test(relativePath)) {
    violations.push(`${relativePath}: production container or application-layer path`)
  }

  const content = await Bun.file(path.join(sourceRoot, relativePath)).text()
  for (const match of content.matchAll(modulePattern)) {
    const moduleName = match[1]
    if (!moduleName) continue

    const forbiddenName = forbiddenModule.find(
      (candidate) => moduleName === candidate || moduleName.startsWith(candidate)
    )
    if (forbiddenName) violations.push(`${relativePath}: forbidden import ${moduleName}`)
    else if (applicationSegment.test(moduleName)) {
      violations.push(`${relativePath}: application-layer import ${moduleName}`)
    }
  }
}

if (violations.length > 0) {
  console.error(violations.join("\n"))
  process.exitCode = 1
}
