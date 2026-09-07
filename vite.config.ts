import path from "node:path"

import stylex from "@stylexjs/unplugin"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  root: "internal/catalog",
  plugins: [stylex.vite({ dev: false, runtimeInjection: false, useCSSLayers: true }), tailwindcss()],
  resolve: {
    alias: [
      { find: "@catalog-upload", replacement: path.resolve("internal/catalog/upload.tsx") },
      { find: "@catalog-vendor", replacement: path.resolve("internal/catalog/vendor/tanstack") },
      { find: "@bridge/ui/style.css", replacement: path.resolve("app/style/global.css") },
      { find: /^@bridge\/ui$/, replacement: path.resolve("app/index.ts") },
      { find: /^@bridge\/ui\/(.*)$/, replacement: path.resolve("$1") }
    ]
  },
  server: { host: "0.0.0.0", allowedHosts: true, port: 6006, strictPort: true, open: true },
  build: { outDir: "../../catalog-dist", emptyOutDir: true }
})
