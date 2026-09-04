import path from "node:path"

import type { StorybookConfig } from "@storybook/react-vite"
import tailwindcss from "@tailwindcss/vite"

const config: StorybookConfig = {
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
  framework: "@storybook/react-vite",
  stories: ["../storybook/**/*.stories.tsx"],
  viteFinal(viteConfig) {
    viteConfig.resolve ??= {}
    viteConfig.resolve.alias = [
      { find: /^@bridge\/ui$/, replacement: path.resolve(import.meta.dirname, "../app/index.ts") },
      { find: /^@bridge\/ui\/(.*)$/, replacement: path.resolve(import.meta.dirname, "../$1") }
    ]
    viteConfig.plugins ??= []
    viteConfig.plugins.push(tailwindcss())
    return viteConfig
  }
}

export default config
