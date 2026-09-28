# Global Theme Geometry Evaluation

Run `bun cmd/run-catalog-test.ts ./test/browser/global-theme-geometry.test.ts`.

The runner builds the catalog, starts a Bun server on port 6007, and uses Bun.WebView to open the Select default example. It changes the Theme CSS variables, asserts the Select trigger's computed radius, gap and padding, then opens its portal and asserts the popup radius. `select.png` records the first rendered control after overrides. The checked-in browser test is the reproduction script.
