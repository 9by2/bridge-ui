import type { CatalogView } from "./webview"

export type HeapSession = {
  collectGarbage: () => Promise<void>
  getHeapUsage: () => Promise<{ usedSize: number; totalSize: number }>
  getDomCounters: () => Promise<{ documents: number; nodes: number; jsEventListeners: number }>
}

/** Thin CDP wrappers over heap-profiling domains, used by memory regression tests. */
export function withHeapSession(view: CatalogView): HeapSession {
  return {
    async collectGarbage() {
      await view.cdp("HeapProfiler.collectGarbage")
    },
    async getHeapUsage() {
      return view.cdp("Runtime.getHeapUsage")
    },
    async getDomCounters() {
      return view.cdp("Memory.getDOMCounters")
    }
  }
}
