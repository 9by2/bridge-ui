import { expect } from "bun:test"

import type { Page } from "./page"
import { pollUntil } from "./poll"
import type { Locator } from "./query"

type MatcherResult = { pass: boolean; message: () => string }
type MatcherThisArg = { isNot: boolean }

/**
 * Retry `check` until it settles on the polarity the caller expects: for a plain
 * `expect(x).toFoo()` that means waiting for `pass: true`; for `expect(x).not.toFoo()`
 * (`isNot: true`) it means waiting for `pass: false` instead, so a `.not.` assertion on
 * a condition that's already false doesn't block for the full timeout.
 */
async function retryAssert(
  this_: MatcherThisArg,
  check: () => Promise<MatcherResult>,
  timeout = 5000
): Promise<MatcherResult> {
  const wantPass = !this_.isNot
  let last: MatcherResult = { pass: false, message: () => "assertion never ran" }
  try {
    const resolved = await pollUntil<MatcherResult | false>(
      async () => {
        last = await check()
        return last.pass === wantPass ? last : false
      },
      { timeout }
    )
    return resolved === false ? last : resolved
  } catch {
    return last
  }
}

expect.extend({
  async toBeVisible(this: MatcherThisArg, value: unknown) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const visible = await received.isVisible()
      return { pass: visible, message: () => `expected "${received.selector}" to be visible, got hidden/missing` }
    })
    return result
  },

  async toBeHidden(this: MatcherThisArg, value: unknown) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const hidden = await received.isHidden()
      return { pass: hidden, message: () => `expected "${received.selector}" to be hidden, got visible` }
    })
    return result
  },

  async toBeAttached(this: MatcherThisArg, value: unknown) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const attached = await received.isAttached()
      return { pass: attached, message: () => `expected "${received.selector}" to be attached to the DOM` }
    })
    return result
  },

  async toHaveText(this: MatcherThisArg, value: unknown, expected: string | RegExp) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const text = await received.text().catch(() => "")
      const pass = expected instanceof RegExp ? expected.test(text) : text === expected
      return { pass, message: () => `expected "${received.selector}" text to equal ${String(expected)}, got "${text}"` }
    })
    return result
  },

  async toContainText(this: MatcherThisArg, value: unknown, expected: string) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const text = await received.text().catch(() => "")
      const pass = text.includes(expected)
      return { pass, message: () => `expected "${received.selector}" text to contain "${expected}", got "${text}"` }
    })
    return result
  },

  async toHaveValue(this: MatcherThisArg, value: unknown, expected: string) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const actual = await received.evaluate<string>(`(el) => el?.value ?? ""`)
      return {
        pass: actual === expected,
        message: () => `expected "${received.selector}" value "${expected}", got "${actual}"`
      }
    })
    return result
  },

  async toHaveClass(this: MatcherThisArg, value: unknown, expected: string | RegExp) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const actual = await received.attr("class").catch(() => null)
      const pass = actual !== null && (expected instanceof RegExp ? expected.test(actual) : actual === expected)
      return {
        pass,
        message: () => `expected "${received.selector}" class to match ${String(expected)}, got "${actual}"`
      }
    })
    return result
  },

  async toHaveCSS(this: MatcherThisArg, value: unknown, property: string, cssValue: string | RegExp) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const actual = await received.css(property).catch(() => "")
      const pass = cssValue instanceof RegExp ? cssValue.test(actual) : actual === cssValue
      return {
        pass,
        message: () => `expected "${received.selector}" CSS ${property} to equal "${String(cssValue)}", got "${actual}"`
      }
    })
    return result
  },

  async toHaveAttribute(this: MatcherThisArg, value: unknown, name: string, attrValue?: string | RegExp) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const actual = await received.attr(name)
      const pass =
        attrValue === undefined
          ? actual !== null
          : attrValue instanceof RegExp
            ? actual !== null && attrValue.test(actual)
            : actual === attrValue
      return {
        pass,
        message: () =>
          `expected "${received.selector}" attribute ${name} to match ${String(attrValue)}, got "${actual}"`
      }
    })
    return result
  },

  async toHaveCount(this: MatcherThisArg, value: unknown, expected: number) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const actual = await received.count()
      return {
        pass: actual === expected,
        message: () => `expected "${received.selector}" count ${expected}, got ${actual}`
      }
    })
    return result
  },

  async toBeFocused(this: MatcherThisArg, value: unknown) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const focused = await received.evaluate<boolean>(`(el) => el === document.activeElement`)
      return { pass: !!focused, message: () => `expected "${received.selector}" to be focused` }
    })
    return result
  },

  async toBeEnabled(this: MatcherThisArg, value: unknown) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const enabled = await received.isEnabled()
      return { pass: enabled, message: () => `expected "${received.selector}" to be enabled` }
    })
    return result
  },

  async toBeDisabled(this: MatcherThisArg, value: unknown) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const disabled = await received.isDisabled()
      return { pass: disabled, message: () => `expected "${received.selector}" to be disabled` }
    })
    return result
  },

  async toBeChecked(this: MatcherThisArg, value: unknown) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const checked = await received.isChecked()
      return { pass: checked, message: () => `expected "${received.selector}" to be checked` }
    })
    return result
  },

  async toHaveURL(this: MatcherThisArg, value: unknown, pattern: RegExp | string) {
    const received = value as Page
    const result = await retryAssert(this, async () => {
      const url = await received.view.evaluate<string>("location.href")
      const pass = pattern instanceof RegExp ? pattern.test(url) : url === pattern
      return { pass, message: () => `expected view URL to match ${String(pattern)}, got "${url}"` }
    })
    return result
  },

  async toHaveJSProperty(this: MatcherThisArg, value: unknown, property: string, expected: unknown) {
    const received = value as Locator
    const result = await retryAssert(this, async () => {
      const actual = await received.evaluate(`(el) => el?.[${JSON.stringify(property)}]`)
      const pass = JSON.stringify(actual) === JSON.stringify(expected)
      return {
        pass,
        message: () =>
          `expected "${received.selector}" property ${property} to equal ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
      }
    })
    return result
  }
})

declare module "bun:test" {
  interface Matchers<T> {
    toBeVisible: () => Promise<T>
    toBeHidden: () => Promise<T>
    toBeAttached: () => Promise<T>
    toHaveText: (expected: string | RegExp) => Promise<T>
    toContainText: (expected: string) => Promise<T>
    toHaveValue: (expected: string) => Promise<T>
    toHaveClass: (expected: string | RegExp) => Promise<T>
    toHaveCSS: (property: string, value: string | RegExp) => Promise<T>
    toHaveAttribute: (name: string, value?: string | RegExp) => Promise<T>
    toHaveCount: (expected: number) => Promise<T>
    toBeFocused: () => Promise<T>
    toBeEnabled: () => Promise<T>
    toBeDisabled: () => Promise<T>
    toBeChecked: () => Promise<T>
    toHaveURL: (pattern: RegExp | string) => Promise<T>
    toHaveJSProperty: (property: string, value: unknown) => Promise<T>
  }
}
