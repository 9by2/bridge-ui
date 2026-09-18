# Spec: Bun.WebView Test Harness

**Spec ID:** `webview-harness`
**Proposal:** `webview-migration`
**Status:** accepted

## Summary

A reusable `test/browser/support/` module set providing the minimum surface needed to port all 26 Playwright catalog specs to `bun:test` + `Bun.WebView`: view lifecycle, CSS/role-based locators, polling, custom assertion matchers, accessibility audit, screenshot diffing, file upload, and CDP heap-profiling passthrough.

## Requirements

### REQ-001 View lifecycle

`openCatalog(hashPath: string, options?: { width?: number; height?: number }): Promise<Bun.WebView>` navigates a fresh Chrome-backend `Bun.WebView` to `${CATALOG_BASE_URL}${hashPath}` and returns it disposable via `Symbol.asyncDispose` (usable with `await using`).

**Acceptance:**

- [ ] `await using view = await openCatalog("/?preview#button/default")` navigates successfully and `view.url` matches the requested path.
- [ ] Omitting `width`/`height` defaults to 1280×720.
- [ ] Disposing the view closes it without throwing even if a prior assertion failed.

### REQ-002 CSS locator

`locator(view, selector: string)` returns an object with `click(options?)`, `text(): Promise<string>`, `count(): Promise<number>`, `boundingBox(): Promise<{x,y,width,height} | null>`, `css(prop: string): Promise<string>`, `attr(name: string): Promise<string | null>`, `isVisible(): Promise<boolean>`, `focus(): Promise<void>`, `evaluate<T>(fn: string): Promise<T>`.

**Acceptance:**

- [ ] `locator(view, "button").click()` waits for actionability (delegates to `view.click(selector)`) then clicks.
- [ ] `.count()` returns 0 for a selector matching nothing (no throw).
- [ ] `.boundingBox()` returns `null` when the element does not exist.
- [ ] `.css("width")` returns the computed style string (e.g. `"16px"`).

### REQ-003 Role-based locator

`byRole(view, role: string, options?: { name?: string; exact?: boolean }): RoleLocator` builds a locator scoped to elements whose explicit `role` attribute or implicit HTML role matches `role`, filtered by accessible name (`aria-label`, `aria-labelledby`, or trimmed text content) when `name` is given.

**Acceptance:**

