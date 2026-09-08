import { createStylexBunPlugin } from "@stylexjs/unplugin/bun"
import type { BunPlugin, PluginBuilder } from "bun"

export function createPackageStylexPlugin(options: Parameters<typeof createStylexBunPlugin>[0]): BunPlugin {
  const plugin = createStylexBunPlugin(options)
  return {
    name: "bridge-stylex",
    setup(builder) {
      let pending = Promise.resolve<unknown>(undefined)
      return plugin.setup({
        ...builder,
        onLoad(filter: Parameters<PluginBuilder["onLoad"]>[0], callback: Parameters<PluginBuilder["onLoad"]>[1]) {
          builder.onLoad(filter, (args) => {
            // The upstream adapter writes one CSS file from every onLoad callback.
            const next = pending.then(() => callback(args))
            pending = next.catch(() => undefined)
            return next
          })
        }
      })
    }
  }
}
