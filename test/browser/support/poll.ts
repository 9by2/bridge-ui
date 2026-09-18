export type PollOptions = {
  timeout?: number
  interval?: number
}

/**
 * Retry `fn` until it returns a truthy value or `timeout` elapses.
 * Mirrors Playwright's `expect.poll` retry semantics.
 */
export async function pollUntil<T>(fn: () => Promise<T> | T, options: PollOptions = {}): Promise<T> {
  const timeout = options.timeout ?? 5000
  const interval = options.interval ?? 50
  const deadline = Date.now() + timeout
  let lastError: unknown
  let lastValue: T | undefined
  while (Date.now() < deadline) {
    try {
      lastValue = await fn()
      if (lastValue) return lastValue
      lastError = undefined
    } catch (error) {
      lastError = error
    }
    await Bun.sleep(interval)
  }
  if (lastError !== undefined) {
    throw new Error(`pollUntil timed out after ${timeout}ms: ${String(lastError)}`)
  }
  throw new Error(`pollUntil timed out after ${timeout}ms; last value: ${JSON.stringify(lastValue)}`)
}

/**
 * Retry `fn` until `predicate(value)` is true or `timeout` elapses, returning the
 * satisfying value. Unlike `pollUntil`, a falsy-but-predicate-satisfying value (e.g.
 * `0`) is accepted. Mirrors Playwright's `expect.poll(fn).<matcher>()` pattern where
 * the caller still runs a final `expect()` assertion against the resolved value.
 */
export async function pollValue<T>(
  fn: () => Promise<T> | T,
  predicate: (value: T) => boolean,
  options: PollOptions = {}
): Promise<T> {
  const timeout = options.timeout ?? 5000
  const interval = options.interval ?? 50
  const deadline = Date.now() + timeout
  let lastValue: T | undefined
  let lastError: unknown
  for (;;) {
    try {
      lastValue = await fn()
      if (predicate(lastValue)) return lastValue
      lastError = undefined
    } catch (error) {
      lastError = error
    }
    if (Date.now() >= deadline) break
    await Bun.sleep(interval)
  }
  if (lastError !== undefined) {
    throw new Error(`pollValue timed out after ${timeout}ms: ${String(lastError)}`)
  }
  throw new Error(`pollValue timed out after ${timeout}ms; last value: ${JSON.stringify(lastValue)}`)
}
