import path from "node:path"

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  root: "internal/catalog",
  plugins: [tailwindcss()],
  resolve: {
    alias: [
      { find: "@catalog-vendor", replacement: path.resolve("internal/catalog/vendor/tanstack") },
      { find: "@bridge/ui/style.css", replacement: path.resolve("app/style/global.css") },
      { find: /^@bridge\/ui$/, replacement: path.resolve("app/index.ts") },
      { find: /^@bridge\/ui\/(.*)$/, replacement: path.resolve("$1") }
    ]
  },
  server: { host: "127.0.0.1", port: 6006, strictPort: true, open: true },
  build: { outDir: "../../catalog-dist", emptyOutDir: true }
})
