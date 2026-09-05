import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./test/browser",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  workers: 4,
  timeout: 30000,
  use: { baseURL: "http://127.0.0.1:6006", headless: true, trace: "retain-on-failure" },
  webServer: {
    command: "bunx vite --config vite.config.ts --open false",
    url: "http://127.0.0.1:6006",
    reuseExistingServer: !process.env.CI,
    timeout: 60000
  }
})
