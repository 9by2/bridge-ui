import { defineConfig } from "@playwright/test"

import config from "./playwright.config"

export default defineConfig({
  ...config,
  workers: 1,
  use: { ...config.use, baseURL: "http://localhost:6018" },
  webServer: undefined
})
