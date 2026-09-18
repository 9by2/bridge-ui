import { pollUntil } from "./poll"
import { ensureRuntime } from "./runtime"
import type { CatalogView } from "./webview"

export type ByOptions = { name?: string; exact?: boolean }
export type TextOptions = { exact?: boolean }

type Step =
  | { kind: "css"; selector: string }
  | { kind: "role"; role: string; name?: string; exact: boolean }
  | { kind: "text"; text: string; exact: boolean }
  | { kind: "label"; text: string; exact: boolean }
  | { kind: "title"; text: string; exact: boolean }
  | { kind: "alt"; text: string; exact: boolean }
  | { kind: "frame" }
  | { kind: "nth"; index: number }
  | { kind: "first" }
  | { kind: "last" }

function stepExpr(step: Step): string {
  switch (step.kind) {
    case "css":
      if (step.selector === "..") return `roots.map((el) => el.parentElement).filter(Boolean)`
      return `window.__wv.queryCss(roots, ${JSON.stringify(step.selector)})`
    case "role":
      return `window.__wv.queryRole(roots, ${JSON.stringify(step.role)}, ${
        step.name === undefined ? "null" : JSON.stringify(step.name)
      }, ${step.exact})`
    case "text":
      return `window.__wv.queryText(roots, ${JSON.stringify(step.text)}, ${step.exact})`
    case "label":
      return `window.__wv.queryLabel(roots, ${JSON.stringify(step.text)}, ${step.exact})`
    case "title":
      return `window.__wv.queryTitle(roots, ${JSON.stringify(step.text)}, ${step.exact})`
    case "alt":
      return `window.__wv.queryAlt(roots, ${JSON.stringify(step.text)}, ${step.exact})`
    case "frame":
      return `window.__wv.toFrameDocument(roots)`
    case "nth":
      return `[roots[${step.index}]].filter(Boolean)`
    case "first":
      return `[roots[0]].filter(Boolean)`
    case "last":
      return `[roots[roots.length - 1]].filter(Boolean)`
  }
}

function buildRootsExpr(steps: Step[]): string {
  let expr = "[document]"
  for (const step of steps) {
    expr = `((roots) => (${stepExpr(step)}))(${expr})`
  }
  return expr
}

function describeSteps(steps: Step[]): string {
  if (steps.length === 0) return "document"
  return steps
    .map((step) => {
      switch (step.kind) {
        case "css":
          return step.selector
        case "role":
          return `role=${step.role}${step.name ? `[name="${step.name}"]` : ""}`
        case "text":
          return `text="${step.text}"`
        case "label":
          return `label="${step.text}"`
        case "title":
          return `title="${step.text}"`
        case "alt":
          return `alt="${step.text}"`
        case "frame":
          return "contentFrame()"
        case "nth":
          return `nth(${step.index})`
        case "first":
          return "first()"
        case "last":
          return "last()"
      }
    })
    .join(" >> ")
}

async function evalOnRoots<T>(view: CatalogView, steps: Step[], body: string): Promise<T> {
  await ensureRuntime(view)
  const rootsExpr = buildRootsExpr(steps)
  return view.evaluate<T>(`(() => { const roots = ${rootsExpr}; ${body} })()`)
}

export type BoundingBox = { x: number; y: number; width: number; height: number }

export type Locator = {
  readonly steps: Step[]
  readonly selector: string
  locator: (selector: string) => Locator
  getByRole: (role: string, options?: ByOptions) => Locator
  getByText: (text: string, options?: TextOptions) => Locator
  getByLabel: (text: string, options?: TextOptions) => Locator
  getByTitle: (text: string, options?: TextOptions) => Locator
  getByAltText: (text: string, options?: TextOptions) => Locator
  first: () => Locator
  last: () => Locator
  nth: (index: number) => Locator
  contentFrame: () => Locator
  all: () => Promise<Locator[]>
  allTextContents: () => Promise<string[]>
  count: () => Promise<number>
  click: (options?: Bun.WebView.ClickOptions) => Promise<void>
  hover: () => Promise<void>
  fill: (value: string) => Promise<void>
  selectOption: (value: string) => Promise<void>
  press: (key: Bun.WebView.VirtualKey | (string & {}), options?: Bun.WebView.PressOptions) => Promise<void>
  focus: () => Promise<void>
  blur: () => Promise<void>
  text: () => Promise<string>
  attr: (name: string) => Promise<string | null>
  css: (property: string) => Promise<string>
  boundingBox: () => Promise<BoundingBox | null>
  isVisible: () => Promise<boolean>
  isHidden: () => Promise<boolean>
  isEnabled: () => Promise<boolean>
  isDisabled: () => Promise<boolean>
  isChecked: () => Promise<boolean>
  isAttached: () => Promise<boolean>
  evaluate: <T = unknown>(fn: string) => Promise<T>
  scrollIntoViewIfNeeded: () => Promise<void>
  setInputFiles: (files: Array<{ name: string; mimeType: string; content: string }>) => Promise<void>
}

