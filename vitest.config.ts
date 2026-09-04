import path from "node:path"

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@bridge\/ui$/, replacement: path.resolve(import.meta.dirname, "app/index.ts") },
      { find: /^@bridge\/ui\/(.*)$/, replacement: path.resolve(import.meta.dirname, "$1") }
    ]
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [storybookTest({ configDir: path.resolve(import.meta.dirname, ".storybook") })],
        test: {
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }],
            provider: playwright({})
          },
          name: "storybook"
        }
      }
    ]
  }
})