- [ ] Covers roles used across the 26 specs: `button`, `tab`, `tabpanel`, `menu`, `menuitem`, `menuitemcheckbox`, `menuitemradio`, `dialog`, `combobox`, `option`, `alert`, `status`, `navigation`, `link`, `region`, `separator`, `checkbox`, `switch`, `radio`, `slider`.
- [ ] `{ exact: true }` requires exact string equality of accessible name; default is substring/trim match (mirrors Playwright's default `getByRole` behavior).
- [ ] Returned handle supports the same methods as `locator()` (composes REQ-002).

### REQ-004 Polling

`pollUntil<T>(fn: () => Promise<T> | T, options?: { timeout?: number; interval?: number }): Promise<T>` retries `fn` until it returns a truthy/non-throwing result or `timeout` (default 5000ms) elapses, then throws the last error.

**Acceptance:**

- [ ] Resolves as soon as `fn` returns a truthy value.
- [ ] Throws a descriptive timeout error including the last observed value/error when exceeded.

### REQ-005 Assertion matchers

`test/browser/support/matcher.ts` registers `expect.extend` matchers: `toBeVisible`, `toHaveText(expected: string | RegExp)`, `toContainText(expected: string)`, `toHaveCSS(prop, value)`, `toHaveAttribute(name, value?)`, `toHaveCount(n)`, `toBeFocused()`, `toBeEnabled()` / `toBeDisabled()`, `toHaveURL(pattern: RegExp)`, `toHaveJSProperty(prop, value)`. All matchers accept a `locator`-shaped object (from REQ-002/REQ-003) or a `Bun.WebView` for `toHaveURL`, and internally poll (REQ-004) for up to 5s before failing, matching Playwright's auto-retrying `expect()`.

**Acceptance:**

- [ ] Each matcher passes/fails identically to its Playwright counterpart against the same DOM fixture used in the harness's own tests.
- [ ] Matchers produce a readable failure message including selector and actual vs. expected value.

### REQ-006 Accessibility audit

`runAxe(view, options?: { tags?: string[] }): Promise<{ violations: unknown[]; incomplete: unknown[] }>` injects `axe-core/axe.min.js` (resolved via `import.meta.resolve`, once per view) and runs `axe.run(document, { runOnly: { type: "tag", values: options.tags ?? ["wcag2a","wcag2aa","wcag21aa"] } })`.

**Acceptance:**

- [ ] Returns the same shape (`violations`, `incomplete`) as `@axe-core/playwright`'s `AxeBuilder.analyze()` result subset used today.
- [ ] Re-injecting into the same view a second time is a no-op (checks `window.axe` first).

### REQ-007 Screenshot diff

`expectScreenshot(view, name: string, options?: { threshold?: number }): Promise<void>` captures `view.screenshot({ format: "png" })`, compares byte-for-byte decoded pixels against `test/browser/support/__screenshot__/<name>-<process.platform>.png` using `pixelmatch`, and throws with a diff-pixel count if the mismatch ratio exceeds `options.threshold` (default 0.01). Writes `actual`/`diff` PNGs under `.eval/screenshot-failures/<name>/` on mismatch. Honors `BUN_UPDATE_SNAPSHOTS=1` to write/overwrite the baseline instead of comparing.

**Acceptance:**

- [ ] First run with `BUN_UPDATE_SNAPSHOTS=1` and no existing baseline creates one and passes.
- [ ] Subsequent identical screenshot passes without writing diff artifacts.
- [ ] A deliberately altered viewport fails with a clear mismatch-ratio message.

### REQ-008 File upload

`makeTestPng(width: number, height: number, color: string): Promise<string>` (runs in-page via `view.evaluate`, canvas → `toDataURL`) and `uploadFile(view, inputSelector: string, dataUrl: string, fileName?: string): Promise<void>` (in-page: fetch the data URL, construct a `File`, assign to the input's `files` via `DataTransfer`, dispatch trusted-equivalent `change` + `input` events).

**Acceptance:**

- [ ] After `uploadFile`, `input.files[0].name` and `.type` match expectations in-page.
- [ ] Triggers the same React `onChange` handling the app expects (verified against `upload.spec.ts`'s existing assertions after conversion).

### REQ-009 CDP heap helpers

`withHeapSession(view)` returns `{ collectGarbage(), getHeapUsage(), getDomCounters() }` thin wrappers over `view.cdp("HeapProfiler.collectGarbage")`, `view.cdp("Runtime.getHeapUsage")`, `view.cdp("Memory.getDOMCounters")`.

**Acceptance:**

- [ ] `memory.test.ts`'s 8-cycle leak-regression assertions produce equivalent pass/fail behavior to the Playwright original.

## Schema / API

```typescript
// test/browser/support/index.ts
export { CATALOG_BASE_URL } from "./env"
export { openCatalog } from "./webview"
export { locator, type Locator } from "./locator"
export { byRole, type RoleLocator } from "./role"
export { pollUntil } from "./poll"
export { runAxe } from "./axe"
export { expectScreenshot } from "./screenshot"
export { makeTestPng, uploadFile } from "./upload"
export { withHeapSession } from "./cdp"
export { expect } from "bun:test" // re-export after ./matcher side-effect import
```

## Examples

### Role + CSS assertion (from `tab-example.test.ts`)

**Input:**

```typescript
await using view = await openCatalog("/?preview&theme=dark#tabs/default")
const icon = locator(view, byRole(view, "tab", { name: "Todo 4" }).selector + " svg")
```

**Output:**

```json
{ "visible": true, "width": "16px", "height": "16px" }
```

## Non-Goals

- Cross-browser (WebKit) CI matrix.
- Network interception / `page.route` equivalent (unused by any current spec).
- Multiple browser contexts / storage-state isolation (unused by any current spec).
- Video recording or trace viewer parity.