function makeLocator(view: CatalogView, steps: Step[]): Locator {
  const chain = (step: Step) => makeLocator(view, [...steps, step])

  /** Poll until at least one element matches, mirroring Playwright's implicit locator wait. */
  async function waitForFirst(timeout = 5000): Promise<void> {
    await pollUntil(() => evalOnRoots<number>(view, steps, `return roots.length`), { timeout })
  }

  async function waitForClickPoint(): Promise<{ x: number; y: number }> {
    return pollUntil(
      async () => {
        const point = await evalOnRoots<{ x: number; y: number } | null>(
          view,
          steps,
          `const el = roots[0]
           if (!el) return null
           const rect = el.getBoundingClientRect()
           // Only scroll when the element isn't already within the viewport — an
           // unconditional \`scrollIntoView()\` call disrupts the WebKit/Chrome headless
           // focus state even when it's a no-op, which breaks subsequent Tab-order
           // assertions (observed: a trigger hovered via a point that required scroll
           // loses \`document.activeElement\` reachability on the next Tab press).
           const outOfView = rect.top < 0 || rect.left < 0 || rect.bottom > innerHeight || rect.right > innerWidth
           if (outOfView) el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" })
           const finalRect = outOfView ? el.getBoundingClientRect() : rect
           if (finalRect.width <= 0 || finalRect.height <= 0) return null
           return { x: finalRect.x + finalRect.width / 2, y: finalRect.y + finalRect.height / 2 }`
        )
        if (!point) throw new Error(`no actionable element for locator: ${describeSteps(steps)}`)
        return point
      },
      { timeout: 5000 }
    )
  }

  return {
    steps,

    get selector() {
      return describeSteps(steps)
    },

    locator(selector) {
      return chain({ kind: "css", selector })
    },
    getByRole(role, options = {}) {
      return chain({ kind: "role", role, name: options.name, exact: options.exact ?? false })
    },
    getByText(text, options = {}) {
      return chain({ kind: "text", text, exact: options.exact ?? false })
    },
    getByLabel(text, options = {}) {
      return chain({ kind: "label", text, exact: options.exact ?? false })
    },
    getByTitle(text, options = {}) {
      return chain({ kind: "title", text, exact: options.exact ?? false })
    },
    getByAltText(text, options = {}) {
      return chain({ kind: "alt", text, exact: options.exact ?? false })
    },
    first() {
      return chain({ kind: "first" })
    },
    last() {
      return chain({ kind: "last" })
    },
    nth(index) {
      return chain({ kind: "nth", index })
    },
    contentFrame() {
      return chain({ kind: "frame" })
    },

    async all() {
      const total = await this.count()
      return Array.from({ length: total }, (_, index) => chain({ kind: "nth", index }))
    },
    async allTextContents() {
      return evalOnRoots<string[]>(view, steps, `return roots.map((el) => (el.textContent ?? "").trim())`)
    },
    async count() {
      return evalOnRoots<number>(view, steps, `return roots.length`)
    },

    async click(options) {
      const { x, y } = await waitForClickPoint()
      await view.click(x, y, options)
    },
    async hover() {
      const { x, y } = await waitForClickPoint()
      await view.cdp("Input.dispatchMouseEvent", { type: "mouseMoved", x, y, button: "none" })
    },
    async fill(value) {
      // Real typing (not a synthetic value-setter + dispatchEvent) so frameworks that
      // key filtering/popup-open logic off trusted `beforeinput`/`input` events (Base UI's
      // Combobox, for example) behave the same as with real user input. Mirrors
      // Playwright's `locator.fill()`, which also clears via select-all then re-types.
      await this.focus()
      await evalOnRoots<boolean>(
        view,
        steps,
        `const el = roots[0]
         if (!el) throw new Error("fill: no element")
         el.select?.()
         window.__wv.setNativeValue(el, "")
         el.dispatchEvent(new Event("input", { bubbles: true }))
         return true`
      )
      if (value.length > 0) await view.type(value)
      await evalOnRoots<boolean>(
        view,
        steps,
        `const el = roots[0]
         if (el) el.dispatchEvent(new Event("change", { bubbles: true }))
         return true`
      )
    },
    async selectOption(value) {
      await pollUntil(() =>
        evalOnRoots<boolean>(
          view,
          steps,
          `const el = roots[0]
           if (!el) throw new Error("selectOption: no element")
           window.__wv.setNativeValue(el, ${JSON.stringify(value)})
           el.dispatchEvent(new Event("input", { bubbles: true }))
           el.dispatchEvent(new Event("change", { bubbles: true }))
           return true`
        )
      )
    },
    async press(key, options) {
      await this.focus()
      await view.press(key, options)
    },
    async focus() {
      await pollUntil(() =>
        evalOnRoots<boolean>(
          view,
          steps,
          `const el = roots[0]
           if (!el) throw new Error("focus: no element")
           el.focus()
           return true`
        )
      )
    },
    async blur() {
      await evalOnRoots<boolean>(
        view,
        steps,
        `const el = roots[0]
         if (!el) return false
         el.blur()
         return true`
      )
    },
    async text() {
      return pollUntil(async () => {
        const value = await evalOnRoots<string | null>(
          view,
          steps,
          `const el = roots[0]; return el ? (el.textContent ?? "").trim() : null`
        )
        if (value === null) throw new Error(`no element matches locator: ${describeSteps(steps)}`)
        return value
      })
    },
    async attr(name) {
      await waitForFirst()
      return evalOnRoots<string | null>(
        view,
        steps,
        `const el = roots[0]; return el ? el.getAttribute(${JSON.stringify(name)}) : null`
      )
    },
    async css(property) {
      return pollUntil(async () => {
        const value = await evalOnRoots<string | null>(
          view,
          steps,
          `const el = roots[0]
           if (!el) return null
           return getComputedStyle(el).getPropertyValue(${JSON.stringify(property)})`
        )
        if (value === null) throw new Error(`no element matches locator: ${describeSteps(steps)}`)
        return value
      })
    },
    async boundingBox() {
      await waitForFirst().catch(() => {})
      return evalOnRoots<BoundingBox | null>(
        view,
        steps,
        `const el = roots[0]
         if (!el) return null
         const rect = el.getBoundingClientRect()
         return { x: rect.x, y: rect.y, width: rect.width, height: rect.height }`
      )
    },
    async isVisible() {
      return evalOnRoots<boolean>(view, steps, `const el = roots[0]; return el ? window.__wv.isVisible(el) : false`)
    },
    async isHidden() {
      return !(await this.isVisible())
    },
    async isEnabled() {
      await waitForFirst().catch(() => {})
      return evalOnRoots<boolean>(
        view,
        steps,
        `const el = roots[0]
         if (!el) return false
         return !el.disabled && el.getAttribute("aria-disabled") !== "true"`
      )
    },
    async isDisabled() {
      await waitForFirst().catch(() => {})
      return evalOnRoots<boolean>(
        view,
        steps,
        `const el = roots[0]
         if (!el) return false
         return !!el.disabled || el.getAttribute("aria-disabled") === "true"`
      )
    },
    async isChecked() {
      await waitForFirst().catch(() => {})
      return evalOnRoots<boolean>(
        view,
        steps,
        `const el = roots[0]
         if (!el) return false
         return el.getAttribute("aria-checked") === "true" || !!el.checked`
      )
    },
    async isAttached() {
      return evalOnRoots<boolean>(view, steps, `return roots.length > 0 && !!roots[0]?.isConnected`)
    },
    async evaluate(fn) {
      await waitForFirst().catch(() => {})
      return evalOnRoots(view, steps, `return (${fn})(roots[0])`)
    },
    async scrollIntoViewIfNeeded() {
      await evalOnRoots<boolean>(
        view,
        steps,
        `const el = roots[0]
         if (!el) return false
         el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" })
         return true`
      )
    },
    async setInputFiles(files) {
      await evalOnRoots<boolean>(
        view,
        steps,
        `const el = roots[0]
         if (!el) throw new Error("setInputFiles: no element")
         const files = ${JSON.stringify(files)}
         const transfer = new DataTransfer()
         for (const f of files) {
           const binary = atob(f.content)
           const bytes = new Uint8Array(binary.length)
           for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
           transfer.items.add(new File([bytes], f.name, { type: f.mimeType }))
         }
         el.files = transfer.files
         el.dispatchEvent(new Event("input", { bubbles: true }))
         el.dispatchEvent(new Event("change", { bubbles: true }))
         return true`
      )
    }
  }
}

export function locator(view: CatalogView, selector: string): Locator {
  return makeLocator(view, [{ kind: "css", selector }])
}

export function getByRole(view: CatalogView, role: string, options: ByOptions = {}): Locator {
  return makeLocator(view, [{ kind: "role", role, name: options.name, exact: options.exact ?? false }])
}

export function getByText(view: CatalogView, text: string, options: TextOptions = {}): Locator {
  return makeLocator(view, [{ kind: "text", text, exact: options.exact ?? false }])
}

export function getByLabel(view: CatalogView, text: string, options: TextOptions = {}): Locator {
  return makeLocator(view, [{ kind: "label", text, exact: options.exact ?? false }])
}

export function getByTitle(view: CatalogView, text: string, options: TextOptions = {}): Locator {
  return makeLocator(view, [{ kind: "title", text, exact: options.exact ?? false }])
}

export function getByAltText(view: CatalogView, text: string, options: TextOptions = {}): Locator {
  return makeLocator(view, [{ kind: "alt", text, exact: options.exact ?? false }])
}
