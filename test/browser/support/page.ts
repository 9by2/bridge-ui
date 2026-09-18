import { CATALOG_BASE_URL } from "./env"
import { getByAltText, getByLabel, getByRole, getByText, getByTitle, locator, type Locator } from "./query"

export type OpenPageOptions = {
  width?: number
  height?: number
}

/**
 * Thin wrapper around `Bun.WebView` replicating the subset of Playwright's `Page` API
 * used by the catalog specs: relative navigation against `CATALOG_BASE_URL`, locator
 * factories, viewport resize, keyboard/mouse, page-error capture, and media emulation.
 */
export class Page {
  readonly view: Bun.WebView
  readonly errors: string[] = []
  private navigated = false

  constructor(view: Bun.WebView, errors: string[]) {
    this.view = view
    this.errors = errors
  }

  static async open(options: OpenPageOptions = {}): Promise<Page> {
    const errors: string[] = []
    const view = new Bun.WebView({
      width: options.width ?? 1280,
      height: options.height ?? 720,
      backend: { type: "chrome", url: false },
      console(type, ...args) {
        if (type === "error") errors.push(args.map((value) => String(value)).join(" "))
      }
    })
    return new Page(view, errors)
  }

  async goto(path: string): Promise<void> {
    const url = /^[a-z]+:/i.test(path) ? path : `${CATALOG_BASE_URL}${path}`
    const target = new URL(url)
    const wasNavigated = this.navigated
    await this.ensureCdpSession()

    if (wasNavigated) {
      // `view.url` only reflects the last URL passed to `view.navigate()` — it does not
      // track in-page `history.pushState`/`location.hash` changes made by the catalog's
      // router (or by a prior same-document `goto()` below), so the live document
      // location must be read to detect a same-document navigation reliably.
      const currentHref = await this.view.evaluate<string>("location.href")
      const current = new URL(currentHref)
      const sameDocument =
        target.origin === current.origin && target.pathname + target.search === current.pathname + current.search
      if (sameDocument) {
        // `Bun.WebView.navigate()` waits for the main frame's `load` event, which never
        // fires for a hash-only change on the same document (no navigation occurs). The
        // catalog's router reacts to `hashchange`, so set the hash in-page instead —
        // mirrors how a real user clicking an in-app link would transition routes.
        await this.view.evaluate(
          `(() => { location.hash = ${JSON.stringify(target.hash.replace(/^#/, ""))}; return true })()`
        )
        return
      }
    }

    await this.view.navigate(url)
  }

  /**
   * `view.cdp()` requires a prior navigation to establish the CDP session, so this always
   * performs one throwaway `about:blank` navigation on first use — whether triggered by
   * the first `goto()` or by an out-of-order call like `page.emulateMedia()` before any
   * navigation (a pattern Playwright specs use). Also pins `prefers-color-scheme: light`
   * to match Playwright's Chromium default; headless Chrome otherwise defaults to dark,
   * which throws off examples keyed off the system color scheme (e.g. TsChart's
   * `Canvas`/`CanvasText`-backed inputs) rather than the app's own `theme=` query param.
   */
  private async ensureCdpSession(): Promise<void> {
    if (this.navigated) return
    await this.view.navigate("about:blank")
    await this.view.cdp("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-color-scheme", value: "light" }]
    })
    this.navigated = true
  }

  async reload(): Promise<void> {
    await this.view.reload()
  }

  async setViewportSize(size: { width: number; height: number }): Promise<void> {
    await this.ensureCdpSession()
    await this.view.resize(size.width, size.height)
  }

  async evaluate<T = unknown>(fn: string): Promise<T> {
    return this.view.evaluate<T>(`(${fn})()`)
  }

  locator(selector: string): Locator {
    return locator(this.view, selector)
  }

  getByRole(role: string, options?: { name?: string; exact?: boolean }): Locator {
    return getByRole(this.view, role, options)
  }

  getByText(text: string, options?: { exact?: boolean }): Locator {
    return getByText(this.view, text, options)
  }

  getByLabel(text: string, options?: { exact?: boolean }): Locator {
    return getByLabel(this.view, text, options)
  }

  getByTitle(text: string, options?: { exact?: boolean }): Locator {
    return getByTitle(this.view, text, options)
  }

  getByAltText(text: string, options?: { exact?: boolean }): Locator {
    return getByAltText(this.view, text, options)
  }

  async pressKey(key: Bun.WebView.VirtualKey | (string & {}), options?: Bun.WebView.PressOptions): Promise<void> {
    await this.view.press(key, options)
  }

  async moveMouse(x: number, y: number): Promise<void> {
    await this.ensureCdpSession()
    await this.view.cdp("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "none" })
  }

  /** `Emulation.setEmulatedMedia` — replaces Playwright's `page.emulateMedia()`. */
  async emulateMedia(options: { reducedMotion?: "reduce" | "no-preference" }): Promise<void> {
    await this.ensureCdpSession()
    // `setEmulatedMedia` replaces the full feature list on every call rather than merging
    // with a prior call, so the light-mode default from `ensureCdpSession()` must be
    // re-asserted here too, or a bare `emulateMedia({ reducedMotion })` call would revert
    // `prefers-color-scheme` to headless Chrome's dark default.
    const features: Array<{ name: string; value: string }> = [{ name: "prefers-color-scheme", value: "light" }]
    if (options.reducedMotion) features.push({ name: "prefers-reduced-motion", value: options.reducedMotion })
    await this.view.cdp("Emulation.setEmulatedMedia", { features })
  }

  async grantClipboardPermission(): Promise<void> {
    await this.ensureCdpSession()
    await this.view.cdp("Browser.grantPermissions", {
      permissions: ["clipboardReadWrite", "clipboardSanitizedWrite"]
    })
  }

  get url(): string {
    return this.view.url
  }

  async close(): Promise<void> {
    this.view.close()
  }

  [Symbol.asyncDispose](): Promise<void> {
    return this.close()
  }
}

export async function openPage(options: OpenPageOptions = {}): Promise<Page> {
  return Page.open(options)
}
