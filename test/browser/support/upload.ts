import type { CatalogView } from "./webview"

/** Generate a small solid-color PNG data URL in-page via canvas.toDataURL(). */
export async function makeTestPng(view: CatalogView, width: number, height: number, color: string): Promise<string> {
  return view.evaluate<string>(`(() => {
    const canvas = document.createElement("canvas")
    canvas.width = ${width}
    canvas.height = ${height}
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = ${JSON.stringify(color)}
    ctx.fillRect(0, 0, ${width}, ${height})
    return canvas.toDataURL("image/png")
  })()`)
}

/**
 * Assign a file (from a data URL) to a `<input type=file>` element and dispatch
 * trusted-equivalent `change`/`input` events, mirroring Playwright's `setInputFiles`.
 */
export async function uploadFile(
  view: CatalogView,
  inputSelector: string,
  dataUrl: string,
  fileName = "upload.png"
): Promise<void> {
  const safeSelector = inputSelector.replace(/`/g, "\\`")
  await view.evaluate(`(async () => {
    const input = document.querySelector(\`${safeSelector}\`)
    if (!input) throw new Error("no element matches selector: " + ${JSON.stringify(inputSelector)})
    const response = await fetch(${JSON.stringify(dataUrl)})
    const blob = await response.blob()
    const file = new File([blob], ${JSON.stringify(fileName)}, { type: blob.type })
    const transfer = new DataTransfer()
    transfer.items.add(file)
    input.files = transfer.files
    input.dispatchEvent(new Event("input", { bubbles: true }))
    input.dispatchEvent(new Event("change", { bubbles: true }))
    return true
  })()`)
}
