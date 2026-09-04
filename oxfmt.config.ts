import { defineConfig } from "oxfmt"

export default defineConfig({
  semi: false,
  singleQuote: false,
  trailingComma: "none",
  objectWrap: "preserve",
  bracketSameLine: true,
  arrowParens: "always",
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  sortPackageJson: false,
  sortImports: {
    newlinesBetween: true,
    sortSideEffects: false,
    internalPattern: ["@/", "package.json"],
    groups: ["builtin", "external", "internal", "parent", "sibling", "index", "style", "unknown"]
  },
  ignorePatterns: [
    ".*",
    "app/config/start/route-tree.ts",
    "**/app/config/route-tree.ts",
    "**/worker-configuration.d.ts",
    "dist",
    "lighthouse-reports",
    "node_modules",
    "test-results"
  ]
})
