import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./test/browser",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  workers: 4,
  timeout: 30000,
  use: { baseURL: "http://127.0.0.1:6007", headless: true, trace: "retain-on-failure" },
  webServer: {
    command: "bun catalog:build && bunx vite preview --config vite.config.ts --port 6007 --strictPort --host 127.0.0.1",
    url: "http://127.0.0.1:6007",
    reuseExistingServer: false,
    timeout: 120000
  }
})
