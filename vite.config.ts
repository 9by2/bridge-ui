import path from "node:path"

import stylex from "@stylexjs/unplugin"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  root: "internal/catalog",
  plugins: [
    stylex.vite({ dev: false, enableMediaQueryOrder: false, runtimeInjection: false, useCSSLayers: true }),
    tailwindcss()
  ],
  resolve: {
    alias: [
      { find: /^@bridge-owned\/(.*)$/, replacement: path.resolve("app/component/brand/stylex/$1") },
      { find: "@catalog-upload", replacement: path.resolve("internal/catalog/upload.tsx") },
      { find: /^@catalog-prototype\/(.*)$/, replacement: path.resolve("internal/catalog/prototype/$1") },
      { find: "@catalog-media", replacement: path.resolve("example") },
      { find: "@catalog-vendor", replacement: path.resolve("internal/catalog/vendor/tanstack") },
      { find: "@bridge/ui/style.css", replacement: path.resolve("app/style/global.css") },
      { find: /^@bridge\/ui$/, replacement: path.resolve("app/index.ts") },
      { find: /^@bridge\/ui\/(.*)$/, replacement: path.resolve("$1") }
    ]
  },
  server: { host: "0.0.0.0", allowedHosts: true, port: 6006 },
  build: {
    outDir: "../../catalog-dist",
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three/")) return "three"
          if (id.includes("node_modules/@tanstack/charts/")) return "tanstack-chart"
          if (id.includes("node_modules/@base-ui/react/")) return "base-ui"
          if (id.includes("node_modules/lucide-react/")) return "lucide"
          if (id.includes("node_modules/d3-") || id.includes("node_modules/topojson-")) return "geo-chart"
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) return "react"
        }
      }
    },
    chunkSizeWarningLimit: 900
  }
})
