import "./matcher"

export { CATALOG_BASE_URL } from "./env"
export { openPage, Page, type OpenPageOptions } from "./page"
export {
  locator,
  getByRole,
  getByText,
  getByLabel,
  getByTitle,
  getByAltText,
  type Locator,
  type ByOptions,
  type TextOptions,
  type BoundingBox
} from "./query"
export { pollUntil, pollValue, type PollOptions } from "./poll"
export { runAxe, type AxeResult, type RunAxeOptions } from "./axe"
export { expectScreenshot, type ExpectScreenshotOptions } from "./screenshot"
export { makeTestPng, uploadFile } from "./upload"
export { withHeapSession, type HeapSession } from "./cdp"
export { expect, test, describe, beforeEach, afterEach, beforeAll, afterAll } from "bun:test"
