import path from "node:path"

import pixelmatch from "pixelmatch"
import { PNG } from "pngjs"

import type { CatalogView } from "./webview"

export type ExpectScreenshotOptions = {
  threshold?: number
  /**
   * Crop the captured viewport to this rect (device pixels at the view's DPR — assumed 1x
   * here) before comparing, replacing Playwright's element-scoped `locator.screenshot()`
   * clip. `Bun.WebView.screenshot()` only captures the full viewport, so cropping happens
   * client-side against the decoded PNG.
   */
  clip?: { x: number; y: number; width: number; height: number }
}

const BASELINE_DIR = path.join(import.meta.dir, "__screenshot__")
const FAILURE_DIR = path.join(process.cwd(), ".eval", "screenshot-failures")

function baselinePath(name: string): string {
  return path.join(BASELINE_DIR, `${name}-${process.platform}.png`)
}

function cropPng(png: PNG, clip: { x: number; y: number; width: number; height: number }): PNG {
  const x = Math.max(0, Math.round(clip.x))
  const y = Math.max(0, Math.round(clip.y))
  const width = Math.min(Math.round(clip.width), png.width - x)
  const height = Math.min(Math.round(clip.height), png.height - y)
  const cropped = new PNG({ width, height })
  PNG.bitblt(png, cropped, x, y, width, height, 0, 0)
  return cropped
}

/**
 * Capture the current viewport (optionally cropped to `options.clip`) and diff it against
 * a stored PNG baseline using pixelmatch. Replaces Playwright's
 * `expect(locator).toHaveScreenshot()`.
 */
export async function expectScreenshot(
  view: CatalogView,
  name: string,
  options: ExpectScreenshotOptions = {}
): Promise<void> {
  const threshold = options.threshold ?? 0.01
  const rawBuffer = await view.screenshot({ encoding: "buffer", format: "png" })
  const rawPng = PNG.sync.read(rawBuffer)
  const actualPng = options.clip ? cropPng(rawPng, options.clip) : rawPng
  const actualBuffer = PNG.sync.write(actualPng)
  const file = baselinePath(name)

  if (process.env.BUN_UPDATE_SNAPSHOTS === "1" || !(await Bun.file(file).exists())) {
    await Bun.write(file, actualBuffer)
    return
  }

  const baselineBuffer = await Bun.file(file).arrayBuffer()
  const baselinePng = PNG.sync.read(Buffer.from(baselineBuffer))

  if (actualPng.width !== baselinePng.width || actualPng.height !== baselinePng.height) {
    throw new Error(
      `screenshot "${name}" size mismatch: actual ${actualPng.width}x${actualPng.height}, baseline ${baselinePng.width}x${baselinePng.height}`
    )
  }

  const diffPng = new PNG({ width: actualPng.width, height: actualPng.height })
  const diffPixels = pixelmatch(actualPng.data, baselinePng.data, diffPng.data, actualPng.width, actualPng.height, {
    threshold: 0.1
  })
  const ratio = diffPixels / (actualPng.width * actualPng.height)

  if (ratio > threshold) {
    const failureDir = path.join(FAILURE_DIR, name)
    await Bun.write(path.join(failureDir, "actual.png"), actualBuffer)
    await Bun.write(path.join(failureDir, "diff.png"), PNG.sync.write(diffPng))
    throw new Error(
      `screenshot "${name}" mismatch: ${diffPixels} px (${(ratio * 100).toFixed(2)}%) exceeds threshold ${(threshold * 100).toFixed(2)}%; see ${failureDir}`
    )
  }
}
