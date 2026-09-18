import type { CatalogView } from "./webview"

/**
 * In-page helper library injected once per view. Provides the query primitives
 * (`byRole`/`byText`/`byLabel`/`byTitle`/`byAlt`, accessible-name computation,
 * visibility, native value setters) that back the chainable locator API, mirroring
 * the subset of Playwright's locator engine the catalog specs rely on.
 */
const RUNTIME_SOURCE = `(() => {
  if (window.__wv) return true
  const IMPLICIT_ROLE = [
    [/* button */ "button, [type=button], [type=submit], [type=reset]", "button"],
    ["a[href]", "link"],
    ["input:not([type]), input[type=text], input[type=email], input[type=search], textarea", "textbox"],
    ["input[type=checkbox]", "checkbox"],
    ["input[type=radio]", "radio"],
    ["input[type=range]", "slider"],
    ["select", "combobox"],
    ["img", "img"],
    ["h1, h2, h3, h4, h5, h6", "heading"],
    ["nav", "navigation"],
    ["ul, ol", "list"],
    ["li", "listitem"],
    ["option", "option"],
    ["table", "table"],
    ["tr", "row"],
    ["progress", "progressbar"],
    ["section[aria-label], section[aria-labelledby]", "region"],
    ["dialog", "dialog"]
  ]

  function implicitRole(el) {
    for (const [selector, role] of IMPLICIT_ROLE) {
      if (el.matches(selector)) return role
    }
    return null
  }

  function elementRole(el) {
    return el.getAttribute("role") || implicitRole(el)
  }

  function accessibleName(el) {
    const labelledBy = el.getAttribute("aria-labelledby")
    if (labelledBy) {
      const parts = labelledBy
        .split(/\\s+/)
        .map((id) => document.getElementById(id)?.textContent?.trim() ?? "")
        .filter(Boolean)
      if (parts.length) return parts.join(" ")
    }
    const label = el.getAttribute("aria-label")
    if (label) return label.trim()
    if ((el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT") && el.id) {
      const forLabel = document.querySelector(\`label[for="\${el.id}"]\`)
      if (forLabel) return forLabel.textContent?.trim() ?? ""
    }
    const closestLabel = el.closest?.("label")
    if (closestLabel) return closestLabel.textContent?.trim() ?? ""
    if (el.tagName === "IMG") return (el.getAttribute("alt") ?? "").trim()
    return (el.textContent ?? "").trim()
  }

  function nameMatches(actual, wanted, exact) {
    if (wanted === null || wanted === undefined) return true
    return exact ? actual === wanted : actual.includes(wanted)
  }

  function flattenRoots(roots) {
    const out = []
    for (const root of roots) {
      if (root == null) continue
      out.push(root)
    }
    return out
  }

  function queryCss(roots, selector) {
    const out = []
    for (const root of flattenRoots(roots)) {
      out.push(...Array.from(root.querySelectorAll(selector)))
    }
    return out
  }

  function queryRole(roots, role, name, exact) {
    const out = []
    for (const root of flattenRoots(roots)) {
      const scope = root.querySelectorAll ? root : document
      for (const el of scope.querySelectorAll("*")) {
        if (elementRole(el) !== role) continue
        if (!isAccessible(el)) continue
        if (!nameMatches(accessibleName(el), name, exact)) continue
        out.push(el)
      }
    }
    return out
  }

  /**
   * "Visible text" of an element per Playwright's \`getByText()\`: the concatenation of
   * this element's own text plus visible descendant text, skipping \`aria-hidden="true"\`
   * subtrees (decorative icons, arrow/pointer elements) that don't contribute to the
   * accessible/visible label even though they sit inside the same container.
   */
  function visibleText(el) {
    let out = ""
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        out += node.textContent
      } else if (node.nodeType === Node.ELEMENT_NODE && node.getAttribute("aria-hidden") !== "true") {
        out += visibleText(node)
      }
    }
    return out
  }

  function queryText(roots, text, exact) {
    const matches = []
    for (const root of flattenRoots(roots)) {
      const scope = root.querySelectorAll ? root : document
      for (const el of scope.querySelectorAll("*")) {
        if (!isAccessible(el)) continue
        const content = visibleText(el).trim()
        if (!content) continue
        if (nameMatches(content, text, exact)) matches.push(el)
      }
    }
    // Keep only the innermost matching element in each ancestor chain, mirroring
    // Playwright's \`getByText()\` (which owns the text at its most specific container,
    // not every ancestor that happens to also contain it).
    return matches.filter((el) => !matches.some((other) => other !== el && el.contains(other)))
  }

  function queryLabel(roots, text, exact) {
    const out = []
    for (const root of flattenRoots(roots)) {
      const scope = root.querySelectorAll ? root : document
      for (const el of scope.querySelectorAll("input, textarea, select, [aria-label], [role]")) {
        if (!isAccessible(el)) continue
        const name = accessibleName(el)
        if (!name) continue
        if (nameMatches(name, text, exact)) out.push(el)
      }
    }
    return out
  }

  function queryTitle(roots, text, exact) {
    const out = []
    for (const root of flattenRoots(roots)) {
      const scope = root.querySelectorAll ? root : document
      for (const el of scope.querySelectorAll("[title]")) {
        const title = el.getAttribute("title") ?? ""
        if (nameMatches(title, text, exact)) out.push(el)
      }
    }
    return out
  }

  function queryAlt(roots, text, exact) {
    const out = []
    for (const root of flattenRoots(roots)) {
      const scope = root.querySelectorAll ? root : document
      for (const el of scope.querySelectorAll("img[alt], [role=img][aria-label]")) {
        if (!isAccessible(el)) continue
        const alt = el.getAttribute("alt") ?? el.getAttribute("aria-label") ?? ""
        if (nameMatches(alt, text, exact)) out.push(el)
      }
    }
    return out
  }

  function toFrameDocument(roots) {
    const out = []
    for (const root of flattenRoots(roots)) {
      if (root.tagName === "IFRAME" && root.contentDocument) out.push(root.contentDocument)
    }
    return out
  }

  function isVisible(el) {
    if (!el || !el.isConnected) return false
    const style = getComputedStyle(el)
    if (style.visibility === "hidden" || style.display === "none" || Number(style.opacity) === 0) return false
    // \`display: contents\` elements never have their own box (rect is always
    // zero-sized) but still render their children, so Playwright's visibility
    // algorithm treats them as visible; fall through without the size check.
    if (style.display === "contents") return true
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }

  /**
   * Accessibility-tree presence check used to scope role/text/label/title/alt queries,
   * mirroring what Playwright's \`getByRole()\`/\`getByText()\` locate through: excludes
   * elements hidden by rendering (zero size, \`display: none\`, \`visibility: hidden\`) as
   * well as elements removed from the accessibility tree via \`aria-hidden="true"\` or
   * \`inert\` on themselves or an ancestor (a common pattern for off-screen duplicate
   * measurement subtrees, e.g. cmdk's closed-list clone).
   */
  function isAccessible(el) {
    if (!isVisible(el)) return false
    if (el.closest("[aria-hidden='true'], [inert]")) return false
    return true
  }

  function setNativeValue(el, value) {
    const proto =
      el.tagName === "TEXTAREA"
        ? window.HTMLTextAreaElement.prototype
        : el.tagName === "SELECT"
          ? window.HTMLSelectElement.prototype
          : window.HTMLInputElement.prototype
    const descriptor = Object.getOwnPropertyDescriptor(proto, "value")
    descriptor.set.call(el, value)
  }

  function tag(elements, attr) {
    document.querySelectorAll(\`[\${attr}]\`).forEach((el) => el.removeAttribute(attr))
    elements.forEach((el, index) => el.setAttribute(attr, String(index)))
    return elements.length
  }

  window.__wv = {
    accessibleName,
    elementRole,
    queryCss,
    queryRole,
    queryText,
    queryLabel,
    queryTitle,
    queryAlt,
    toFrameDocument,
    isVisible,
    setNativeValue,
    tag
  }
  return true
})()`

/**
 * Inject the in-page query runtime into a view. Idempotent within a single document —
 * the runtime script itself no-ops if `window.__wv` already exists — and safe to call
 * again after navigation, since a new document has no `window.__wv` yet.
 */
export async function ensureRuntime(view: CatalogView): Promise<void> {
  await view.evaluate(RUNTIME_SOURCE)
}
