import path from "node:path"

import stylex from "@stylexjs/unplugin"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

import { transformPilotExample } from "./internal/catalog/pilot-transform"

export default defineConfig({
  root: "internal/catalog",
  plugins: [
    { name: "catalog-pilot", enforce: "pre", transform: transformPilotExample },
    stylex.vite({ dev: false, enableMediaQueryOrder: false, runtimeInjection: false, useCSSLayers: true }),
    tailwindcss()
  ],
  resolve: {
    alias: [
      { find: "@catalog-upload?pilot", replacement: `${path.resolve("internal/catalog/upload.tsx")}?pilot` },
      { find: "@catalog-pilot", replacement: path.resolve("internal/catalog/pilot.ts") },
      { find: /^@bridge-owned\/(.*)$/, replacement: path.resolve("app/component/brand/stylex/$1") },
      { find: "@catalog-upload", replacement: path.resolve("internal/catalog/upload.tsx") },
      { find: "@catalog-media", replacement: path.resolve("example") },
      { find: "@catalog-vendor", replacement: path.resolve("internal/catalog/vendor/tanstack") },
      { find: "@bridge/ui/style.css", replacement: path.resolve("app/style/global.css") },
      { find: /^@bridge\/ui$/, replacement: path.resolve("app/index.ts") },
      { find: /^@bridge\/ui\/(.*)$/, replacement: path.resolve("$1") }
    ]
  },
  server: { host: "0.0.0.0", allowedHosts: true, port: 6006, strictPort: true, open: true },
  build: { outDir: "../../catalog-dist", emptyOutDir: true }
})
