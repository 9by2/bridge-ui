import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

const replacement: Record<string, Array<[string, string]>> = {
  breadcrumb: [['      role="link"\n      aria-disabled="true"\n', ""]],
  item: [['      role="list"\n', ""]],
  pagination: [['      role="navigation"\n', ""]],
  toast: [
    [
      'render = <Button variant="ghost" size="icon-sm" />',
      'render = <Button variant="ghost" size="icon-sm" aria-label="Close toast" />'
    ]
  ],
  field: [
    [
      "error?.message && <li key={index}>{error.message}</li>",
      "error?.message && <li key={error.message}>{error.message}</li>"
    ]
  ],
  "toggle-group": [
    [
      "  return (\n    <ToggleGroupPrimitive\n",
      "  const context = React.useMemo(() => ({ variant, size, spacing, orientation }), [variant, size, spacing, orientation])\n  return (\n    <ToggleGroupPrimitive\n"
    ],
    ["value={{ variant, size, spacing, orientation }}", "value={context}"]
  ],
  chart: [
    [
      "  return (\n    <ChartContext.Provider value={{ config }}>\n",
      "  const context = React.useMemo(() => ({ config }), [config])\n\n  return (\n    <ChartContext.Provider value={context}>\n"
    ],
    ["  const tooltipLabel = React.useMemo(() => {", "  const tooltipLabel = (() => {"],
    [
      "  }, [\n    label,\n    labelFormatter,\n    payload,\n    hideLabel,\n    labelClassName,\n    config,\n    labelKey,\n  ])",
      "  })()"
    ],
    [
      '            return (\n              <div\n                key={index}\n                className={cn(\n                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",',
      '            return (\n              <div\n                key={item.graphicalItemId}\n                className={cn(\n                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",'
    ],
    [
      '          return (\n            <div\n              key={index}\n              className={cn(\n                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"',
      '          const legendKey =\n            (typeof item.dataKey === "string" || typeof item.dataKey === "number" ? item.dataKey : undefined) ??\n            item.value ??\n            "legend"\n\n          return (\n            <div\n              key={legendKey}\n              className={cn(\n                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"'
    ]
  ],
  carousel: [
    ["  return (\n    <CarouselContext.Provider\n      value={{", "  const context = React.useMemo(() => ({"],
    [
      "        canScrollNext,\n      }}\n    >",
      "        canScrollNext,\n      }), [carouselRef, api, opts, orientation, scrollPrev, scrollNext, canScrollPrev, canScrollNext])\n\n  return (\n    <CarouselContext.Provider value={context}>"
    ]
  ],
  toggle: []
}

const directory = await mkdtemp(path.join(tmpdir(), "shadcn-doctor-"))
try {
  const registry = await Promise.all(
    Object.entries(replacement).map(async ([name, replacements]) => {
      const target = `app/component/shadcn/${name}.tsx`
      const baseline = Bun.spawnSync(["git", "show", `HEAD:${target}`], { stdout: "pipe", stderr: "pipe" })
      if (baseline.exitCode !== 0) throw new Error(baseline.stderr.toString())
      let content = baseline.stdout.toString()
      for (const [before, after] of replacements) {
        if (content.split(before).length === 2) content = content.replace(before, after)
        else if (!content.includes(after)) throw new Error(`Generated source changed: ${target}`)
      }
      const file = path.join(directory, `${name}.json`)
      await Bun.write(
        file,
        JSON.stringify({
          name,
          type: "registry:file",
          files: [{ path: target, target, type: "registry:file", content }]
        })
      )
      return file
    })
  )
  const add = Bun.spawnSync(["bunx", "shadcn", "add", ...registry, "--overwrite", "--yes"], {
    stdout: "inherit",
    stderr: "inherit"
  })
  if (add.exitCode !== 0) throw new Error(`Shadcn doctor refresh failed: ${add.exitCode}`)
} finally {
  await rm(directory, { recursive: true, force: true })
}
