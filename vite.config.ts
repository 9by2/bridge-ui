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
