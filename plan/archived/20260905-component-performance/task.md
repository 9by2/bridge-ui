# Task

- [x] Add memory and bundle regression check.
- [x] Isolate preview and source component; bound lifecycle.
- [x] Ship split ESM and component import contract.
- [x] Verify browser and packed package; archive.

Verification: full browser suite passes with existing expected menu exception. Typecheck, lint, repository test, boundary and packed Bun-installed Vite client/SSR pass. Root and direct Button consumer build each measure 41,067 bytes, React external, with no chart/upload token. Chromium development sample: 8.85 MB JS heap on TsChart; 7.04 MB after returning to Button and collection. This is not total process memory or a baseline comparison. Offscreen iframe destruction and absent closed source DOM are regression-tested. Shared CSS remains non-tree-shaken; registry publication and overall coverage gate remain unfinished.
