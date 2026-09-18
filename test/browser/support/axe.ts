import type { CatalogView } from "./webview"

export type AxeResult = {
  violations: unknown[]
  incomplete: unknown[]
}

export type RunAxeOptions = {
  tags?: string[]
}

const DEFAULT_TAGS = ["wcag2a", "wcag2aa", "wcag21aa"]

let axeSourceCache: string | undefined

async function loadAxeSource(): Promise<string> {
  if (axeSourceCache) return axeSourceCache
  const axePath = import.meta.resolve("axe-core/axe.min.js")
  axeSourceCache = await Bun.file(new URL(axePath)).text()
  return axeSourceCache
}

/**
 * Inject axe-core into the view (once) and run an accessibility audit.
 * Mirrors `@axe-core/playwright`'s `AxeBuilder.analyze()` result subset.
 */
export async function runAxe(view: CatalogView, options: RunAxeOptions = {}): Promise<AxeResult> {
  const alreadyInjected = await view.evaluate<boolean>(`typeof window.axe !== "undefined"`)
  if (!alreadyInjected) {
    const source = await loadAxeSource()
    await view.evaluate(`(() => {
      ${source}
      return true
    })()`)
  }
  const tags = options.tags ?? DEFAULT_TAGS
  return view.evaluate<AxeResult>(
    `axe.run(document, { runOnly: { type: "tag", values: ${JSON.stringify(tags)} } }).then((r) => ({ violations: r.violations, incomplete: r.incomplete }))`
  )
}
