import path from "node:path"

import stylex from "@stylexjs/unplugin"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [stylex.vite({ dev: false, runtimeInjection: false })],
  resolve: { alias: { "@bridge/ui/app": path.resolve("app") } },
  esbuild: { jsx: "automatic" },
  test: {
    environment: "jsdom",
    include: ["test/component/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      include:
        process.env.COVERAGE_SCOPE === "repository"
          ? ["app/**/*.{ts,tsx}", "shared/**/*.{ts,tsx}", "internal/**/*.{ts,tsx}", "cmd/**/*.{ts,tsx}"]
          : ["app/component/brand/**/*.tsx"],
      exclude: ["app/component/shadcn/**", "internal/catalog/vendor/**", "internal/catalog/example/**"],
      reporter: ["text", "json-summary"],
      thresholds:
        process.env.COVERAGE_SCOPE === "repository"
          ? {
              statements: 90,
              branches: 90,
              functions: 90,
              lines: 90,
              "app/component/brand/**/*.tsx": { statements: 100, branches: 100, functions: 100, lines: 100 }
            }
          : { perFile: true, statements: 100, branches: 100, functions: 100, lines: 100 }
    }
  }
})
