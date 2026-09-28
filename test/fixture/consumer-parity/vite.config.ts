import path from "node:path"

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

// Consumer fixture: resolves @bridge/ui to the built package (dist/), never to catalog or app source.
const root = path.resolve(import.meta.dirname, "../../..")
export default defineConfig({
  root: import.meta.dirname,
  base: "./",
  plugins: [tailwindcss()],
  resolve: {
    alias: [
      { find: "@bridge/ui/style.css", replacement: path.join(root, "dist/style.css") },
      { find: /^@bridge\/ui$/, replacement: path.join(root, "dist/index.js") }
    ]
  },
  build: { outDir: path.join(root, "test-results/consumer-parity"), emptyOutDir: true }
})
